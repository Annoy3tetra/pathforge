import { useInsights } from "../../hooks/useInsights";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { Activity, Target, Zap, Lightbulb } from "lucide-react";
import { Skeleton } from "./Skeleton";

export function InsightsCards() {
  const { data: insights, isLoading } = useInsights();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div className="mb-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900/60 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" /> Learning Pace
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-200 font-medium leading-relaxed">
              {insights.pace}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" /> Consistency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-200 font-medium leading-relaxed">
              {insights.consistency}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <Target className="h-4 w-4 text-indigo-400" /> Domain Focus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-200 font-medium leading-relaxed">
              {insights.domains}
            </p>
          </CardContent>
        </Card>
      </div>

      {insights.suggestions && (
        <Card className="bg-slate-900/60 border-slate-800 border-dashed">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-400" /> Recommendations for You
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Suggested Topics</h4>
                <div className="flex flex-wrap gap-2">
                  {insights.suggestions.topics.map((topic, i) => (
                    <span key={i} className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-md text-xs font-medium">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Skills to Explore</h4>
                <div className="flex flex-wrap gap-2">
                  {insights.suggestions.skills.map((skill, i) => (
                    <span key={i} className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-md text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
