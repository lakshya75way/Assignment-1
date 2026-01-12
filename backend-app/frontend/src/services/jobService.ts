import api from "./api";

export interface JobMetadata {
  [key: string]: string | number | boolean | null | undefined;
}

export interface Job {
  id: string;
  type: string;
  status: "pending" | "processing" | "completed" | "failed";
  data: JobMetadata;
  result?: string;
  error?: string;
  retries: number;
  maxRetries: number;
  priority: number;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
}

export const submitJob = async (
  type: string,
  data: JobMetadata = {},
  priority: number = 0
) => {
  const response = await api.post("/jobs/submit", { type, data, priority });
  return response.data;
};

export const getAllJobs = async () => {
  const response = await api.get("/jobs/all");
  return response.data;
};

export const getAdminJobs = async () => {
  const response = await api.get("/jobs/admin/all");
  return response.data;
};

export const getJobStatus = async (id: string) => {
  const response = await api.get(`/jobs/${id}`);
  return response.data;
};
