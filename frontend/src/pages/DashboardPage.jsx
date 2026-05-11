import { DashboardLayout } from "../layouts/DashboardLayout";
import { useGenerateRoadmap } from "../hooks/useRoadmaps";
import { useProfile } from "../hooks/useProfile";

import { GenerateRoadmapSection } from "../components/dashboard/GenerateRoadmapSection";
import { ForgeRecommendations } from "../components/dashboard/ForgeRecommendations";

function DashboardPage() {
  const { data: profile } = useProfile();
  const generateMutation = useGenerateRoadmap();

  return (
    <DashboardLayout title="Overview">
      <GenerateRoadmapSection 
        generateMutation={generateMutation} 
        profile={profile} 
      />

      <ForgeRecommendations />
    </DashboardLayout>
  );
}

export default DashboardPage;
