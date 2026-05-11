import { useInsights } from "../../hooks/useInsights";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Activity, Target, Zap, Lightbulb } from "lucide-react";
import { Skeleton } from "../ui/Skeleton";
import { motion } from "framer-motion";

export function InsightsCards() {
  const { data: insights, isLoading } = useInsights();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
    );
  }

  if (!insights) return null;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="mb-12 space-y-8">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div variants={item}>
          <Card className="h-full border-amber-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" /> Learning Pace
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-200 font-bold leading-relaxed">
                {insights.pace}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="h-full border-emerald-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-400" /> Consistency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-200 font-bold leading-relaxed">
                {insights.consistency}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="h-full border-indigo-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Target className="h-4 w-4 text-indigo-400" /> Domain Focus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-200 font-bold leading-relaxed">
                {insights.domains}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {insights.suggestions && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-indigo-500/10 bg-indigo-500/5">
            <CardHeader className="pb-4 border-b border-white/5 mb-6">
              <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-400 animate-pulse" /> AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Suggested Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {insights.suggestions.topics.map((topic, i) => (
                      <span key={i} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-lg text-xs font-bold shadow-sm">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Skills to Forge</h4>
                  <div className="flex flex-wrap gap-2">
                    {insights.suggestions.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-lg text-xs font-bold shadow-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
