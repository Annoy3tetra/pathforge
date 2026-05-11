export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    ME: "/auth/me",
  },
  PROFILE: {
    BASE: "/profile",
    ME: "/profile/me",
    IMAGE: "/profile/image",
    INSIGHTS: "/profile/insights",
  },
  ROADMAPS: {
    BASE: "/roadmaps",
    GENERATE: "/roadmaps/generate",
    DETAIL: (id) => `/roadmaps/${id}`,
    UPDATE: (id) => `/roadmaps/${id}`,
    DELETE: (id) => `/roadmaps/${id}`,
    MILESTONES: (id) => `/roadmaps/${id}/milestones`,
    MILESTONE_COMPLETE: (id) => `/roadmaps/milestones/${id}/complete`,
    MILESTONE: (id) => `/roadmaps/milestones/${id}`,
    FEEDBACK: (id) => `/roadmaps/${id}/feedback`,
    ANALYTICS: (id) => `/roadmaps/${id}/analytics`,
  },
  RESOURCES: {
    ROADMAP_RESOURCES: (id) => `/resources/roadmap/${id}`,
  }
};
