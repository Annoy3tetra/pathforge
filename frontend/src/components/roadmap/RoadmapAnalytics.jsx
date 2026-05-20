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
      <Card className="hover:card-shadow-hover transition-all">
        <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 text-center sm:text-left">
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] font-semibold text-slate-400 uppercase tracking-wider truncate">Progress</p>
            <p className="text-xl sm:text-2xl font-bold text-slate-800">{progress}%</p>
          </div>
        </CardContent>
      </Card>

      {/* Completed */}
      <Card className="hover:card-shadow-hover transition-all">
        <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 text-center sm:text-left">
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] font-semibold text-slate-400 uppercase tracking-wider truncate">Done</p>
            <p className="text-xl sm:text-2xl font-bold text-slate-800">{completed}<span className="text-xs font-normal text-slate-400">/{total}</span></p>
          </div>
        </CardContent>
      </Card>

      {/* Remaining Days */}
      <Card className="hover:card-shadow-hover transition-all">
        <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 text-center sm:text-left">
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] font-semibold text-slate-400 uppercase tracking-wider truncate">Left</p>
            <p className="text-xl sm:text-2xl font-bold text-slate-800">{remainingDays}<span className="text-xs font-normal text-slate-400">/{totalDays}d</span></p>
          </div>
        </CardContent>
      </Card>

      {/* Avg Speed */}
      <Card className="hover:card-shadow-hover transition-all">
        <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 text-center sm:text-left">
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
            <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] font-semibold text-slate-400 uppercase tracking-wider truncate">Speed</p>
            <p className="text-xl sm:text-2xl font-bold text-slate-800">
              {analytics?.avg_days_per_milestone != null ? `${analytics.avg_days_per_milestone}d` : "—"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Est. Finish */}
      <Card className="hover:card-shadow-hover transition-all">
        <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 text-center sm:text-left">
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
            <CalendarCheck className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] font-semibold text-slate-400 uppercase tracking-wider truncate">Finish</p>
            <p className="text-sm sm:text-base font-bold text-slate-800 truncate">{analytics?.estimated_finish_date ?? "—"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Overdue */}
      <Card className={`transition-all ${
        analytics?.overdue_milestones?.length > 0 ? "border-red-200 bg-red-50/50" : "hover:card-shadow-hover"
      }`}>
        <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 text-center sm:text-left">
          <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center shrink-0 ${
            analytics?.overdue_milestones?.length > 0 ? "bg-red-100 text-red-600" : "bg-amber-50 text-amber-600"
          }`}>
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] font-semibold text-slate-400 uppercase tracking-wider truncate">Overdue</p>
            <p className="text-xl sm:text-2xl font-bold text-slate-800">{analytics?.overdue_milestones?.length ?? 0}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
