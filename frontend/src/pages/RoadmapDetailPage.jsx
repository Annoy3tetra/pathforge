import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";
import {
  ArrowLeft, CheckCircle2, Clock, ChevronDown, ChevronUp,
  Target, TrendingUp, Calendar, Zap, AlertTriangle, CalendarCheck, Trash2
} from "lucide-react";

import { DashboardLayout } from "../layouts/DashboardLayout";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { ProgressBar } from "../components/ui/ProgressBar";
import { Skeleton } from "../components/ui/Skeleton";
import { MilestoneChart } from "../components/ui/MilestoneChart";

function RoadmapDetailPage() {
  const { roadmapId } = useParams();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // UX States
  const [expandedMilestones, setExpandedMilestones] = useState(new Set());
  const [recentlyCompleted, setRecentlyCompleted] = useState(new Set());
  const [completingId, setCompletingId] = useState(null);

  const fetchRoadmap = async () => {
    try {
      const [roadmapsRes, feedbackRes, analyticsRes] = await Promise.all([
        API.get("/roadmaps/"),
        API.get(`/roadmaps/${roadmapId}/feedback`),
        API.get(`/roadmaps/${roadmapId}/analytics`),
      ]);

      const foundRoadmap = roadmapsRes.data.find((r) => r.id === Number(roadmapId));
      setRoadmap(foundRoadmap);
      setFeedback(feedbackRes.data);
      setAnalytics(analyticsRes.data);

      // Auto-expand the first incomplete milestone
      if (foundRoadmap && expandedMilestones.size === 0) {
        const firstIncomplete = foundRoadmap.milestones.find(m => !m.completed);
        if (firstIncomplete) {
          setExpandedMilestones(new Set([firstIncomplete.id]));
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load roadmap");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, [roadmapId]);

  const toggleMilestone = (id) => {
    const newExpanded = new Set(expandedMilestones);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedMilestones(newExpanded);
  };

  const handleComplete = async (milestoneId) => {
    try {
      setCompletingId(milestoneId);
      await API.put(`/roadmaps/milestones/${milestoneId}/complete`);

      setRecentlyCompleted(prev => new Set(prev).add(milestoneId));
      toast.success("Milestone crushed! Keep it up 🚀");

      await fetchRoadmap();

      setTimeout(() => {
        setRecentlyCompleted(prev => {
          const next = new Set(prev);
          next.delete(milestoneId);
          return next;
        });
      }, 2000);

    } catch (error) {
      console.error(error);
      toast.error("Failed to update milestone");
    } finally {
      setCompletingId(null);
    }
  };

  // --- Loading skeleton ---
  if (isLoading) {
    return (
      <DashboardLayout title="Loading Path...">
        <div className="mb-6">
          <Skeleton className="h-4 w-32 mb-6" />
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-6 w-full max-w-3xl" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
        </div>
        <Skeleton className="h-72 w-full mb-10 rounded-xl" />
        <div className="space-y-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full md:w-[calc(50%-2.5rem)] rounded-xl mx-auto md:ml-auto" />)}
        </div>
      </DashboardLayout>
    );
  }

  // --- Not found ---
  if (!roadmap) {
    return (
      <DashboardLayout title="Path Not Found">
        <div className="text-center py-20 flex flex-col items-center">
          <div className="h-20 w-20 bg-slate-800 rounded-full flex items-center justify-center mb-6">
            <Target className="h-10 w-10 text-slate-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-white">Roadmap not found</h2>
          <p className="text-slate-400 mb-8">The learning path you're looking for doesn't exist or was removed.</p>
          <Link to="/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  // --- Derived values ---
  const total = roadmap.milestones.length;
  const completed = roadmap.milestones.filter((m) => m.completed).length;
  const remaining = total - completed;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
  const totalDays = roadmap.milestones.reduce((acc, curr) => acc + curr.estimated_days, 0);
  const remainingDays = roadmap.milestones.filter(m => !m.completed).reduce((acc, curr) => acc + curr.estimated_days, 0);

  return (
    <DashboardLayout title="Roadmap Details">
      {/* Header Summary */}
      <div className="mb-8">
        <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-indigo-400 transition-colors mb-6 group">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-100 mb-4 leading-tight">
              {roadmap.title}
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-3xl leading-relaxed">
              {roadmap.description}
            </p>
          </div>
          <button
            onClick={async () => {
              if (!window.confirm("Are you sure you want to delete this roadmap? This cannot be undone.")) return;
              try {
                await API.delete(`/roadmaps/${roadmapId}`);
                toast.success("Roadmap deleted");
                navigate("/dashboard");
              } catch (error) {
                console.error(error);
                toast.error("Failed to delete roadmap");
              }
            }}
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-500/50 hover:bg-rose-500/10 transition-colors text-sm font-medium"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Analytics Grid — 6 cards in 2 rows of 3 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {/* Progress */}
        <Card className="bg-slate-900/50 border-slate-800/60 hover:bg-slate-800/50 transition-colors">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Progress</p>
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
              <p className="text-sm font-medium text-slate-500">Completed</p>
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
              <p className="text-sm font-medium text-slate-500">Days Left</p>
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
              <p className="text-sm font-medium text-slate-500">Avg Speed</p>
              <p className="text-2xl font-bold text-slate-100">
                {analytics?.avg_days_per_milestone != null ? `${analytics.avg_days_per_milestone}d` : "—"}
                <span className="text-sm font-normal text-slate-400"> / milestone</span>
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
              <p className="text-sm font-medium text-slate-500">Est. Finish</p>
              <p className="text-lg font-bold text-slate-100 truncate">{analytics?.estimated_finish_date ?? "—"}</p>
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
              <p className="text-sm font-medium text-slate-500">Overdue</p>
              <p className="text-2xl font-bold text-slate-100">{analytics?.overdue_milestones?.length ?? 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Insights Card from feedback */}
      {feedback && (
        <Card className="mb-8 border-indigo-500/20 bg-gradient-to-r from-slate-900 to-indigo-950/20">
          <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-1">Pace Evaluation</h3>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xl font-bold text-slate-100">{feedback.status}</span>
                <span className="text-sm text-slate-400">({feedback.actual_days}d actual vs. {feedback.expected_days}d expected)</span>
              </div>
              <p className="text-sm text-slate-300 mt-2">{feedback.recommendation}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Productivity Trend Chart */}
      {analytics?.productivity_trend?.length > 0 && (
        <Card className="mb-10 bg-slate-900/50 border-slate-800/60">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Productivity Trend — Expected vs. Actual
            </h3>
            <MilestoneChart data={analytics.productivity_trend} />
          </CardContent>
        </Card>
      )}

      {/* Main Progress Bar */}
      <div className="mb-12">
        <ProgressBar progress={progress} className="h-3 shadow-inner shadow-black/20" />
      </div>

      {/* Milestones Timeline */}
      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 md:before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500/50 before:via-slate-800 before:to-transparent">
        {roadmap.milestones.map((milestone, index) => {
          const isExpanded = expandedMilestones.has(milestone.id);
          const justCompleted = recentlyCompleted.has(milestone.id);
          const isCompleting = completingId === milestone.id;

          return (
            <div key={milestone.id} className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

              {/* Timeline dot */}
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-950 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10 transition-all duration-500 ${
                milestone.completed ? 'bg-emerald-500/20' : 'bg-slate-900'
              }`}>
                {milestone.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                ) : (
                  <div className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${isExpanded ? 'bg-indigo-400' : 'bg-slate-600 group-hover:bg-indigo-400'}`} />
                )}
              </div>

              {/* Content Card */}
              <Card
                className={`w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] transition-all duration-500 border overflow-hidden ${
                  milestone.completed
                    ? 'border-emerald-500/20 bg-emerald-950/10 opacity-75 hover:opacity-100'
                    : isExpanded
                      ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/10 bg-slate-900/90 scale-[1.02]'
                      : 'border-slate-800 bg-slate-900/50 hover:border-indigo-500/30'
                } ${justCompleted ? 'animate-[pulse_1s_ease-in-out_1]' : ''}`}
              >
                {/* Clickable Header for Collapsing */}
                <div
                  className={`p-4 sm:p-5 cursor-pointer flex items-center justify-between gap-4 ${isExpanded ? 'bg-slate-800/30' : ''}`}
                  onClick={() => toggleMilestone(milestone.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                        milestone.completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'
                      }`}>
                        Step {index + 1}
                      </span>
                      <span className="flex items-center text-xs text-slate-500 font-medium">
                        <Clock className="mr-1.5 h-3.5 w-3.5" />
                        {milestone.estimated_days} {milestone.estimated_days === 1 ? 'day' : 'days'}
                      </span>
                    </div>
                    <h3 className={`text-base sm:text-lg font-bold truncate transition-colors ${
                      milestone.completed ? 'text-slate-400 line-through' : 'text-slate-100 group-hover:text-indigo-300'
                    }`}>
                      {milestone.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {milestone.completed && !isExpanded && (
                       <span className="hidden sm:flex text-emerald-500 text-sm font-medium items-center">
                         Done
                       </span>
                    )}
                    <div className={`p-1.5 rounded-md transition-colors ${isExpanded ? 'bg-slate-800 text-white' : 'text-slate-500 group-hover:text-white group-hover:bg-slate-800'}`}>
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </div>
                  </div>
                </div>

                {/* Collapsible Content */}
                <div className={`transition-all duration-300 ease-in-out origin-top ${
                  isExpanded ? 'max-h-96 opacity-100 p-4 sm:p-5 pt-0 border-t border-slate-800/50' : 'max-h-0 opacity-0 overflow-hidden px-4 sm:px-5 border-t-0'
                }`}>
                  <div className="pt-4 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                    <p className={`text-sm leading-relaxed flex-1 ${milestone.completed ? 'text-slate-500' : 'text-slate-300'}`}>
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
                          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20"
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
                </div>
              </Card>

            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}

export default RoadmapDetailPage;