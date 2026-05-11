import React from "react";
import { 
  CheckCircle2, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Pencil, 
  Trash2,
  Circle
} from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { ResourceList } from "./ResourceCard";
import { cn } from "../../lib/utils";

export function MilestoneTimeline({ 
  milestones, 
  expandedMilestones, 
  toggleMilestone, 
  handleComplete, 
  recentlyCompleted, 
  completingId, 
  setEditingMilestone, 
  setMTitle, 
  setMDesc, 
  setMDays, 
  setEditMilestoneOpen, 
  deleteMilestoneMutation,
  resourceFilter,
  setResourceFilter
}) {
  return (
    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 md:before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500/50 before:via-slate-800 before:to-transparent">
      {milestones.map((milestone, index) => {
        const isExpanded = expandedMilestones.has(milestone.id);
        const justCompleted = recentlyCompleted.has(milestone.id);
        const isCompleting = completingId === milestone.id;

        return (
          <div key={milestone.id} className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group">

            {/* Timeline dot */}
            <div className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-950 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10 transition-all duration-500",
              milestone.completed ? 'bg-emerald-500/20' : 'bg-slate-900'
            )}>
              {milestone.completed ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              ) : (
                <div className={cn(
                  "h-2.5 w-2.5 rounded-full transition-colors duration-300",
                  isExpanded ? 'bg-indigo-400' : 'bg-slate-600 group-hover:bg-indigo-400'
                )} />
              )}
            </div>

            {/* Content Card */}
            <Card
              className={cn(
                "w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] transition-all duration-500 border overflow-hidden",
                milestone.completed
                  ? 'border-emerald-500/20 bg-emerald-950/10 opacity-75 hover:opacity-100'
                  : isExpanded
                    ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/10 bg-slate-900/90 scale-[1.02]'
                    : 'border-slate-800 bg-slate-900/50 hover:border-indigo-500/30',
                justCompleted && 'animate-[pulse_1s_ease-in-out_1]'
              )}
            >
              {/* Clickable Header for Collapsing */}
              <div
                className={cn("p-4 sm:p-5 cursor-pointer flex items-center justify-between gap-4", isExpanded && 'bg-slate-800/30')}
                onClick={() => toggleMilestone(milestone.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm",
                      milestone.completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'
                    )}>
                      Step {index + 1}
                    </span>
                    <span className="flex items-center text-xs text-slate-500 font-medium">
                      <Clock className="mr-1.5 h-3.5 w-3.5" />
                      {milestone.estimated_days} {milestone.estimated_days === 1 ? 'day' : 'days'}
                    </span>
                  </div>
                  <h3 className={cn(
                    "text-base sm:text-lg font-bold truncate transition-colors",
                    milestone.completed ? 'text-slate-400 line-through' : 'text-slate-100 group-hover:text-indigo-300'
                  )}>
                    {milestone.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {!milestone.completed && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingMilestone(milestone);
                          setMTitle(milestone.title);
                          setMDesc(milestone.description || "");
                          setMDays(milestone.estimated_days);
                          setEditMilestoneOpen(true);
                        }}
                        className="p-1.5 rounded-md text-slate-500 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
                        title="Edit milestone"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (!window.confirm(`Delete milestone "${milestone.title}"?`)) return;
                          deleteMilestoneMutation.mutate(milestone.id);
                        }}
                        className="p-1.5 rounded-md text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Delete milestone"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  {milestone.completed && !isExpanded && (
                     <span className="hidden sm:flex text-emerald-500 text-sm font-medium items-center">
                       Done
                     </span>
                  )}
                  <div className={cn(
                    "p-1.5 rounded-md transition-colors",
                    isExpanded ? 'bg-slate-800 text-white' : 'text-slate-500 group-hover:text-white group-hover:bg-slate-800'
                  )}>
                    {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </div>
              </div>

              {/* Collapsible Content */}
              <div className={cn(
                "transition-all duration-300 ease-in-out origin-top",
                isExpanded ? 'max-h-[800px] opacity-100 p-4 sm:p-5 pt-0 border-t border-slate-800/50' : 'max-h-0 opacity-0 overflow-hidden px-4 sm:px-5 border-t-0'
              )}>
                <div className="pt-4 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                  <p className={cn("text-sm leading-relaxed flex-1", milestone.completed ? 'text-slate-500' : 'text-slate-300')}>
                    {milestone.description}
                  </p>

                  <div className="shrink-0 w-full sm:w-auto">
                    {!milestone.completed ? (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleComplete(milestone.id);
                        }}
                        className="w-full sm:w-auto"
                        isLoading={isCompleting}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Mark Done
                      </Button>
                    ) : (
                      <div className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 rounded-md bg-emerald-500/10 text-emerald-400 text-sm font-bold border border-emerald-500/20">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Completed
                      </div>
                    )}
                  </div>
                </div>

                {/* Resources Section */}
                {milestone.resources && milestone.resources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-800/40">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Learning Resources</h4>
                      <div className="flex gap-1">
                        {["all", "video", "article", "course", "docs"].map((type) => (
                          <button
                            key={type}
                            onClick={(e) => { e.stopPropagation(); setResourceFilter(type); }}
                            className={cn(
                              "px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                              resourceFilter === type
                                ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                                : "text-slate-500 hover:text-slate-300 border border-transparent hover:bg-white/5"
                            )}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                    <ResourceList resources={milestone.resources} filter={resourceFilter} />
                  </div>
                )}
              </div>
            </Card>

          </div>
        );
      })}
    </div>
  );
}
