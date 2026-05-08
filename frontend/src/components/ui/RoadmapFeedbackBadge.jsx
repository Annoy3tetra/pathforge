import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { Activity } from "lucide-react";

export function RoadmapFeedbackBadge({ roadmapId }) {
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await API.get(`/roadmaps/${roadmapId}/feedback`);
        setFeedback(response.data);
      } catch (error) {
        console.error("Failed to fetch feedback", error);
      }
    };
    fetchFeedback();
  }, [roadmapId]);

  if (!feedback) return null;

  const { status } = feedback;

  let colorClass = "bg-slate-800 text-slate-300 border-slate-700";
  
  if (status === "Ahead of Schedule" || status === "Completed") {
    colorClass = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  } else if (status === "On Track") {
    colorClass = "bg-blue-500/20 text-blue-400 border-blue-500/30";
  } else if (status === "Slightly Behind") {
    colorClass = "bg-amber-500/20 text-amber-400 border-amber-500/30";
  } else if (status === "Significantly Behind") {
    colorClass = "bg-rose-500/20 text-rose-400 border-rose-500/30";
  }

  return (
    <div className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${colorClass}`}>
      <Activity className="mr-1 h-3 w-3" />
      {status}
    </div>
  );
}
