import React from "react";
import { 
  CheckCircle2, 
  Calendar, 
  Zap, 
  AlertTriangle, 
  CalendarCheck, 
  TrendingUp 
} from "lucide-react";
import { Card, CardContent } from "../ui/Card";

export function RoadmapAnalytics({ 
  analytics, 
  progress, 
  completed, 
  total, 
  remainingDays, 
  totalDays 
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
      {/* Progress */}
      <Card className="bg-slate-900/50 border-slate-800/60 hover:bg-slate-800/50 transition-colors">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Progress</p>
            <p className="text-2xl font-bold text-slate-100">{progress}%</p>
          </div>
        </CardContent>
      </Card>

      {/* Completed */}
      <Card className="bg-slate-900/50 border-slate-800/60 hover:bg-slate-800/50 transition-colors">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Completed</p>
            <p className="text-2xl font-bold text-slate-100">{completed}<span className="text-sm font-normal text-slate-400"> / {total}</span></p>
          </div>
        </CardContent>
      </Card>

      {/* Remaining Days */}
      <Card className="bg-slate-900/50 border-slate-800/60 hover:bg-slate-800/50 transition-colors">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Days Left</p>
            <p className="text-2xl font-bold text-slate-100">{remainingDays}<span className="text-sm font-normal text-slate-400"> / {totalDays}d</span></p>
          </div>
        </CardContent>
      </Card>

      {/* Avg Speed */}
      <Card className="bg-slate-900/50 border-slate-800/60 hover:bg-slate-800/50 transition-colors">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Avg Speed</p>
            <p className="text-2xl font-bold text-slate-100">
              {analytics?.avg_days_per_milestone != null ? `${analytics.avg_days_per_milestone}d` : "—"}
              <span className="text-sm font-normal text-slate-400"> / unit</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Est. Finish */}
      <Card className="bg-slate-900/50 border-slate-800/60 hover:bg-slate-800/50 transition-colors">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <CalendarCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Est. Finish</p>
            <p className="text-base font-bold text-slate-100 truncate">{analytics?.estimated_finish_date ?? "—"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Overdue */}
      <Card className={`border-slate-800/60 transition-colors ${
        analytics?.overdue_milestones?.length > 0 ? "bg-rose-950/20 border-rose-500/30" : "bg-slate-900/50 hover:bg-slate-800/50"
      }`}>
        <CardContent className="p-4 flex items-center gap-4">
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
            analytics?.overdue_milestones?.length > 0 ? "bg-rose-500/20 text-rose-400" : "bg-amber-500/20 text-amber-400"
          }`}>
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Overdue</p>
            <p className="text-2xl font-bold text-slate-100">{analytics?.overdue_milestones?.length ?? 0}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
