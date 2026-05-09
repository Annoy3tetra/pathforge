import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../api/axios";
import toast from "react-hot-toast";

// ──────────────────────────────────────
// Query Keys — centralized for cache invalidation
// ──────────────────────────────────────
export const queryKeys = {
  roadmaps: ["roadmaps"],
  roadmap: (id) => ["roadmaps", id],
  feedback: (id) => ["roadmaps", id, "feedback"],
  analytics: (id) => ["roadmaps", id, "analytics"],
};

// ──────────────────────────────────────
// Queries
// ──────────────────────────────────────

/**
 * Fetch all roadmaps for the current user.
 */
export function useRoadmaps() {
  return useQuery({
    queryKey: queryKeys.roadmaps,
    queryFn: async () => {
      const { data } = await API.get("/roadmaps/");
      return data;
    },
  });
}

/**
 * Fetch a single roadmap by ID (derived from the roadmaps list).
 */
export function useRoadmap(roadmapId) {
  return useQuery({
    queryKey: queryKeys.roadmap(roadmapId),
    queryFn: async () => {
      const { data } = await API.get("/roadmaps/");
      const roadmap = data.find((r) => r.id === Number(roadmapId));
      if (!roadmap) throw new Error("Roadmap not found");
      return roadmap;
    },
  });
}

/**
 * Fetch pace feedback for a roadmap.
 */
export function useFeedback(roadmapId) {
  return useQuery({
    queryKey: queryKeys.feedback(roadmapId),
    queryFn: async () => {
      const { data } = await API.get(`/roadmaps/${roadmapId}/feedback`);
      return data;
    },
    enabled: !!roadmapId,
  });
}

/**
 * Fetch analytics for a roadmap.
 */
export function useAnalytics(roadmapId) {
  return useQuery({
    queryKey: queryKeys.analytics(roadmapId),
    queryFn: async () => {
      const { data } = await API.get(`/roadmaps/${roadmapId}/analytics`);
      return data;
    },
    enabled: !!roadmapId,
  });
}

// ──────────────────────────────────────
// Mutations
// ──────────────────────────────────────

/**
 * Generate a new AI roadmap.
 */
export function useGenerateRoadmap() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (goal) => {
      const { data } = await API.post("/roadmaps/generate", { goal });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.roadmaps });
      toast.success("Roadmap generated successfully!");
    },
    onError: (error) => {
      const detail = error.response?.data?.detail;
      const msg = typeof detail === "object" ? detail.error : "Generation failed. Please try again.";
      toast.error(msg);
      throw error; // re-throw so caller can access the error
    },
  });
}

/**
 * Delete a roadmap.
 */
export function useDeleteRoadmap() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (roadmapId) => {
      await API.delete(`/roadmaps/${roadmapId}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.roadmaps });
      toast.success("Roadmap deleted");
    },
    onError: () => toast.error("Failed to delete roadmap"),
  });
}

/**
 * Update a roadmap's title/description.
 */
export function useUpdateRoadmap() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ roadmapId, updates }) => {
      await API.put(`/roadmaps/${roadmapId}`, updates);
    },
    onSuccess: (_, { roadmapId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.roadmap(roadmapId) });
      toast.success("Roadmap updated");
    },
    onError: () => toast.error("Failed to update roadmap"),
  });
}

/**
 * Complete a milestone.
 */
export function useCompleteMilestone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (milestoneId) => {
      const { data } = await API.put(`/roadmaps/milestones/${milestoneId}/complete`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.roadmaps });
      toast.success("Milestone completed!");
    },
    onError: () => toast.error("Failed to update milestone"),
  });
}

/**
 * Update a milestone.
 */
export function useUpdateMilestone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ milestoneId, updates }) => {
      await API.put(`/roadmaps/milestones/${milestoneId}`, updates);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.roadmaps });
      toast.success("Milestone updated");
    },
    onError: () => toast.error("Failed to update milestone"),
  });
}

/**
 * Delete a milestone.
 */
export function useDeleteMilestone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (milestoneId) => {
      await API.delete(`/roadmaps/milestones/${milestoneId}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.roadmaps });
      toast.success("Milestone removed");
    },
    onError: () => toast.error("Failed to delete milestone"),
  });
}

/**
 * Add a milestone to a roadmap.
 */
export function useAddMilestone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ roadmapId, milestone }) => {
      const { data } = await API.post(`/roadmaps/${roadmapId}/milestones`, milestone);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.roadmaps });
      toast.success("Milestone added");
    },
    onError: () => toast.error("Failed to add milestone"),
  });
}
