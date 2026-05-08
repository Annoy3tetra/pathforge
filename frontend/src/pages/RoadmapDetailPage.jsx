import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";
import { ArrowLeft, CheckCircle2, Circle, Clock } from "lucide-react";

import { DashboardLayout } from "../layouts/DashboardLayout";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { ProgressBar } from "../components/ui/ProgressBar";

function RoadmapDetailPage() {
  const { roadmapId } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRoadmap = async () => {
    try {
      const response = await API.get("/roadmaps/");
      const foundRoadmap = response.data.find((r) => r.id === Number(roadmapId));
      setRoadmap(foundRoadmap);
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

  const handleComplete = async (milestoneId) => {
    try {
      await API.put(`/roadmaps/milestones/${milestoneId}/complete`);
      toast.success("Milestone completed");
      await fetchRoadmap();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update milestone");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Loading Path...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!roadmap) {
    return (
      <DashboardLayout title="Path Not Found">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Roadmap not found</h2>
          <Link to="/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const total = roadmap.milestones.length;
  const completed = roadmap.milestones.filter((m) => m.completed).length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <DashboardLayout title="Roadmap Details">
      <div className="mb-6">
        <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-indigo-400 transition-colors mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-100 mb-3">
          {roadmap.title}
        </h1>
        <p className="text-lg text-slate-400 max-w-3xl">
          {roadmap.description}
        </p>
      </div>

      {/* Progress Section */}
      <Card className="mb-10 bg-slate-900/50">
        <CardContent className="pt-6">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Overall Progress</p>
              <p className="text-3xl font-bold text-slate-100 mt-1">{progress}%</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-400">
                <span className="text-indigo-400">{completed}</span> of {total} milestones
              </p>
            </div>
          </div>
          <ProgressBar progress={progress} className="h-4" />
        </CardContent>
      </Card>

      {/* Milestones List */}
      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 md:before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
        {roadmap.milestones.map((milestone, index) => (
          <div key={milestone.id} className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            
            {/* Timeline dot */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-950 bg-slate-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10 transition-colors">
              {milestone.completed ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : (
                <div className="h-2.5 w-2.5 rounded-full bg-slate-600 group-hover:bg-indigo-400 transition-colors" />
              )}
            </div>
            
            {/* Content Card */}
            <Card className={`w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] transition-all hover:border-indigo-500/30 ${milestone.completed ? 'opacity-75' : ''}`}>
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                        Step {index + 1}
                      </span>
                      <span className="flex items-center text-xs text-slate-500 font-medium">
                        <Clock className="mr-1 h-3 w-3" />
                        {milestone.estimated_days} {milestone.estimated_days === 1 ? 'day' : 'days'}
                      </span>
                    </div>
                    <h3 className={`text-lg font-bold ${milestone.completed ? 'text-slate-400 line-through' : 'text-slate-100'}`}>
                      {milestone.title}
                    </h3>
                  </div>
                  
                  {!milestone.completed && (
                    <Button 
                      size="sm" 
                      onClick={() => handleComplete(milestone.id)}
                      className="shrink-0"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Mark Done
                    </Button>
                  )}
                  {milestone.completed && (
                    <div className="text-emerald-500 text-sm font-medium flex items-center shrink-0 h-9">
                      <CheckCircle2 className="mr-1.5 h-4 w-4" />
                      Completed
                    </div>
                  )}
                </div>
                
                <p className={`text-sm ${milestone.completed ? 'text-slate-500' : 'text-slate-400'}`}>
                  {milestone.description}
                </p>
              </CardContent>
            </Card>
            
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default RoadmapDetailPage;