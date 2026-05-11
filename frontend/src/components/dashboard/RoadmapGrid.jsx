import { memo, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Compass, 
  ArrowUp, 
  Layout,
  ArrowRight,
  CheckCircle2,
  Circle,
  Trash2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/Card";
import { Button } from "../ui/Button";
import { ProgressBar } from "../ui/ProgressBar";
import { RoadmapFeedbackBadge } from "../roadmap/RoadmapFeedbackBadge";
import { cn } from "../../lib/utils";

export const RoadmapGrid = memo(({ roadmaps, handleDelete, handleComplete }) => {
  if (roadmaps.length === 0) {
    return (
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
    );
  }

  return (
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {roadmaps.map((roadmap) => (
          <RoadmapCard 
            key={roadmap.id} 
            roadmap={roadmap} 
            onDelete={handleDelete}
            onComplete={handleComplete}
          />
        ))}
      </div>
    </section>
  );
});

const RoadmapCard = memo(({ roadmap, onDelete, onComplete }) => {
  const { progress, visibleMilestones, hiddenCount } = useMemo(() => {
    const milestones = roadmap.milestones || [];
    const total = milestones.length;
    const completed = milestones.filter((m) => m.completed).length;

    return {
      progress: total === 0 ? 0 : Math.round((completed / total) * 100),
      visibleMilestones: milestones.slice(0, 3),
      hiddenCount: Math.max(total - 3, 0),
    };
  }, [roadmap.milestones]);

  const handleDelete = useCallback(() => onDelete(roadmap.id), [onDelete, roadmap.id]);
  const handleMilestoneComplete = useCallback((milestoneId) => {
    onComplete(milestoneId);
  }, [onComplete]);

  return (
    <div>
      <Card animate className="group flex flex-col h-full hover:border-indigo-500/30 transition-[border-color,background-color] duration-300">
        <CardHeader className="pb-4 shrink-0">
          <div className="flex justify-between items-start gap-4 mb-3">
            <CardTitle className="text-lg font-bold line-clamp-2 group-hover:text-indigo-400 transition-colors leading-snug">
              {roadmap.title}
            </CardTitle>
            <div className="shrink-0 mt-1">
              <RoadmapFeedbackBadge roadmapId={roadmap.id} />
            </div>
          </div>
          <CardDescription className="line-clamp-2 text-sm min-h-[2.5rem] overflow-hidden">
            {roadmap.description || "Personalized learning curriculum for this goal."}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col pt-2">
          {/* Progress Section */}
          <div className="space-y-2 mb-8">
            <div className="flex justify-between items-end text-sm">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Progress</span>
              <span className="text-indigo-400 font-black tabular-nums">{progress}%</span>
            </div>
            <ProgressBar progress={progress} className="h-1.5" />
          </div>

          {/* Next Steps Section */}
          <div className="space-y-4 flex-1">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Next Milestones</h4>
            <div className="space-y-3">
              {visibleMilestones.map((milestone) => (
                <MilestonePreview
                  key={milestone.id}
                  milestone={milestone}
                  onComplete={handleMilestoneComplete}
                />
              ))}
              {hiddenCount > 0 && (
                <p className="text-[10px] text-slate-500 font-bold italic ml-7">
                  + {hiddenCount} more steps
                </p>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-4 border-t border-white/5 shrink-0">
          <div className="flex gap-2 w-full items-center">
            <Link to={`/roadmaps/${roadmap.id}`} className="flex-1 min-w-0">
              <Button variant="secondary" className="w-full justify-between pr-3 group-hover:bg-slate-700/50 transition-colors h-10">
                <span className="truncate">View Path</span>
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <button
              onClick={handleDelete}
              className="p-2.5 rounded-xl border border-white/5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all"
              title="Delete roadmap"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
});

const MilestonePreview = memo(({ milestone, onComplete }) => {
  const handleClick = useCallback(() => {
    if (!milestone.completed) onComplete(milestone.id);
  }, [milestone.completed, milestone.id, onComplete]);

  return (
    <div className="flex items-start gap-3 group/item min-w-0">
      <button
        onClick={handleClick}
        className={cn(
          "mt-0.5 shrink-0 transition-colors",
          milestone.completed
            ? "text-emerald-500"
            : "text-slate-600 hover:text-indigo-400"
        )}
        disabled={milestone.completed}
      >
        {milestone.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
      </button>
      <span className={cn(
        "text-sm break-words line-clamp-1 transition-colors leading-tight flex-1",
        milestone.completed ? "text-slate-600 line-through" : "text-slate-300 group-hover/item:text-white"
      )}>
        {milestone.title}
      </span>
    </div>
  );
});
