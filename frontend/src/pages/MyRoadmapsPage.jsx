import { Layout } from "lucide-react";
import { useCallback } from "react";

import { DashboardLayout } from "../layouts/DashboardLayout";
import { RoadmapGrid } from "../components/dashboard/RoadmapGrid";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Skeleton } from "../components/ui/Skeleton";
import {
  useCompleteMilestone,
  useDeleteRoadmap,
  useRoadmaps,
} from "../hooks/useRoadmaps";

function MyRoadmapsPage() {
  const { data: roadmaps = [], isLoading } = useRoadmaps();
  const completeMutation = useCompleteMilestone();
  const deleteMutation = useDeleteRoadmap();
  const { mutate: completeMilestone } = completeMutation;
  const { mutate: deleteRoadmap } = deleteMutation;

  const handleComplete = useCallback((milestoneId) => {
    completeMilestone(milestoneId);
  }, [completeMilestone]);

  const handleDelete = useCallback((roadmapId) => {
    if (!window.confirm("Are you sure you want to delete this roadmap?")) return;
    deleteRoadmap(roadmapId);
  }, [deleteRoadmap]);

  if (isLoading) {
    return (
      <DashboardLayout title="My Roadmaps">
        <div className="mb-8 flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="h-80 shadow-none bg-white/5 border-white/5">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-3" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-3 w-full rounded-full mb-8" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Roadmaps">
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center justify-center">
            <Layout className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Saved Learning Paths</h1>
            <p className="text-sm text-slate-400">
              Review, continue, or clean up the roadmaps you have generated.
            </p>
          </div>
        </div>
      </section>

      <RoadmapGrid
        roadmaps={roadmaps}
        handleDelete={handleDelete}
        handleComplete={handleComplete}
        emptyVariant="saved"
      />
    </DashboardLayout>
  );
}

export default MyRoadmapsPage;
