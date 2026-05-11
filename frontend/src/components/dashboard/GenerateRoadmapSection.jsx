import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  BrainCircuit, 
  RefreshCw, 
  AlertCircle 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { cn } from "../../lib/utils";

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

export const GenerateRoadmapSection = memo(({ generateMutation, profile }) => {
  const navigate = useNavigate();
  const [goal, setGoal] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [generationError, setGenerationError] = useState(null);

  const hasIncompleteProfile = useMemo(
    () => !profile || !profile.skill_level || !profile.weekly_study_hours || !profile.career_goal,
    [profile]
  );
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

  const handleGenerate = useCallback(async () => {
    if (!goal.trim()) return;
    setGenerationError(null);
    try {
      await generateMutation.mutateAsync(goal);
      setGoal("");
      navigate("/my-roadmaps");
    } catch (error) {
      const detail = error.response?.data?.detail;
      const errorMsg = typeof detail === "object" ? detail.error : "Generation failed. Please try again.";
      setGenerationError(errorMsg);
    }
  }, [generateMutation, goal, navigate]);

  const handleRetry = useCallback(() => {
    setGenerationError(null);
    handleGenerate();
  }, [handleGenerate]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter") handleGenerate();
  }, [handleGenerate]);

  return (
    <section className="mb-12">
      <Card className={cn(
        "relative overflow-hidden transition-all duration-500 border-indigo-500/10",
        loading && "border-indigo-500/40 shadow-2xl shadow-indigo-500/20"
      )}>
        {loading && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500/80" />
        )}
        
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
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
                <div className="mb-6 animate-spin motion-reduce:animate-none">
                  <BrainCircuit className="h-12 w-12 text-indigo-400" />
                </div>
                <p className="text-lg font-semibold text-indigo-100 mb-2">
                  {AI_PHRASES[phraseIndex]}
                </p>
                <div className="w-64 h-1.5 bg-slate-800 rounded-full mt-4 overflow-hidden relative">
                  <div className="absolute inset-y-0 bg-indigo-500 w-1/2 rounded-full animate-[progress_1.5s_ease-in-out_infinite] motion-reduce:animate-none" />
                </div>
              </div>
            ) : generationError ? (
              <div className="flex flex-col items-center justify-center py-10 bg-rose-500/5 rounded-2xl border border-rose-500/10">
                <AlertCircle className="h-12 w-12 text-rose-400 mb-4" />
                <p className="text-lg font-bold text-rose-200 mb-2">Generation Failed</p>
                <p className="text-sm text-slate-400 mb-6 text-center max-w-md">{generationError}</p>
                <Button
                  onClick={handleRetry}
                  variant="danger"
                  disabled={!goal.trim()}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry Generation
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    type="text"
                    placeholder="e.g., Become a Senior Machine Learning Engineer..."
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="flex-1 text-base h-12"
                    onKeyDown={handleKeyDown}
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
        </CardContent>
      </Card>
    </section>
  );
});
