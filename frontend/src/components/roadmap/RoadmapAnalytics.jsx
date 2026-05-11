import { memo } from "react";
import { 
  CheckCircle2, 
  Calendar, 
  Zap, 
  AlertTriangle, 
  CalendarCheck, 
  TrendingUp 
} from "lucide-react";
import { Card, CardContent } from "../ui/Card";

export const RoadmapAnalytics = memo(({ 
  analytics, 
  progress, 
  completed, 
  total, 
  remainingDays, 
  totalDays 
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
      {/* Progress */}
      <Card className="bg-slate-900/40 border-slate-800/40 hover:bg-slate-800/40 transition-colors">
        <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 text-center sm:text-left">
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest truncate">Progress</p>
            <p className="text-xl sm:text-2xl font-bold text-slate-100">{progress}%</p>
          </div>
        </CardContent>
      </Card>

      {/* Completed */}
      <Card className="bg-slate-900/40 border-slate-800/40 hover:bg-slate-800/40 transition-colors">
        <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 text-center sm:text-left">
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest truncate">Done</p>
            <p className="text-xl sm:text-2xl font-bold text-slate-100">{completed}<span className="text-xs font-normal text-slate-400">/{total}</span></p>
          </div>
        </CardContent>
      </Card>

      {/* Remaining Days */}
      <Card className="bg-slate-900/40 border-slate-800/40 hover:bg-slate-800/40 transition-colors">
        <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 text-center sm:text-left">
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest truncate">Left</p>
            <p className="text-xl sm:text-2xl font-bold text-slate-100">{remainingDays}<span className="text-xs font-normal text-slate-400">/{totalDays}d</span></p>
          </div>
        </CardContent>
      </Card>

      {/* Avg Speed */}
      <Card className="bg-slate-900/40 border-slate-800/40 hover:bg-slate-800/40 transition-colors">
        <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 text-center sm:text-left">
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest truncate">Speed</p>
            <p className="text-xl sm:text-2xl font-bold text-slate-100">
              {analytics?.avg_days_per_milestone != null ? `${analytics.avg_days_per_milestone}d` : "—"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Est. Finish */}
      <Card className="bg-slate-900/40 border-slate-800/40 hover:bg-slate-800/40 transition-colors">
        <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 text-center sm:text-left">
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <CalendarCheck className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest truncate">Finish</p>
            <p className="text-sm sm:text-base font-bold text-slate-100 truncate">{analytics?.estimated_finish_date ?? "—"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Overdue */}
      <Card className={`border-slate-800/40 transition-colors ${
        analytics?.overdue_milestones?.length > 0 ? "bg-rose-950/20 border-rose-500/30" : "bg-slate-900/40 hover:bg-slate-800/40"
      }`}>
        <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 text-center sm:text-left">
          <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center shrink-0 ${
            analytics?.overdue_milestones?.length > 0 ? "bg-rose-500/20 text-rose-400" : "bg-amber-500/20 text-amber-400"
          }`}>
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest truncate">Overdue</p>
            <p className="text-xl sm:text-2xl font-bold text-slate-100">{analytics?.overdue_milestones?.length ?? 0}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
