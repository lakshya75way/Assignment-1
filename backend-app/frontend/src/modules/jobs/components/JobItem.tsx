import React from "react";
import { Loader2, FileText } from "lucide-react";
import { Job } from "../../../services/jobService";

interface JobItemProps {
  job: Job;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const JobItem: React.FC<JobItemProps> = ({ job, isSelected, onSelect }) => {
  return (
    <div className="job-row">
      <div className={`status-cell status-${job.status}`}>
        {job.status === "processing" && (
          <Loader2 size={14} className="animate-spin" />
        )}
        {job.status.toUpperCase()}
      </div>

      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span className="job-info-title">{job.type}</span>
          {job.priority > 0 && (
            <span
              style={{
                fontSize: "10px",
                padding: "2px 4px",
                background: "#fef3c7",
                color: "#92400e",
                borderRadius: "4px",
                border: "1px solid #fcd34d",
              }}
            >
              P{job.priority}
            </span>
          )}
        </div>
        <div className="job-info-id">ID: {job.id}</div>
      </div>

      <div style={{ textAlign: "center", fontWeight: "bold" }}>
        {job.retries + 1}/2
      </div>

      <div style={{ textAlign: "center", color: "#555555", fontSize: "13px" }}>
        {job.startedAt
          ? new Date(job.startedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "-"}
      </div>

      <div style={{ textAlign: "right" }}>
        <button
          onClick={() => onSelect(job.id)}
          className={`log-btn ${isSelected ? "log-btn-active" : ""}`}
        >
          <FileText size={18} />
        </button>
      </div>
    </div>
  );
};

export default JobItem;
