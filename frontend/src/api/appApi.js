import { apiClient, fetcher } from "./client";

export const appApi = {
  register: (payload) => fetcher(apiClient.post("/auth/register", payload)),
  login: (payload) => fetcher(apiClient.post("/auth/login", payload)),
  me: () => fetcher(apiClient.get("/auth/me")),
  getWorker: (workerId) => fetcher(apiClient.get(`/workers/${workerId}`)),
  updateWorker: (workerId, payload) => fetcher(apiClient.put(`/workers/${workerId}`, payload)),
  getWorkerActivity: (workerId) => fetcher(apiClient.get(`/workers/${workerId}/activity`)),
  calculatePremium: (workerId) =>
    fetcher(apiClient.post("/premium/calculate", { workerId })),
  getLatestPremium: (workerId) => fetcher(apiClient.get(`/premium/${workerId}/latest`)),
  createPolicy: (payload) => fetcher(apiClient.post("/policies", payload)),
  getPolicies: (workerId) => fetcher(apiClient.get(`/policies/${workerId}`)),
  activatePolicy: (policyId) => fetcher(apiClient.patch(`/policies/${policyId}/activate`)),
  cancelPolicy: (policyId) => fetcher(apiClient.patch(`/policies/${policyId}/cancel`)),
  getLiveDisruptions: (zone) =>
    fetcher(apiClient.get("/disruptions/live", { params: zone ? { zone } : {} })),
  simulateDisruption: (payload) => fetcher(apiClient.post("/disruptions/simulate", payload)),
  getDisruptionHistory: () => fetcher(apiClient.get("/disruptions/history")),
  triggerClaim: (payload) => fetcher(apiClient.post("/claims/trigger", payload)),
  fileClaim: (payload) => fetcher(apiClient.post("/claims/file", payload)),
  getClaims: (workerId) => fetcher(apiClient.get(`/claims/${workerId}`)),
  getClaimDetails: (claimId) => fetcher(apiClient.get(`/claims/details/${claimId}`)),
  getAdminPendingClaims: () => fetcher(apiClient.get("/claims/admin/pending")),
  getAdminAllClaims: () => fetcher(apiClient.get("/claims/admin/all")),
  reviewClaim: (claimId, payload) =>
    fetcher(apiClient.patch(`/claims/${claimId}/review`, payload)),
  processPayout: (claimId) => fetcher(apiClient.post("/payouts/process", { claimId })),
  getPayouts: (workerId) => fetcher(apiClient.get(`/payouts/${workerId}`)),
  getWorkerAnalytics: (workerId) =>
    fetcher(apiClient.get(`/analytics/worker/${workerId}`)),
  getAdminOverview: () => fetcher(apiClient.get("/analytics/admin/overview")),
  getAdminFraud: () => fetcher(apiClient.get("/analytics/admin/fraud")),
  getAdminDisruptions: () => fetcher(apiClient.get("/analytics/admin/disruptions"))
};

