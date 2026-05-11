import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import API from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export const forgeProfileKeys = {
  profile: ["forge-profile"],
  analysis: ["forge-profile", "analysis"],
  recommendations: ["forge-profile", "recommendations"],
};

export function useForgeProfile() {
  return useQuery({
    queryKey: forgeProfileKeys.profile,
    queryFn: async () => {
      const { data } = await API.get(ENDPOINTS.FORGE_PROFILE.ME);
      return data;
    },
  });
}

export function useForgeProfileAnalysis() {
  return useQuery({
    queryKey: forgeProfileKeys.analysis,
    queryFn: async () => {
      const { data } = await API.get(ENDPOINTS.FORGE_PROFILE.ANALYSIS);
      return data;
    },
  });
}

export function useForgeRecommendations() {
  return useQuery({
    queryKey: forgeProfileKeys.recommendations,
    queryFn: async () => {
      const { data } = await API.get(ENDPOINTS.RECOMMENDATIONS.ME);
      return data;
    },
  });
}

export function useSaveForgeProfile() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (profileData) => {
      const { data } = await API.put(ENDPOINTS.FORGE_PROFILE.ME, profileData);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: forgeProfileKeys.profile });
      qc.invalidateQueries({ queryKey: forgeProfileKeys.analysis });
      qc.invalidateQueries({ queryKey: forgeProfileKeys.recommendations });
      toast.success("ForgeProfile updated");
    },
    onError: (error) => {
      const detail = error.response?.data?.detail;
      const message = Array.isArray(detail)
        ? detail[0]?.msg
        : typeof detail === "string"
          ? detail
          : "Failed to save ForgeProfile";
      toast.error(message);
    },
  });
}
