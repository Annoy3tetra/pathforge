import { useEffect, useState } from "react";

import API from "../api/axios";

import { useAuth } from "../context/AuthContext";

import {
  useNavigate,
  Link
} from "react-router-dom";

import toast from "react-hot-toast";

function DashboardPage() {
  const { logout } = useAuth();

  const navigate = useNavigate();

  const [roadmaps, setRoadmaps] = useState([]);

  const [goal, setGoal] = useState("");

  const [loading, setLoading] = useState(false);

  const fetchRoadmaps = async () => {
    try {

      const response = await API.get(
        "/roadmaps/"
      );

      setRoadmaps(response.data);

    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to fetch roadmaps"
      );
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const handleLogout = () => {
    logout();

    navigate("/login");
  };

  const handleGenerate = async () => {
    if (!goal.trim()) return;

    try {

      setLoading(true);

      await API.post(
        "/roadmaps/generate",
        {
          goal,
        }
      );

      toast.success(
        "Roadmap generated"
      );

      setGoal("");

      await fetchRoadmaps();

    } catch (error) {
      console.error(error);

      toast.error(
        "Generation failed"
      );

    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (
    milestoneId
  ) => {
    try {

      await API.put(
        `/roadmaps/milestones/${milestoneId}/complete`
      );

      toast.success(
        "Milestone completed"
      );

      await fetchRoadmaps();

    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to update milestone"
      );
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-10">

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-10">

        <h1 className="text-4xl font-bold">
          PathForge Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 rounded"
        >
          Logout
        </button>

      </div>

      <div className="bg-slate-800 p-6 rounded-xl mb-10">

        <h2 className="text-2xl font-bold mb-4">
          Generate New Roadmap
        </h2>

        <div className="flex flex-col md:flex-row gap-4">

          <input
            type="text"
            placeholder="Enter your goal..."
            value={goal}
            onChange={(e) =>
              setGoal(e.target.value)
            }
            className="flex-1 p-3 rounded bg-slate-700"
          />

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-blue-600 px-6 py-3 rounded"
          >
            {
              loading
                ? "Generating..."
                : "Generate"
            }
          </button>

        </div>

      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {
          roadmaps.map((roadmap) => {

            const total =
              roadmap.milestones.length;

            const completed =
              roadmap.milestones.filter(
                (m) => m.completed
              ).length;

            const progress =
              total === 0
                ? 0
                : Math.round(
                    (completed / total) * 100
                  );

            return (
              <div
                key={roadmap.id}
                className="bg-slate-800 p-6 rounded-xl"
              >

                <h2 className="text-2xl font-bold mb-2">
                  {roadmap.title}
                </h2>

                <p className="text-slate-300 mb-4">
                  {roadmap.description}
                </p>

                <div className="mb-4">

                  <div className="flex justify-between mb-1">

                    <span>
                      Progress
                    </span>

                    <span>
                      {progress}%
                    </span>

                  </div>

                  <div className="w-full bg-slate-700 h-3 rounded">

                    <div
                      className="bg-green-500 h-3 rounded"
                      style={{
                        width: `${progress}%`,
                      }}
                    />

                  </div>

                </div>

                <Link
                  to={`/roadmaps/${roadmap.id}`}
                  className="inline-block mb-4 bg-blue-600 px-4 py-2 rounded"
                >
                  View Roadmap
                </Link>

                <div className="space-y-3">

                  {
                    roadmap.milestones
                      .slice(0, 3)
                      .map(
                        (milestone) => (
                          <div
                            key={milestone.id}
                            className="bg-slate-700 p-3 rounded"
                          >

                            <div className="flex justify-between items-center">

                              <h3 className="font-bold">
                                {milestone.title}
                              </h3>

                              {
                                milestone.completed ? (
                                  <span>
                                    ✅
                                  </span>
                                ) : (
                                  <button
                                    onClick={() =>
                                      handleComplete(
                                        milestone.id
                                      )
                                    }
                                    className="bg-green-600 px-3 py-1 rounded text-sm"
                                  >
                                    Complete
                                  </button>
                                )
                              }

                            </div>

                            <p className="text-sm text-slate-300 mt-1">
                              {
                                milestone.description
                              }
                            </p>

                          </div>
                        )
                      )
                  }

                  {
                    roadmap.milestones.length > 3 && (
                      <p className="text-slate-400 mt-3">
                        + More milestones inside roadmap
                      </p>
                    )
                  }

                </div>

              </div>
            );
          })
        }

      </div>

    </div>
  );
}

export default DashboardPage;