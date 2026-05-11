import { useQuery } from "@tanstack/react-query";
import API from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export const insightsKeys = {
  insights: ["insights"],
};

export function useInsights() {
  return useQuery({
    queryKey: insightsKeys.insights,
    queryFn: async () => {
      const { data } = await API.get(ENDPOINTS.PROFILE.INSIGHTS);
      return data;
    },
  });
}
