import { memo, useMemo } from "react";
import { Activity } from "lucide-react";
import { useFeedback } from "../../hooks/useRoadmaps";

export const RoadmapFeedbackBadge = memo(function RoadmapFeedbackBadge({ roadmapId }) {
  const { data: feedback } = useFeedback(roadmapId);
  const status = feedback?.status;

  const colorClass = useMemo(() => {
    if (status === "Ahead of Schedule" || status === "Completed") {
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    }
    if (status === "On Track") {
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
    if (status === "Slightly Behind") {
      return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    }
    if (status === "Significantly Behind") {
      return "bg-rose-500/20 text-rose-400 border-rose-500/30";
    }
    return "bg-slate-800 text-slate-300 border-slate-700";
  }, [status]);

  if (!feedback) return null;

  return (
    <div className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.1em] border shadow-lg shadow-black/20 ${colorClass}`}>
      <Activity className="mr-1.5 h-3 w-3" />
      {status}
    </div>
  );
});
