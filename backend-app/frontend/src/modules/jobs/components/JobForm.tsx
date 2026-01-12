import React, { useState } from "react";

interface JobFormProps {
  onSubmit: (
    name: string,
    shouldFail: boolean,
    priority: number
  ) => Promise<void>;
}

const JobForm: React.FC<JobFormProps> = ({ onSubmit }) => {
  const [jobName, setJobName] = useState("");
  const [shouldFail, setShouldFail] = useState(false);
  const [priority, setPriority] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobName.trim()) return;

    setIsSubmitting(true);
    await onSubmit(jobName, shouldFail, priority);
    setJobName("");
    setShouldFail(false);
    setPriority(0);
    setIsSubmitting(false);
  };

  return (
    <div className="submit-card">
      <h2>Generate New Task</h2>
      <form onSubmit={handleSubmit} className="job-form">
        <div className="form-group">
          <label>Task Definition</label>
          <input
            type="text"
            placeholder="e.g. Bulk Invoice Generation"
            className="form-input"
            value={jobName}
            onChange={(e) => setJobName(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label>Priority Level</label>
          <select
            className="form-input"
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            disabled={isSubmitting}
          >
            <option value={0}>Standard (0)</option>
            <option value={5}>Medium (5)</option>
            <option value={10}>High (10)</option>
            <option value={100}>Critical (100)</option>
          </select>
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            id="simulateFail"
            checked={shouldFail}
            onChange={(e) => setShouldFail(e.target.checked)}
            disabled={isSubmitting}
          />
          <label htmlFor="simulateFail">
            Simulate Initial Failure (Test Retry)
          </label>
        </div>

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? "Starting..." : "Start Processing Job"}
        </button>
      </form>
    </div>
  );
};

export default JobForm;
