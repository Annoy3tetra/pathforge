import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";
import { Sparkles, ArrowRight, CheckCircle2, Circle } from "lucide-react";

import { DashboardLayout } from "../layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { ProgressBar } from "../components/ui/ProgressBar";

function DashboardPage() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchRoadmaps = async () => {
    try {
      const response = await API.get("/roadmaps/");
      setRoadmaps(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch roadmaps");
    } finally {
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const handleGenerate = async () => {
    if (!goal.trim()) return;
    try {
      setLoading(true);
      await API.post("/roadmaps/generate", { goal });
      toast.success("Roadmap generated successfully!");
      setGoal("");
      await fetchRoadmaps();
    } catch (error) {
      console.error(error);
      toast.error("Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (milestoneId) => {
    try {
      await API.put(`/roadmaps/milestones/${milestoneId}/complete`);
      toast.success("Milestone completed!");
      await fetchRoadmaps();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update milestone");
    }
  };

  if (initialLoad) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard">
      {/* Generate Section */}
      <Card className="mb-8 bg-gradient-to-br from-slate-900 to-indigo-950/20 border-indigo-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-400" />
            Generate New Roadmap
          </CardTitle>
          <CardDescription>
            Tell our AI what you want to learn, and we'll create a step-by-step path for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="text"
              placeholder="e.g., Become a full-stack web developer..."
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="flex-1 bg-slate-950/50"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <Button
              onClick={handleGenerate}
              isLoading={loading}
              disabled={!goal.trim()}
              className="sm:w-auto w-full"
            >
              Generate Path
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Roadmaps Grid */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-100">Your Learning Paths</h2>
        <span className="text-sm text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full">
          {roadmaps.length} {roadmaps.length === 1 ? 'path' : 'paths'}
        </span>
      </div>

      {roadmaps.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 px-4 text-center border-dashed">
          <div className="h-16 w-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 text-slate-400">
            <Compass className="h-8 w-8" />
          </div>
          <CardTitle className="mb-2">No roadmaps yet</CardTitle>
          <CardDescription className="max-w-md">
            You haven't generated any learning paths. Use the form above to tell us what you want to learn, and we'll map it out.
          </CardDescription>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmaps.map((roadmap) => {
            const total = roadmap.milestones.length;
            const completed = roadmap.milestones.filter((m) => m.completed).length;
            const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

            return (
              <Card key={roadmap.id} className="flex flex-col hover:border-indigo-500/30 transition-colors group">
                <CardHeader className="pb-4">
                  <CardTitle className="line-clamp-1" title={roadmap.title}>
                    {roadmap.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 min-h-[40px]">
                    {roadmap.description || "No description provided."}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <div className="space-y-1.5 mb-5">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400 font-medium">Progress</span>
                      <span className="text-indigo-400 font-bold">{progress}%</span>
                    </div>
                    <ProgressBar progress={progress} />
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Next Milestones</h4>
                    {roadmap.milestones.slice(0, 3).map((milestone) => (
                      <div key={milestone.id} className="flex items-start gap-3">
                        <button 
                          onClick={() => !milestone.completed && handleComplete(milestone.id)}
                          className={`mt-0.5 shrink-0 transition-colors ${
                            milestone.completed 
                              ? "text-emerald-500" 
                              : "text-slate-600 hover:text-indigo-400"
                          }`}
                          disabled={milestone.completed}
                        >
                          {milestone.completed ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <Circle className="h-5 w-5" />
                          )}
                        </button>
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm truncate ${
                            milestone.completed ? "text-slate-500 line-through" : "text-slate-300"
                          }`}>
                            {milestone.title}
                          </p>
                        </div>
                      </div>
                    ))}
                    {roadmap.milestones.length > 3 && (
                      <p className="text-xs text-slate-500 pl-8">
                        + {roadmap.milestones.length - 3} more
                      </p>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="pt-0 mt-auto">
                  <Link to={`/roadmaps/${roadmap.id}`} className="w-full">
                    <Button variant="secondary" className="w-full group-hover:bg-slate-700">
                      View Full Path
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}

// Ensure Compass is available for the empty state
import { Compass } from "lucide-react";

export default DashboardPage;