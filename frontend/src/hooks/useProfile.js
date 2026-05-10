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
      return data; // null when no profile exists
    },
  });
}

/**
 * Create a profile.
 */
export function useCreateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profileData) => {
      const { data } = await API.post("/profile", profileData);
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

/**
 * Upload a profile image.
 */
export function useUploadProfileImage() {
  return useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await API.post("/profile/image", formData);
      return data.url;
    },
    onError: (err) => {
      toast.error(err.response?.data?.detail || "Failed to upload image");
    },
  });
}
