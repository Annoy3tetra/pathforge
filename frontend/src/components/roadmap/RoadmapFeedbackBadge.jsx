import { memo, useMemo } from "react";
import { Activity } from "lucide-react";
import { useFeedback } from "../../hooks/useRoadmaps";

export const RoadmapFeedbackBadge = memo(function RoadmapFeedbackBadge({ roadmapId }) {
  const { data: feedback } = useFeedback(roadmapId);
  const status = feedback?.status;

  const colorClass = useMemo(() => {
    if (status === "Ahead of Schedule" || status === "Completed") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (status === "On Track") {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }
    if (status === "Slightly Behind") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }
    if (status === "Significantly Behind") {
      return "bg-red-50 text-red-700 border-red-200";
    }
    return "bg-slate-50 text-slate-600 border-slate-200";
  }, [status]);

  if (!feedback) return null;

  return (
    <div className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${colorClass}`}>
      <Activity className="mr-1.5 h-3 w-3" />
      {status}
    </div>
  );
});
