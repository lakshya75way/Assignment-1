import React, { useEffect, useState, useCallback } from "react";
import {
  getAllJobs,
  getAdminJobs,
  submitJob,
  Job,
} from "../services/jobService";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import JobForm from "../modules/jobs/components/JobForm";
import JobItem from "../modules/jobs/components/JobItem";
import JobSidebar from "../modules/jobs/components/JobSidebar";

import "../modules/jobs/styles/JobsDashboard.css";

const JobsDashboardPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      let isAdmin = false;
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          isAdmin = payload.role === "admin";
        } catch (e) {
          console.error("Token parse error", e);
        }
      }

      const response = isAdmin ? await getAdminJobs() : await getAllJobs();
      setJobs(response.data);
    } catch (error) {
      console.error("Fetch failed", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 3000);
    return () => clearInterval(interval);
  }, [fetchJobs]);

  const handleJobSubmit = async (
    name: string,
    shouldFail: boolean,
    priority: number
  ) => {
    try {
      await submitJob(name, { shouldFail }, priority);
      fetchJobs();
    } catch (error) {
      console.error(error);
    }
  };

  const selectedJob = jobs.find((j) => j.id === selectedJobId);

  return (
    <div className="jobs-container">
      <div className="jobs-wrapper">
        <Link to="/dashboard" className="back-link">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="page-header">
          <h1>Jobs Manager</h1>
        </div>

        <div
          className={`dashboard-grid ${
            selectedJob ? "grid-with-sidebar" : "grid-full"
          }`}
        >
          <main>
            <JobForm onSubmit={handleJobSubmit} />

            <div className="jobs-list-card">
              <div className="table-header">
                <div>Progress</div>
                <div>Job Details</div>
                <div style={{ textAlign: "center" }}>Attempts</div>
                <div style={{ textAlign: "center" }}>Start</div>
                <div style={{ textAlign: "right" }}>Logs</div>
              </div>

              {isLoading ? (
                <div
                  style={{
                    padding: "60px",
                    textAlign: "center",
                    color: "#888888",
                  }}
                >
                  Loading...
                </div>
              ) : jobs.length === 0 ? (
                <div
                  style={{
                    padding: "60px",
                    textAlign: "center",
                    color: "#888888",
                  }}
                >
                  Queue is empty.
                </div>
              ) : (
                jobs.map((job) => (
                  <JobItem
                    key={job.id}
                    job={job}
                    isSelected={selectedJobId === job.id}
                    onSelect={(id) =>
                      setSelectedJobId(id === selectedJobId ? null : id)
                    }
                  />
                ))
              )}
            </div>
          </main>

          {selectedJob && (
            <JobSidebar
              job={selectedJob}
              onClose={() => setSelectedJobId(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default JobsDashboardPage;
