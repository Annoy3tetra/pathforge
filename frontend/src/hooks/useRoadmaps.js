import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../api/axios";
import toast from "react-hot-toast";
import { ENDPOINTS } from "../api/endpoints";

// ──────────────────────────────────────
// Query Keys — centralized for cache invalidation
// ──────────────────────────────────────
export const queryKeys = {
  roadmaps: ["roadmaps"],
  roadmap: (id) => ["roadmaps", id],
  feedback: (id) => ["roadmaps", id, "feedback"],
  analytics: (id) => ["roadmaps", id, "analytics"],
};

function markMilestoneCompleteInRoadmap(roadmap, milestoneId) {
  if (!roadmap?.milestones) return roadmap;

  let changed = false;
  const milestones = roadmap.milestones.map((milestone) => {
    if (milestone.id !== milestoneId || milestone.completed) return milestone;
    changed = true;
    return { ...milestone, completed: true };
  });

  return changed ? { ...roadmap, milestones } : roadmap;
}

function markMilestoneComplete(data, milestoneId) {
  if (Array.isArray(data)) {
    return data.map((roadmap) => markMilestoneCompleteInRoadmap(roadmap, milestoneId));
  }

  return markMilestoneCompleteInRoadmap(data, milestoneId);
}

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
      const { data } = await API.get(ENDPOINTS.ROADMAPS.BASE);
      return data;
    },
  });
}

/**
 * Fetch a single roadmap by ID.
 */
export function useRoadmap(roadmapId) {
  return useQuery({
    queryKey: queryKeys.roadmap(roadmapId),
    queryFn: async () => {
      const { data } = await API.get(ENDPOINTS.ROADMAPS.DETAIL(roadmapId));
      return data;
    },
    enabled: !!roadmapId,
  });
}

/**
 * Fetch pace feedback for a roadmap.
 */
export function useFeedback(roadmapId) {
  return useQuery({
    queryKey: queryKeys.feedback(roadmapId),
    queryFn: async () => {
      const { data } = await API.get(ENDPOINTS.ROADMAPS.FEEDBACK(roadmapId));
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
      const { data } = await API.get(ENDPOINTS.ROADMAPS.ANALYTICS(roadmapId));
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
      const { data } = await API.post(ENDPOINTS.ROADMAPS.GENERATE, { goal });
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
      throw error;
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
      await API.delete(ENDPOINTS.ROADMAPS.DELETE(roadmapId));
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
      await API.put(ENDPOINTS.ROADMAPS.UPDATE(roadmapId), updates);
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
      const { data } = await API.put(ENDPOINTS.ROADMAPS.MILESTONE_COMPLETE(milestoneId));
      return data;
    },
    onMutate: async (milestoneId) => {
      await qc.cancelQueries({ queryKey: queryKeys.roadmaps });
      const previousRoadmaps = qc.getQueryData(queryKeys.roadmaps);

      // Optimistic cache patch keeps milestone clicks responsive without refetching the whole dashboard first.
      qc.setQueriesData({ queryKey: queryKeys.roadmaps }, (oldData) => (
        markMilestoneComplete(oldData, milestoneId)
      ));

      return { previousRoadmaps };
    },
    onError: (_error, _milestoneId, context) => {
      if (context?.previousRoadmaps) {
        qc.setQueryData(queryKeys.roadmaps, context.previousRoadmaps);
      }
      toast.error("Failed to update milestone");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.roadmaps, refetchType: "inactive" });
      toast.success("Milestone completed!");
    },
  });
}

/**
 * Update a milestone.
 */
export function useUpdateMilestone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ milestoneId, updates }) => {
      await API.put(ENDPOINTS.ROADMAPS.MILESTONE(milestoneId), updates);
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
      await API.delete(ENDPOINTS.ROADMAPS.MILESTONE(milestoneId));
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
      const { data } = await API.post(ENDPOINTS.ROADMAPS.MILESTONES(roadmapId), milestone);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.roadmaps });
      toast.success("Milestone added");
    },
    onError: () => toast.error("Failed to add milestone"),
  });
}
