import React from "react";
import { Job } from "../../../services/jobService";

interface JobSidebarProps {
  job: Job;
  onClose: () => void;
}

const JobSidebar: React.FC<JobSidebarProps> = ({ job, onClose }) => {
  return (
    <aside className="logs-sidebar">
      <div className="sidebar-header">
        <h3>Execution Logs</h3>
        <button onClick={onClose} className="close-btn">
          &times;
        </button>
      </div>

      <div className="log-section">
        <label className="log-label">PAYLOAD</label>
        <div className="code-block">{JSON.stringify(job.data, null, 2)}</div>
      </div>

      {job.result && (
        <div className="log-section">
          <label className="log-label" style={{ color: "#008800" }}>
            SUCCESS OUTPUT
          </label>
          <div className="success-box">{job.result}</div>
        </div>
      )}

      {job.error && (
        <div className="log-section">
          <label className="log-label" style={{ color: "#cc0000" }}>
            ERROR HISTORY
          </label>
          <div className="error-box">{job.error}</div>
        </div>
      )}
    </aside>
  );
};

export default JobSidebar;
