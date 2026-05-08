import { useEffect, useState } from "react";

import API from "../api/axios";

import { useAuth } from "../context/AuthContext";

import { useNavigate } from "react-router-dom";

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

      setGoal("");

      await fetchRoadmaps();

    } catch (error) {
      console.error(error);

      alert("Generation failed");

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

    await fetchRoadmaps();

  } catch (error) {
    console.error(error);

    alert(
      "Failed to update milestone"
    );
  }
};

  return (
    <div className="min-h-screen p-10">

      <div className="flex justify-between items-center mb-10">

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

        <div className="flex gap-4">

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
            className="bg-blue-600 px-6 rounded"
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

                    <span>Progress</span>

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

                <div className="space-y-3">

                  {
                    roadmap.milestones.map(
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