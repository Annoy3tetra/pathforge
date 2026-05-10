import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Sparkles, ArrowRight, CheckCircle2, Circle, Compass, BrainCircuit, ArrowUp, RefreshCw, AlertCircle, Trash2 } from "lucide-react";

import { DashboardLayout } from "../layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { ProgressBar } from "../components/ui/ProgressBar";
import { Skeleton } from "../components/ui/Skeleton";
import { RoadmapFeedbackBadge } from "../components/ui/RoadmapFeedbackBadge";

import { useRoadmaps, useGenerateRoadmap, useCompleteMilestone, useDeleteRoadmap } from "../hooks/useRoadmaps";
import { useProfile } from "../hooks/useProfile";
import { InsightsCards } from "../components/ui/InsightsCards";

// AI Loading Phrases
const AI_PHRASES = [
  "Analyzing your goal...",
  "Consulting knowledge base...",
  "Structuring learning path...",
  "Drafting key milestones...",
  "Estimating completion times...",
  "Finalizing your roadmap..."
];

const SUGGESTED_GOALS = [
  "Machine Learning",
  "Web Development",
  "Data Structures & Algorithms",
  "DevOps",
  "Mobile App Development"
];

function DashboardPage() {
  const [goal, setGoal] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [generationError, setGenerationError] = useState(null);

  // TanStack Query hooks
  const { data: roadmaps = [], isLoading: initialLoad } = useRoadmaps();
  const { data: profile } = useProfile();
  
  const generateMutation = useGenerateRoadmap();
  const completeMutation = useCompleteMilestone();
  const deleteMutation = useDeleteRoadmap();
  
  const hasIncompleteProfile = !profile || !profile.skill_level || !profile.weekly_study_hours || !profile.career_goal;

  const loading = generateMutation.isPending;

  // Handle AI Phrase Rotation
  useEffect(() => {
    let interval;
    if (loading) {
      setPhraseIndex(0);
      interval = setInterval(() => {
        setPhraseIndex((prev) => (prev + 1) % AI_PHRASES.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleGenerate = async () => {
    if (!goal.trim()) return;
    setGenerationError(null);
    try {
      await generateMutation.mutateAsync(goal);
      setGoal("");
    } catch (error) {
      const detail = error.response?.data?.detail;
      const errorMsg = typeof detail === "object" ? detail.error : "Generation failed. Please try again.";
      setGenerationError(errorMsg);
    }
  };

  const handleComplete = (milestoneId) => {
    completeMutation.mutate(milestoneId);
  };

  const handleDelete = (roadmapId) => {
    if (!window.confirm("Are you sure you want to delete this roadmap? This cannot be undone.")) return;
    deleteMutation.mutate(roadmapId);
  };

  if (initialLoad) {
    return (
      <DashboardLayout title="Dashboard">
        {/* Skeleton Generate Section */}
        <Skeleton className="h-48 w-full mb-8 rounded-xl" />

        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="flex flex-col h-72">
              <CardHeader className="pb-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6 mt-1" />
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <Skeleton className="h-2.5 w-full rounded-full" />
                <div className="space-y-2 mt-6">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard">
      {/* Generate Section */}
      <Card className={`mb-8 overflow-hidden transition-all duration-500 ${
        loading ? "border-indigo-500/50 shadow-[0_0_30px_-5px_rgba(99,102,241,0.2)]" : generationError ? "border-rose-500/30 bg-gradient-to-br from-slate-900 to-rose-950/10" : "bg-gradient-to-br from-slate-900 to-indigo-950/20 border-indigo-500/20"
      }`}>
        <div className={`h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 transition-all duration-1000 ${loading ? "opacity-100 bg-[length:200%_100%] animate-[gradient_2s_linear_infinite]" : "opacity-0"}`} />
        
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className={`h-5 w-5 ${loading ? "text-indigo-400 animate-pulse" : "text-indigo-400"}`} />
            {loading ? "AI is forging your path..." : "Generate New Roadmap"}
          </CardTitle>
          <CardDescription>
            {loading ? "Please wait while our AI analyzes your goal and creates a customized learning journey." : "Tell our AI what you want to learn, and we'll create a step-by-step path for you."}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-6 bg-slate-950/50 rounded-lg border border-slate-800">
              <BrainCircuit className="h-10 w-10 text-indigo-400 animate-pulse mb-4" />
              <p className="text-sm font-medium text-indigo-300 animate-pulse transition-all duration-300">
                {AI_PHRASES[phraseIndex]}
              </p>
              <div className="w-48 h-1.5 bg-slate-800 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-indigo-500 animate-[pulse_1s_ease-in-out_infinite]" style={{ width: '100%', transformOrigin: 'left', animationName: 'progress' }} />
              </div>
            </div>
          ) : generationError ? (
            <div className="flex flex-col items-center justify-center py-6 bg-rose-950/20 rounded-lg border border-rose-500/20">
              <AlertCircle className="h-10 w-10 text-rose-400 mb-3" />
              <p className="text-sm font-semibold text-rose-300 mb-1">Generation Failed</p>
              <p className="text-xs text-slate-400 mb-4 max-w-md text-center">{generationError}</p>
              <Button
                onClick={() => { setGenerationError(null); handleGenerate(); }}
                className="bg-rose-600 hover:bg-rose-500"
                disabled={!goal.trim()}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry Generation
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="text"
                  placeholder="e.g., I want to become a full-stack developer in 6 months..."
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="flex-1 bg-slate-950/50"
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  disabled={loading}
                />
                <Button
                  onClick={handleGenerate}
                  disabled={!goal.trim() || loading}
                  className="sm:w-auto w-full group"
                >
                  <Sparkles className="mr-2 h-4 w-4 group-hover:animate-spin" />
                  Generate Path
                </Button>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Suggestions:</span>
                {SUGGESTED_GOALS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setGoal(suggestion)}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-full transition-colors border border-slate-700"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                  Roadmaps are personalized using your profile.
                </p>
                {hasIncompleteProfile && (
                  <Link 
                    to="/profile" 
                    className="text-xs bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 px-3 py-1.5 rounded-md font-medium transition-colors border border-indigo-500/20"
                  >
                    Complete Profile for Better AI
                  </Link>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Learning Insights */}
      {roadmaps.length > 0 && <InsightsCards />}

      {/* Roadmaps Grid */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-100">Your Learning Paths</h2>
        <span className="text-sm text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full">
          {roadmaps.length} {roadmaps.length === 1 ? 'path' : 'paths'}
        </span>
      </div>

      {roadmaps.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-20 px-4 text-center border-dashed border-2 border-slate-700 bg-slate-900/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-900/0 to-slate-900/0"></div>
          
          <div className="relative flex flex-col items-center">
            <div className="h-20 w-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 border border-indigo-500/20">
              <Compass className="h-10 w-10 text-indigo-400" />
            </div>
            <CardTitle className="mb-3 text-2xl">Your journey begins here</CardTitle>
            <CardDescription className="max-w-md text-base mb-8">
              You haven't forged any learning paths yet. Let our AI guide you by typing what you want to learn above.
            </CardDescription>
            
            <div className="flex items-center text-indigo-400 animate-bounce">
              <ArrowUp className="mr-2 h-5 w-5" />
              <span className="font-medium">Try a suggestion above!</span>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmaps.map((roadmap) => {
            const total = roadmap.milestones.length;
            const completed = roadmap.milestones.filter((m) => m.completed).length;
            const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

            return (
              <Card key={roadmap.id} className="flex flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/10 hover:border-indigo-500/50 group bg-slate-900/80">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <CardTitle className="line-clamp-1" title={roadmap.title}>
                      {roadmap.title}
                    </CardTitle>
                    <RoadmapFeedbackBadge roadmapId={roadmap.id} />
                  </div>
                  <CardDescription className="line-clamp-2 min-h-[40px]">
                    {roadmap.description || "No description provided."}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <div className="space-y-1.5 mb-5">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400 font-medium">Progress</span>
                      <span className="text-indigo-400 font-bold">{progress}%</span>
                    </div>
                    <ProgressBar progress={progress} />
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Next Milestones</h4>
                    {roadmap.milestones.slice(0, 3).map((milestone) => (
                      <div key={milestone.id} className="flex items-start gap-3">
                        <button 
                          onClick={() => !milestone.completed && handleComplete(milestone.id)}
                          className={`mt-0.5 shrink-0 transition-colors ${
                            milestone.completed 
                              ? "text-emerald-500" 
                              : "text-slate-600 hover:text-indigo-400"
                          }`}
                          disabled={milestone.completed}
                        >
                          {milestone.completed ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <Circle className="h-5 w-5" />
                          )}
                        </button>
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm truncate ${
                            milestone.completed ? "text-slate-500 line-through" : "text-slate-300"
                          }`}>
                            {milestone.title}
                          </p>
                        </div>
                      </div>
                    ))}
                    {roadmap.milestones.length > 3 && (
                      <p className="text-xs text-slate-500 pl-8">
                        + {roadmap.milestones.length - 3} more
                      </p>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="pt-0 mt-auto">
                  <div className="flex gap-2 w-full">
                    <Link to={`/roadmaps/${roadmap.id}`} className="flex-1">
                      <Button variant="secondary" className="w-full group-hover:bg-slate-700">
                        View Full Path
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <button
                      onClick={() => handleDelete(roadmap.id)}
                      className="p-2.5 rounded-md border border-slate-700 text-slate-500 hover:text-rose-400 hover:border-rose-500/50 hover:bg-rose-500/10 transition-colors"
                      title="Delete roadmap"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}

export default DashboardPage;