import { memo, useCallback, useState } from "react";
import { 
  CheckCircle2, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Pencil, 
  Trash2,
} from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { ResourceList } from "./ResourceCard";
import { cn } from "../../lib/utils";

const MilestoneItem = memo(({ 
  milestone, 
  index,
  isExpanded, 
  justCompleted, 
  isCompleting,
  toggleMilestone, 
  handleComplete, 
  setEditingMilestone, 
  setMTitle, 
  setMDesc, 
  setMDays, 
  setEditMilestoneOpen, 
  deleteMilestoneMutation,
}) => {
  const [resourceFilter, setResourceFilter] = useState("all");
  const handleToggle = useCallback(() => toggleMilestone(milestone.id), [milestone.id, toggleMilestone]);
  const handleCompleteClick = useCallback((e) => {
    e.stopPropagation();
    handleComplete(milestone.id);
  }, [handleComplete, milestone.id]);
  const handleEditClick = useCallback((e) => {
    e.stopPropagation();
    setEditingMilestone(milestone);
    setMTitle(milestone.title);
    setMDesc(milestone.description || "");
    setMDays(milestone.estimated_days);
    setEditMilestoneOpen(true);
  }, [milestone, setEditMilestoneOpen, setEditingMilestone, setMDesc, setMDays, setMTitle]);
  const handleDeleteClick = useCallback((e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete milestone "${milestone.title}"?`)) return;
    deleteMilestoneMutation.mutate(milestone.id);
  }, [deleteMilestoneMutation, milestone.id, milestone.title]);

  return (
    <div className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group">
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
          "w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] transition-[border-color,background-color,transform,opacity] duration-300 border overflow-hidden",
          milestone.completed
            ? 'border-emerald-500/10 bg-emerald-950/5 opacity-75'
            : isExpanded
              ? 'border-indigo-500/30 bg-slate-900/90 shadow-lg shadow-indigo-500/10'
              : 'border-slate-800 bg-slate-900/40 hover:border-indigo-500/20',
          justCompleted && 'ring-2 ring-emerald-500/50'
        )}
      >
        {/* Clickable Header for Collapsing */}
        <div
          className={cn("p-4 sm:p-5 cursor-pointer flex items-center justify-between gap-4", isExpanded && 'bg-slate-800/20')}
          onClick={handleToggle}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1.5">
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm",
                milestone.completed ? 'bg-emerald-500/10 text-emerald-400/80' : 'bg-indigo-500/10 text-indigo-400/80'
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
              milestone.completed ? 'text-slate-500 line-through' : 'text-slate-100 group-hover:text-indigo-300'
            )}>
              {milestone.title}
            </h3>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {!milestone.completed && (
              <>
                <button
                  onClick={handleEditClick}
                  className="p-1.5 rounded-md text-slate-500 hover:text-indigo-400 hover:bg-slate-800/50 transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="p-1.5 rounded-md text-slate-500 hover:text-rose-400 hover:bg-slate-800/50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
            <div className={cn(
              "p-1.5 rounded-md transition-colors",
              isExpanded ? 'bg-slate-800 text-white' : 'text-slate-500 group-hover:text-white'
            )}>
              {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>
          </div>
        </div>

        {/* Collapsible Content */}
        {isExpanded && (
          <div className="p-4 sm:p-5 pt-0 border-t border-slate-800/40">
            <div className="pt-4 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <p className={cn("text-sm leading-relaxed flex-1", milestone.completed ? 'text-slate-500' : 'text-slate-300')}>
                {milestone.description}
              </p>

              <div className="shrink-0 w-full sm:w-auto">
                {!milestone.completed ? (
                  <Button
                    size="sm"
                    onClick={handleCompleteClick}
                    className="w-full sm:w-auto"
                    isLoading={isCompleting}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Mark Done
                  </Button>
                ) : (
                  <div className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 rounded-md bg-emerald-500/5 text-emerald-400/80 text-sm font-bold border border-emerald-500/10">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Completed
                  </div>
                )}
              </div>
            </div>

            {/* Resources Section */}
            {milestone.resources && milestone.resources.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-800/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Learning Resources</h4>
                  <div className="flex flex-wrap gap-1">
                    {["all", "video", "article", "course", "docs"].map((type) => (
                      <button
                        key={type}
                        onClick={(e) => { e.stopPropagation(); setResourceFilter(type); }}
                        className={cn(
                          "px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                          resourceFilter === type
                            ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                            : "text-slate-500 hover:text-slate-300 border border-transparent"
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
        )}
      </Card>
    </div>
  );
});

export const MilestoneTimeline = memo(({ 
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
}) => {
  return (
    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 md:before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500/30 before:via-slate-800/50 before:to-transparent">
      {milestones.map((milestone, index) => (
        <MilestoneItem 
          key={milestone.id}
          milestone={milestone}
          index={index}
          isExpanded={expandedMilestones.has(milestone.id)}
          justCompleted={recentlyCompleted.has(milestone.id)}
          isCompleting={completingId === milestone.id}
          toggleMilestone={toggleMilestone}
          handleComplete={handleComplete}
          setEditingMilestone={setEditingMilestone}
          setMTitle={setMTitle}
          setMDesc={setMDesc}
          setMDays={setMDays}
          setEditMilestoneOpen={setEditMilestoneOpen}
          deleteMilestoneMutation={deleteMilestoneMutation}
        />
      ))}
    </div>
  );
});
