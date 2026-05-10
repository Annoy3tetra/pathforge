import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Circle, 
  Compass, 
  BrainCircuit, 
  ArrowUp, 
  RefreshCw, 
  AlertCircle, 
  Trash2,
  TrendingUp,
  Layout
} from "lucide-react";

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
import { cn } from "../lib/utils";

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
  "Data Structures",
  "DevOps",
  "Mobile Apps"
];

function DashboardPage() {
  const [goal, setGoal] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [generationError, setGenerationError] = useState(null);

  const { data: roadmaps = [], isLoading: initialLoad } = useRoadmaps();
  const { data: profile } = useProfile();
  
  const generateMutation = useGenerateRoadmap();
  const completeMutation = useCompleteMilestone();
  const deleteMutation = useDeleteRoadmap();
  
  const hasIncompleteProfile = !profile || !profile.skill_level || !profile.weekly_study_hours || !profile.career_goal;
  const loading = generateMutation.isPending;

  useEffect(() => {
    let interval;
    if (loading) {
      setPhraseIndex(0);
      interval = setInterval(() => {
        setPhraseIndex((prev) => (prev + 1) % AI_PHRASES.length);
      }, 2500);
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
    if (!window.confirm("Are you sure you want to delete this roadmap?")) return;
    deleteMutation.mutate(roadmapId);
  };

  if (initialLoad) {
    return (
      <DashboardLayout title="Dashboard">
        <Skeleton className="h-56 w-full mb-10 rounded-2xl" />
        <div className="mb-8 flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-80 shadow-none bg-white/5 border-white/5">
              <CardHeader><Skeleton className="h-6 w-3/4 mb-3" /><Skeleton className="h-4 w-full" /></CardHeader>
              <CardContent><Skeleton className="h-3 w-full rounded-full mb-8" /><Skeleton className="h-20 w-full" /></CardContent>
            </Card>
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Overview">
      {/* ─── AI Generate Section ─── */}
      <section className="mb-12">
        <Card className={cn(
          "relative overflow-hidden transition-all duration-500 border-indigo-500/10",
          loading && "border-indigo-500/40 shadow-2xl shadow-indigo-500/20"
        )}>
          {/* Animated top border */}
          <AnimatePresence>
            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-[gradient_2s_linear_infinite]" 
              />
            )}
          </AnimatePresence>
          
          <CardHeader className="relative z-10">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <Sparkles className={cn("h-5 w-5 text-indigo-400", loading && "animate-spin")} />
              </div>
              <div>
                <CardTitle>{loading ? "AI Forging Your Path..." : "Forge New Path"}</CardTitle>
                <CardDescription>
                  {loading ? "Analyzing global knowledge to build your custom curriculum." : "Describe your learning goal and we'll generate a personalized AI roadmap."}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="relative z-10">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex flex-col items-center justify-center py-10 bg-indigo-500/5 rounded-2xl border border-indigo-500/10"
                >
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="mb-6"
                  >
                    <BrainCircuit className="h-12 w-12 text-indigo-400" />
                  </motion.div>
                  <p className="text-lg font-semibold text-indigo-100 mb-2">
                    {AI_PHRASES[phraseIndex]}
                  </p>
                  <div className="w-64 h-1.5 bg-slate-800 rounded-full mt-4 overflow-hidden relative">
                    <motion.div 
                      className="absolute inset-y-0 bg-indigo-500 w-1/2 rounded-full"
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                </motion.div>
              ) : generationError ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-10 bg-rose-500/5 rounded-2xl border border-rose-500/10"
                >
                  <AlertCircle className="h-12 w-12 text-rose-400 mb-4" />
                  <p className="text-lg font-bold text-rose-200 mb-2">Generation Failed</p>
                  <p className="text-sm text-slate-400 mb-6 text-center max-w-md">{generationError}</p>
                  <Button
                    onClick={() => { setGenerationError(null); handleGenerate(); }}
                    variant="danger"
                    disabled={!goal.trim()}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retry Generation
                  </Button>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                      type="text"
                      placeholder="e.g., Become a Senior Machine Learning Engineer..."
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="flex-1 text-base h-12"
                      onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    />
                    <Button
                      onClick={handleGenerate}
                      disabled={!goal.trim() || loading}
                      className="h-12 px-8 min-w-[160px]"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Suggestions:</span>
                    {SUGGESTED_GOALS.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setGoal(suggestion)}
                        className="text-xs font-medium text-slate-400 bg-slate-800/50 hover:bg-indigo-500/10 hover:text-indigo-400 px-3 py-1.5 rounded-full transition-all border border-white/5 hover:border-indigo-500/30"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Sparkles className="h-3 w-3 text-indigo-400" />
                      <span>Optimized for your profile skill level & career goals</span>
                    </div>
                    {hasIncompleteProfile && (
                      <Link to="/profile">
                        <Button variant="ghost" size="sm" className="text-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/20">
                          Complete Profile for better AI
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </section>

      {/* ─── Insights Section ─── */}
      <AnimatePresence>
        {roadmaps.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">Learning Insights</h2>
            </div>
            <InsightsCards />
          </motion.section>
        )}
      </AnimatePresence>

      {/* ─── Roadmaps Grid ─── */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Layout className="h-5 w-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Your Active Paths</h2>
          </div>
          <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-slate-400 uppercase tracking-widest">
            {roadmaps.length} {roadmaps.length === 1 ? 'Path' : 'Paths'}
          </div>
        </div>

        {roadmaps.length === 0 ? (
          <Card className="py-24 text-center border-dashed border-2 bg-transparent">
            <div className="max-w-md mx-auto px-4 flex flex-col items-center">
              <div className="h-20 w-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-8 border border-indigo-500/20">
                <Compass className="h-10 w-10 text-indigo-400 animate-pulse" />
              </div>
              <CardTitle className="text-2xl mb-4">No learning paths yet</CardTitle>
              <CardDescription className="text-base mb-8">
                Your future is waiting to be forged. Type your goal above and let PathForge design your success.
              </CardDescription>
              <ArrowUp className="text-indigo-400 animate-bounce h-6 w-6" />
            </div>
          </Card>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="show"
            variants={{
              show: { transition: { staggerChildren: 0.1 } }
            }}
          >
            {roadmaps.map((roadmap) => (
              <RoadmapCard 
                key={roadmap.id} 
                roadmap={roadmap} 
                onDelete={handleDelete}
                onComplete={handleComplete}
              />
            ))}
          </motion.div>
        )}
      </section>
    </DashboardLayout>
  );
}

// ─── Sub-Components ───

function RoadmapCard({ roadmap, onDelete, onComplete }) {
  const total = roadmap.milestones.length;
  const completed = roadmap.milestones.filter((m) => m.completed).length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
    >
      <Card animate className="group flex flex-col h-full hover:border-indigo-500/30">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start gap-4 mb-2">
            <CardTitle className="text-lg line-clamp-1 group-hover:text-indigo-400 transition-colors">
              {roadmap.title}
            </CardTitle>
            <RoadmapFeedbackBadge roadmapId={roadmap.id} />
          </div>
          <CardDescription className="line-clamp-2 h-10">
            {roadmap.description || "Personalized learning curriculum for this goal."}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1">
          <div className="space-y-2 mb-6">
            <div className="flex justify-between items-end text-sm">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Progress</span>
              <span className="text-indigo-400 font-black">{progress}%</span>
            </div>
            <ProgressBar progress={progress} className="h-1.5" />
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Next Steps</h4>
            {roadmap.milestones.slice(0, 3).map((milestone) => (
              <div key={milestone.id} className="flex items-start gap-3 group/item">
                <button 
                  onClick={() => !milestone.completed && onComplete(milestone.id)}
                  className={cn(
                    "mt-0.5 shrink-0 transition-all",
                    milestone.completed 
                      ? "text-emerald-500 scale-110" 
                      : "text-slate-600 hover:text-indigo-400 hover:scale-110"
                  )}
                  disabled={milestone.completed}
                >
                  {milestone.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                </button>
                <span className={cn(
                  "text-sm truncate transition-colors",
                  milestone.completed ? "text-slate-600 line-through" : "text-slate-300 group-hover/item:text-white"
                )}>
                  {milestone.title}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="pt-2 border-t border-white/5">
          <div className="flex gap-2 w-full">
            <Link to={`/roadmaps/${roadmap.id}`} className="flex-1">
              <Button variant="secondary" className="w-full justify-between pr-3 group-hover:bg-slate-700">
                View Full Path
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <button
              onClick={() => onDelete(roadmap.id)}
              className="p-3 rounded-xl border border-white/5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default DashboardPage;