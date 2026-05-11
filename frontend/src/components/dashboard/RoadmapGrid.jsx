import React from "react";
import { motion } from "framer-motion";
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

export function RoadmapGrid({ roadmaps, handleDelete, handleComplete }) {
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
    </section>
  );
}

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
