import {
  useEffect,
  useState
} from "react";

import {
  useParams
} from "react-router-dom";

import API from "../api/axios";

import toast from "react-hot-toast";

function RoadmapDetailPage() {
  const { roadmapId } = useParams();

  const [roadmap, setRoadmap] =
    useState(null);

  const fetchRoadmap = async () => {
    try {

      const response =
        await API.get(
          "/roadmaps/"
        );

      const foundRoadmap =
        response.data.find(
          (r) =>
            r.id === Number(roadmapId)
        );

      setRoadmap(foundRoadmap);

    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to load roadmap"
      );
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

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

      fetchRoadmap();

    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to update milestone"
      );
    }
  };

  if (!roadmap) {
    return (
      <div className="p-10">
        Loading roadmap...
      </div>
    );
  }

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
    <div className="min-h-screen p-6 md:p-10">

      <h1 className="text-4xl font-bold mb-4">
        {roadmap.title}
      </h1>

      <p className="text-slate-300 mb-8">
        {roadmap.description}
      </p>

      <div className="mb-8">

        <div className="flex justify-between mb-2">

          <span>
            Progress
          </span>

          <span>
            {progress}%
          </span>

        </div>

        <div className="w-full bg-slate-700 h-4 rounded">

          <div
            className="bg-green-500 h-4 rounded"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

      </div>

      <div className="space-y-4">

        {
          roadmap.milestones.map(
            (milestone) => (
              <div
                key={milestone.id}
                className="bg-slate-800 p-5 rounded-xl"
              >

                <div className="flex justify-between items-center mb-2">

                  <h2 className="text-xl font-bold">
                    {milestone.title}
                  </h2>

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
                        className="bg-green-600 px-4 py-2 rounded"
                      >
                        Complete
                      </button>
                    )
                  }

                </div>

                <p className="text-slate-300">
                  {
                    milestone.description
                  }
                </p>

                <p className="text-sm text-slate-400 mt-2">
                  Estimated Days:
                  {" "}
                  {
                    milestone.estimated_days
                  }
                </p>

              </div>
            )
          )
        }

      </div>

    </div>
  );
}

export default RoadmapDetailPage;