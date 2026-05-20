import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Target, Pencil, Plus, Trash2
} from "lucide-react";

import { DashboardLayout } from "../layouts/DashboardLayout";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { ProgressBar } from "../components/ui/ProgressBar";
import { Skeleton } from "../components/ui/Skeleton";
import { Modal } from "../components/ui/Modal";
import { Input } from "../components/ui/Input";

import { RoadmapAnalytics } from "../components/roadmap/RoadmapAnalytics";
import { MilestoneTimeline } from "../components/roadmap/MilestoneTimeline";

import {
  useRoadmap, useFeedback, useAnalytics,
  useCompleteMilestone, useDeleteRoadmap, useUpdateRoadmap,
  useUpdateMilestone, useDeleteMilestone, useAddMilestone,
} from "../hooks/useRoadmaps";

const MilestoneChart = lazy(() => import("../components/roadmap/MilestoneChart").then((module) => ({
  default: module.MilestoneChart,
})));

function RoadmapDetailPage() {
  const { roadmapId } = useParams();
  const navigate = useNavigate();

  // TanStack Query — data fetching
  const { data: roadmap, isLoading } = useRoadmap(roadmapId);
  const { data: feedback } = useFeedback(roadmapId);
  const { data: analytics } = useAnalytics(roadmapId);

  // TanStack Query — mutations
  const completeMutation = useCompleteMilestone();
  const deleteRoadmapMutation = useDeleteRoadmap();
  const updateRoadmapMutation = useUpdateRoadmap();
  const updateMilestoneMutation = useUpdateMilestone();
  const deleteMilestoneMutation = useDeleteMilestone();
  const addMilestoneMutation = useAddMilestone();

  // UX States
  const [expandedMilestones, setExpandedMilestones] = useState(new Set());
  const [recentlyCompleted, setRecentlyCompleted] = useState(new Set());
  const [completingId, setCompletingId] = useState(null);

  // Edit / CRUD states
  const [editRoadmapOpen, setEditRoadmapOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editMilestoneOpen, setEditMilestoneOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [mTitle, setMTitle] = useState("");
  const [mDesc, setMDesc] = useState("");
  const [mDays, setMDays] = useState(7);
  const [addMilestoneOpen, setAddMilestoneOpen] = useState(false);
  const [newMTitle, setNewMTitle] = useState("");
  const [newMDesc, setNewMDesc] = useState("");
  const [newMDays, setNewMDays] = useState(7);
  const [saving, setSaving] = useState(false);

  const toggleMilestone = useCallback((id) => {
    setExpandedMilestones(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleComplete = useCallback(async (milestoneId) => {
    try {
      setCompletingId(milestoneId);
      await completeMutation.mutateAsync(milestoneId);

      setRecentlyCompleted(prev => new Set(prev).add(milestoneId));

      setTimeout(() => {
        setRecentlyCompleted(prev => {
          const next = new Set(prev);
          next.delete(milestoneId);
          return next;
        });
      }, 2000);
    } catch {
      // toast already handled by hook
    } finally {
      setCompletingId(null);
    }
  }, [completeMutation]);

  const openEditRoadmap = useCallback(() => {
    setEditTitle(roadmap.title);
    setEditDesc(roadmap.description || "");
    setEditRoadmapOpen(true);
  }, [roadmap]);

  const handleDeleteRoadmap = useCallback(async () => {
    if (!window.confirm("Are you sure you want to delete this roadmap? This cannot be undone.")) return;
    await deleteRoadmapMutation.mutateAsync(roadmapId);
    navigate("/dashboard");
  }, [deleteRoadmapMutation, navigate, roadmapId]);

  const openAddMilestone = useCallback(() => {
    setNewMTitle("");
    setNewMDesc("");
    setNewMDays(7);
    setAddMilestoneOpen(true);
  }, []);

  // Derived once per roadmap update
  const { total, completed, progress, totalDays, remainingDays } = useMemo(() => {
    if (!roadmap) return { total: 0, completed: 0, progress: 0, totalDays: 0, remainingDays: 0 };

    const milestones = roadmap.milestones || [];
    const total = milestones.length;
    const completed = milestones.filter((m) => m.completed).length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    const totalDays = milestones.reduce((acc, curr) => acc + curr.estimated_days, 0);
    const remainingDays = milestones.filter(m => !m.completed).reduce((acc, curr) => acc + curr.estimated_days, 0);

    return { total, completed, progress, totalDays, remainingDays };
  }, [roadmap]);

  const visibleExpandedMilestones = useMemo(() => {
    if (expandedMilestones.size > 0 || !roadmap?.milestones?.length) {
      return expandedMilestones;
    }

    const firstIncomplete = roadmap.milestones.find(m => !m.completed);
    return firstIncomplete ? new Set([firstIncomplete.id]) : expandedMilestones;
  }, [expandedMilestones, roadmap]);

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
          <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <Target className="h-10 w-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-slate-800">Roadmap not found</h2>
          <p className="text-slate-500 mb-8">The learning path you're looking for doesn't exist or was removed.</p>
          <Link to="/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const textareaClasses = "flex w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all resize-none";

  return (
    <DashboardLayout title="Roadmap Details">
      {/* Header Summary */}
      <div className="mb-8">
        <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-indigo-600 transition-colors mb-6 group">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-800 mb-4 leading-[1.15] break-words">
              {roadmap.title}
            </h1>
            <p className="text-base md:text-lg text-slate-500 max-w-4xl leading-relaxed break-words">
              {roadmap.description}
            </p>
          </div>
          <div className="flex gap-3 shrink-0 self-start sm:self-auto">
            <button
              onClick={openEditRoadmap}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-colors text-sm font-medium cursor-pointer"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </button>
            <button
              onClick={handleDeleteRoadmap}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors text-sm font-medium cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <RoadmapAnalytics 
        analytics={analytics} 
        progress={progress} 
        completed={completed} 
        total={total} 
        remainingDays={remainingDays} 
        totalDays={totalDays} 
      />

      {/* Progress Insights Card from feedback */}
      {feedback && (
        <Card className="mb-8 border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50">
          <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-1">Pace Evaluation</h3>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xl font-bold text-slate-800">{feedback.status}</span>
                <span className="text-sm text-slate-500">({feedback.actual_days}d actual vs. {feedback.expected_days}d expected)</span>
              </div>
              <p className="text-sm text-slate-600 mt-2">{feedback.recommendation}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Productivity Trend Chart */}
      {analytics?.productivity_trend?.length > 0 && (
        <Card className="mb-10">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Productivity Trend — Expected vs. Actual
            </h3>
            <Suspense fallback={<Skeleton className="h-[280px] w-full rounded-xl" />}>
              <MilestoneChart data={analytics.productivity_trend} />
            </Suspense>
          </CardContent>
        </Card>
      )}

      {/* Main Progress Bar */}
      <div className="mb-12">
        <ProgressBar progress={progress} className="h-3" />
      </div>

      <MilestoneTimeline 
        milestones={roadmap.milestones}
        expandedMilestones={visibleExpandedMilestones}
        toggleMilestone={toggleMilestone}
        handleComplete={handleComplete}
        recentlyCompleted={recentlyCompleted}
        completingId={completingId}
        setEditingMilestone={setEditingMilestone}
        setMTitle={setMTitle}
        setMDesc={setMDesc}
        setMDays={setMDays}
        setEditMilestoneOpen={setEditMilestoneOpen}
        deleteMilestoneMutation={deleteMilestoneMutation}
      />

      {/* Add Milestone Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={openAddMilestone}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors text-sm font-medium cursor-pointer"
        >
          <Plus className="h-5 w-5" />
          Add Milestone
        </button>
      </div>

      {/* ====== MODALS ====== */}

      {/* Edit Roadmap Modal */}
      <Modal isOpen={editRoadmapOpen} onClose={() => setEditRoadmapOpen(false)} title="Edit Roadmap">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Title</label>
            <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Roadmap title" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Description</label>
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              rows={3}
              className={textareaClasses}
              placeholder="Roadmap description"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setEditRoadmapOpen(false)}>Cancel</Button>
            <Button
              disabled={saving || !editTitle.trim()}
              onClick={async () => {
                setSaving(true);
                try {
                  await updateRoadmapMutation.mutateAsync({ roadmapId, updates: { title: editTitle.trim(), description: editDesc.trim() } });
                  setEditRoadmapOpen(false);
                } catch {
                  // toast handled by hook
                } finally { setSaving(false); }
              }}
            >{saving ? "Saving..." : "Save Changes"}</Button>
          </div>
        </div>
      </Modal>

      {/* Edit Milestone Modal */}
      <Modal isOpen={editMilestoneOpen} onClose={() => setEditMilestoneOpen(false)} title="Edit Milestone">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Title</label>
            <Input value={mTitle} onChange={(e) => setMTitle(e.target.value)} placeholder="Milestone title" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Description</label>
            <textarea
              value={mDesc}
              onChange={(e) => setMDesc(e.target.value)}
              rows={3}
              className={textareaClasses}
              placeholder="Milestone description"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Estimated Days</label>
            <Input type="number" min={1} value={mDays} onChange={(e) => setMDays(Number(e.target.value))} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setEditMilestoneOpen(false)}>Cancel</Button>
            <Button
              disabled={saving || !mTitle.trim()}
              onClick={async () => {
                setSaving(true);
                try {
                  await updateMilestoneMutation.mutateAsync({
                    milestoneId: editingMilestone.id,
                    updates: { title: mTitle.trim(), description: mDesc.trim(), estimated_days: mDays }
                  });
                  setEditMilestoneOpen(false);
                } catch {
                  // toast handled by hook
                } finally { setSaving(false); }
              }}
            >{saving ? "Saving..." : "Save Changes"}</Button>
          </div>
        </div>
      </Modal>

      {/* Add Milestone Modal */}
      <Modal isOpen={addMilestoneOpen} onClose={() => setAddMilestoneOpen(false)} title="Add Milestone">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Title</label>
            <Input value={newMTitle} onChange={(e) => setNewMTitle(e.target.value)} placeholder="e.g. Learn React Hooks" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Description</label>
            <textarea
              value={newMDesc}
              onChange={(e) => setNewMDesc(e.target.value)}
              rows={3}
              className={textareaClasses}
              placeholder="What should be learned in this milestone?"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Estimated Days</label>
            <Input type="number" min={1} value={newMDays} onChange={(e) => setNewMDays(Number(e.target.value))} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setAddMilestoneOpen(false)}>Cancel</Button>
            <Button
              disabled={saving || !newMTitle.trim()}
              onClick={async () => {
                setSaving(true);
                try {
                  await addMilestoneMutation.mutateAsync({
                    roadmapId,
                    milestone: { title: newMTitle.trim(), description: newMDesc.trim(), estimated_days: newMDays }
                  });
                  setAddMilestoneOpen(false);
                } catch {
                  // toast handled by hook
                } finally { setSaving(false); }
              }}
            >{saving ? "Adding..." : "Add Milestone"}</Button>
          </div>
        </div>
      </Modal>

    </DashboardLayout>
  );
}

export default RoadmapDetailPage;
