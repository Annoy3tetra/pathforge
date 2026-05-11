import { memo } from "react";
import { Brain, Compass, FolderKanban, Gauge, Sparkles, Target } from "lucide-react";
import { Link } from "react-router-dom";

import { useForgeProfile, useForgeRecommendations } from "../../hooks/useForgeProfile";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Skeleton } from "../ui/Skeleton";
import { Button } from "../ui/Button";

const iconMap = {
  roadmaps: Compass,
  skills: Target,
  projects: FolderKanban,
  pace: Gauge,
};

export const ForgeRecommendations = memo(function ForgeRecommendations() {
  const { data: forgeProfile, isLoading: profileLoading } = useForgeProfile();
  const { data: recommendations, isLoading: recommendationsLoading } = useForgeRecommendations();
  const isLoading = profileLoading || recommendationsLoading;

  if (isLoading) {
    return (
      <section className="mb-12">
        <Skeleton className="h-52 rounded-2xl" />
      </section>
    );
  }

  if (!forgeProfile || (forgeProfile.completion_percent || 0) < 35) {
    return (
      <section className="mb-12">
        <Card className="border-indigo-500/20 bg-indigo-500/5">
          <CardContent className="p-6 sm:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-3">
                <Brain className="h-4 w-4" />
                ForgeProfile
              </div>
              <h2 className="text-2xl font-black text-white mb-2">Make PathForge understand how you learn.</h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Complete a short student intelligence profile so roadmaps, projects, resources, and pacing adapt to your goals.
              </p>
            </div>
            <Link to="/forge-profile">
              <Button className="h-11 px-5">
                <Sparkles className="mr-2 h-4 w-4" />
                Start ForgeProfile
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    );
  }

  const analysis = recommendations?.analysis;

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-indigo-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">ForgeProfile Guidance</h2>
        </div>
        <Link to="/forge-profile" className="text-xs font-bold text-indigo-300 hover:text-indigo-200">
          Tune profile
        </Link>
      </div>

      <Card className="mb-5 border-indigo-500/15">
        <CardContent className="p-5 grid grid-cols-1 md:grid-cols-[1.3fr_0.7fr] gap-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
              Student Intelligence
            </p>
            <p className="text-base text-slate-200 leading-relaxed">
              {analysis?.personalization_summary || "ForgeProfile is shaping your recommendations from your latest answers."}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Metric label="Complete" value={`${analysis?.completion_percent ?? forgeProfile.completion_percent}%`} />
            <Metric label="Readiness" value={analysis?.readiness_score ?? "—"} />
            <Metric label="Pace" value={analysis?.pace_label || "steady"} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <RecommendationColumn title="Roadmaps" type="roadmaps" items={recommendations?.roadmap_suggestions} />
        <RecommendationColumn title="Skills" type="skills" items={recommendations?.skill_suggestions} />
        <RecommendationColumn title="Projects" type="projects" items={recommendations?.project_suggestions} />
        <RecommendationColumn title="Pace" type="pace" items={recommendations?.learning_pace_suggestions} />
      </div>
    </section>
  );
});

const Metric = memo(function Metric({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-center">
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">{label}</p>
      <p className="text-sm font-black text-white capitalize truncate">{value}</p>
    </div>
  );
});

const RecommendationColumn = memo(function RecommendationColumn({ title, type, items = [] }) {
  const Icon = iconMap[type];

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Icon className="h-4 w-4 text-indigo-400" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {items.slice(0, 4).map((item) => (
            <div key={item} className="rounded-xl bg-slate-950/40 border border-slate-800/60 p-3 text-xs font-semibold text-slate-300 leading-relaxed">
              {item}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});
