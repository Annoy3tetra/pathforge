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
        "flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-50 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10 transition-all duration-500",
        milestone.completed ? 'bg-emerald-50' : 'bg-white'
      )}>
        {milestone.completed ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        ) : (
          <div className={cn(
            "h-2.5 w-2.5 rounded-full transition-colors duration-300",
            isExpanded ? 'bg-indigo-500' : 'bg-slate-300 group-hover:bg-indigo-400'
          )} />
        )}
      </div>

      {/* Content Card */}
      <Card
        className={cn(
          "w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] transition-all duration-300 border overflow-hidden",
          milestone.completed
            ? 'border-emerald-100 bg-emerald-50/30 opacity-80'
            : isExpanded
              ? 'border-indigo-200 bg-white shadow-md shadow-indigo-50'
              : 'border-slate-200 bg-white hover:border-indigo-200',
          justCompleted && 'ring-2 ring-emerald-300'
        )}
      >
        {/* Clickable Header for Collapsing */}
        <div
          className={cn("p-4 sm:p-5 cursor-pointer flex items-center justify-between gap-4", isExpanded && 'bg-slate-50/50')}
          onClick={handleToggle}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1.5">
              <span className={cn(
                "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md",
                milestone.completed ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
              )}>
                Step {index + 1}
              </span>
              <span className="flex items-center text-xs text-slate-400 font-medium">
                <Clock className="mr-1.5 h-3.5 w-3.5" />
                {milestone.estimated_days} {milestone.estimated_days === 1 ? 'day' : 'days'}
              </span>
            </div>
            <h3 className={cn(
              "text-base sm:text-lg font-semibold truncate transition-colors",
              milestone.completed ? 'text-slate-400 line-through' : 'text-slate-800 group-hover:text-indigo-600'
            )}>
              {milestone.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!milestone.completed && (
              <>
                <button
                  onClick={handleEditClick}
                  className="p-1.5 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
            <div className={cn(
              "p-1.5 rounded-md transition-colors",
              isExpanded ? 'bg-slate-100 text-slate-700' : 'text-slate-400 group-hover:text-slate-600'
            )}>
              {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>
          </div>
        </div>

        {/* Collapsible Content */}
        {isExpanded && (
          <div className="p-4 sm:p-5 pt-0 border-t border-slate-100">
            <div className="pt-4 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <p className={cn("text-sm leading-relaxed flex-1", milestone.completed ? 'text-slate-400' : 'text-slate-600')}>
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
                  <div className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-sm font-semibold border border-emerald-100">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Completed
                  </div>
                )}
              </div>
            </div>

            {/* Resources Section */}
            {milestone.resources && milestone.resources.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Learning Resources</h4>
                  <div className="flex flex-wrap gap-1">
                    {["all", "video", "article", "course", "docs"].map((type) => (
                      <button
                        key={type}
                        onClick={(e) => { e.stopPropagation(); setResourceFilter(type); }}
                        className={cn(
                          "px-2 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all cursor-pointer",
                          resourceFilter === type
                            ? "bg-indigo-50 text-indigo-600 border border-indigo-200"
                            : "text-slate-400 hover:text-slate-600 border border-transparent"
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
    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 md:before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-200 before:via-slate-200 before:to-transparent">
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
