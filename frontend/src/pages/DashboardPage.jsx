import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Map,
  User,
  Brain,
  Target,
  CheckCircle2,
  TrendingUp,
  BookOpen,
  ArrowRight,
  Compass,
  Lightbulb,
  GraduationCap,
  Rocket,
} from "lucide-react";

import { DashboardLayout } from "../layouts/DashboardLayout";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { ProgressBar } from "../components/ui/ProgressBar";
import { Skeleton } from "../components/ui/Skeleton";

import { useProfile } from "../hooks/useProfile";
import { useRoadmaps } from "../hooks/useRoadmaps";
import { useForgeProfile, useForgeRecommendations } from "../hooks/useForgeProfile";
import { useInsights } from "../hooks/useInsights";

import { GenerateRoadmapSection } from "../components/dashboard/GenerateRoadmapSection";
import { useGenerateRoadmap } from "../hooks/useRoadmaps";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function DashboardPage() {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: roadmaps = [], isLoading: roadmapsLoading } = useRoadmaps();
  const { data: forgeProfile, isLoading: forgeLoading } = useForgeProfile();
  const { data: recommendations } = useForgeRecommendations();
  const { data: insights } = useInsights();
  const generateMutation = useGenerateRoadmap();

  const stats = useMemo(() => {
    const totalMilestones = roadmaps.reduce((acc, r) => acc + (r.milestones?.length || 0), 0);
    const completedMilestones = roadmaps.reduce((acc, r) => acc + (r.milestones?.filter(m => m.completed).length || 0), 0);
    const activeRoadmaps = roadmaps.length;
    const profileFields = profile ? ["display_name", "bio", "skill_level", "career_goal", "education_level"].filter(f => profile[f]).length : 0;
    const profileCompletion = Math.round((profileFields / 5) * 100);

    return { totalMilestones, completedMilestones, activeRoadmaps, profileCompletion };
  }, [roadmaps, profile]);

  const greeting = getGreeting();
  const displayName = profile?.display_name?.split(" ")[0] || "Learner";
  const isLoading = profileLoading || roadmapsLoading;

  if (isLoading) {
    return (
      <DashboardLayout title="Dashboard">
        <Skeleton className="h-48 rounded-2xl mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard">
      {/* Hero Greeting */}
      <section className="mb-8">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 p-8 sm:p-10 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-indigo-200 text-sm font-medium">{greeting}</span>
              <span className="text-lg">👋</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
              Welcome back, {displayName}!
            </h1>
            <p className="text-indigo-100 text-base sm:text-lg max-w-2xl leading-relaxed">
              Ready to continue your learning journey? PathForge is your AI-powered companion that creates personalized roadmaps to help you grow.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Map}
          label="Active Paths"
          value={stats.activeRoadmaps}
          color="indigo"
          href="/my-roadmaps"
        />
        <StatCard
          icon={CheckCircle2}
          label="Milestones Done"
          value={`${stats.completedMilestones}/${stats.totalMilestones}`}
          color="emerald"
        />
        <StatCard
          icon={TrendingUp}
          label="Profile Depth"
          value={`${stats.profileCompletion}%`}
          color="violet"
          href="/profile"
        />
        <StatCard
          icon={Brain}
          label="Forge Status"
          value={forgeProfile ? "Active" : "Setup"}
          color="amber"
          href="/forge-profile"
        />
      </section>

      {/* Quick Actions */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Rocket className="h-5 w-5 text-indigo-500" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            icon={Sparkles}
            title="Generate Roadmap"
            description="Create an AI-powered learning path for any goal"
            color="indigo"
            to="/dashboard#generate"
          />
          <QuickActionCard
            icon={BookOpen}
            title="Continue Learning"
            description="Pick up where you left off on your roadmaps"
            color="emerald"
            to="/my-roadmaps"
          />
          <QuickActionCard
            icon={User}
            title="Complete Profile"
            description="Help PathForge understand your goals better"
            color="violet"
            to="/profile"
          />
          <QuickActionCard
            icon={Brain}
            title="ForgeProfile"
            description="Fine-tune your learning intelligence profile"
            color="amber"
            to="/forge-profile"
          />
        </div>
      </section>

      {/* Generate Roadmap Section */}
      <div id="generate">
        <GenerateRoadmapSection 
          generateMutation={generateMutation} 
          profile={profile} 
        />
      </div>

      {/* AI Insights & Recommendations */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Personalized Insights */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Lightbulb className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">AI Insights</h3>
                <p className="text-xs text-slate-400">Personalized for your learning style</p>
              </div>
            </div>
            {insights ? (
              <div className="space-y-4">
                {insights.pace && (
                  <InsightItem icon={TrendingUp} label="Learning Pace" value={insights.pace} color="blue" />
                )}
                {insights.consistency && (
                  <InsightItem icon={Target} label="Consistency" value={insights.consistency} color="emerald" />
                )}
                {insights.domains && (
                  <InsightItem icon={Compass} label="Focus Areas" value={insights.domains} color="violet" />
                )}
                {!insights.pace && !insights.consistency && !insights.domains && (
                  <p className="text-sm text-slate-400 italic">Complete more milestones to unlock insights.</p>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <GraduationCap className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-400">Start learning to unlock personalized insights</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Forge Recommendations */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Recommendations</h3>
                  <p className="text-xs text-slate-400">Based on your ForgeProfile</p>
                </div>
              </div>
              <Link to="/forge-profile" className="text-xs font-medium text-indigo-500 hover:text-indigo-700">
                Tune →
              </Link>
            </div>
            {recommendations?.analysis?.personalization_summary ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-600 leading-relaxed bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                  {recommendations.analysis.personalization_summary}
                </p>
                {recommendations.recommended_next_steps?.slice(0, 3).map((step, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Brain className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-400 mb-3">Set up ForgeProfile for personalized recommendations</p>
                <Link to="/forge-profile">
                  <Button size="sm" variant="outline">
                    <Brain className="mr-2 h-3.5 w-3.5" />
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Platform Introduction for new users */}
      {stats.activeRoadmaps === 0 && (
        <section className="mb-8">
          <Card className="border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-violet-50/50">
            <CardContent className="p-8">
              <div className="text-center max-w-2xl mx-auto">
                <div className="h-16 w-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Compass className="h-8 w-8 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-3">Welcome to PathForge 🎯</h2>
                <p className="text-slate-500 leading-relaxed mb-6">
                  PathForge is your AI-powered learning companion. Tell us your goal — whether it's mastering Machine Learning, 
                  becoming a Full-Stack Developer, or learning Data Science — and we'll create a personalized roadmap with 
                  milestones, resources, and pacing adapted to your style.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                  <FeatureCard icon={Sparkles} title="AI-Powered Roadmaps" description="Custom learning paths generated just for you" />
                  <FeatureCard icon={Target} title="Track Progress" description="Milestones, analytics, and pace feedback" />
                  <FeatureCard icon={Brain} title="Smart Adaptation" description="Roadmaps adapt to your ForgeProfile" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </DashboardLayout>
  );
}

function StatCard({ icon: Icon, label, value, color, href }) {
  const colorMap = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
  };

  const content = (
    <Card animate className="h-full">
      <CardContent className="p-5 flex items-center gap-4">
        <div className={`h-12 w-12 rounded-xl ${colorMap[color]} flex items-center justify-center shrink-0`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-slate-800 tabular-nums">{value}</p>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link to={href}>{content}</Link>;
  }
  return content;
}

function QuickActionCard({ icon: Icon, title, description, color, to }) {
  const colorMap = {
    indigo: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100",
    emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100",
    violet: "bg-violet-50 text-violet-600 group-hover:bg-violet-100",
    amber: "bg-amber-50 text-amber-600 group-hover:bg-amber-100",
  };

  return (
    <Link to={to} className="group">
      <Card animate className="h-full">
        <CardContent className="p-5">
          <div className={`h-11 w-11 rounded-xl ${colorMap[color]} flex items-center justify-center mb-4 transition-colors`}>
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-slate-800 mb-1 group-hover:text-indigo-700 transition-colors">{title}</h3>
          <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
          <div className="flex items-center gap-1 mt-3 text-xs font-medium text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Go</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function InsightItem({ icon: Icon, label, value, color }) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
      <div className={`h-8 w-8 rounded-lg ${colorMap[color]} flex items-center justify-center shrink-0`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-slate-700 leading-relaxed">{value}</p>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="p-4 rounded-xl bg-white border border-slate-100 card-shadow">
      <Icon className="h-5 w-5 text-indigo-500 mb-2" />
      <h4 className="font-semibold text-slate-700 text-sm mb-1">{title}</h4>
      <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}

export default DashboardPage;
