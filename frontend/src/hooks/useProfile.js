import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../api/axios";
import toast from "react-hot-toast";

export const profileKeys = {
  profile: ["profile"],
};

/**
 * Fetch the current user's profile.
 */
export function useProfile() {
  return useQuery({
    queryKey: profileKeys.profile,
    queryFn: async () => {
      const { data } = await API.get("/profile/me");
      return data;
    },
    retry: false, // 404 means profile doesn't exist yet — don't retry
  });
}

/**
 * Create a profile.
 */
export function useCreateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profileData) => {
      const { data } = await API.post("/profile/", profileData);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: profileKeys.profile });
      toast.success("Profile created!");
    },
    onError: () => toast.error("Failed to create profile"),
  });
}

/**
 * Update the current user's profile.
 */
export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profileData) => {
      const { data } = await API.put("/profile/me", profileData);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: profileKeys.profile });
      toast.success("Profile saved!");
    },
    onError: (error) => {
      const detail = error.response?.data?.detail;
      if (Array.isArray(detail)) {
        toast.error(detail[0]?.msg || "Validation error");
      } else {
        toast.error(typeof detail === "string" ? detail : "Failed to save profile");
      }
    },
  });
}
