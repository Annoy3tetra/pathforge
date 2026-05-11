import { TrendingUp } from "lucide-react";
import { useCallback } from "react";

import { DashboardLayout } from "../layouts/DashboardLayout";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Skeleton } from "../components/ui/Skeleton";

import { useRoadmaps, useGenerateRoadmap, useCompleteMilestone, useDeleteRoadmap } from "../hooks/useRoadmaps";
import { useProfile } from "../hooks/useProfile";

import { InsightsCards } from "../components/dashboard/InsightsCards";
import { GenerateRoadmapSection } from "../components/dashboard/GenerateRoadmapSection";
import { RoadmapGrid } from "../components/dashboard/RoadmapGrid";
import { ForgeRecommendations } from "../components/dashboard/ForgeRecommendations";

function DashboardPage() {
  const { data: roadmaps = [], isLoading: initialLoad } = useRoadmaps();
  const { data: profile } = useProfile();
  
  const generateMutation = useGenerateRoadmap();
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

  if (initialLoad) {
    return (
      <DashboardLayout title="Dashboard">
        <Skeleton className="h-56 w-full mb-10 rounded-2xl" />
        <div className="mb-8 flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-80 shadow-none bg-white/5 border-white/5">
              <CardHeader><Skeleton className="h-6 w-3/4 mb-3" /><Skeleton className="h-4 w-full" /></CardHeader>
              <CardContent><Skeleton className="h-3 w-full rounded-full mb-8" /><Skeleton className="h-20 w-full" /></CardContent>
            </Card>
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Overview">
      <GenerateRoadmapSection 
        generateMutation={generateMutation} 
        profile={profile} 
      />

      <ForgeRecommendations />

      {roadmaps.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">Learning Insights</h2>
            </div>
            <InsightsCards />
          </section>
        )}

      <RoadmapGrid 
        roadmaps={roadmaps} 
        handleDelete={handleDelete} 
        handleComplete={handleComplete} 
      />
    </DashboardLayout>
  );
}

export default DashboardPage;
