import { useQuery } from "@tanstack/react-query";
import API from "../api/axios";

export const insightsKeys = {
  insights: ["insights"],
};

export function useInsights() {
  return useQuery({
    queryKey: insightsKeys.insights,
    queryFn: async () => {
      const { data } = await API.get("/profile/insights");
      return data;
    },
  });
}
