import React from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/atoms/Button";
import { logout } from "../services/authService";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      try {
        await logout(refreshToken);
      } catch (err) {
        console.error("Logout failed", err);
      }
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <div
      className="dashboard-container"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f7fb",
      }}
    >
      <div
        className="dashboard-card"
        style={{
          background: "white",
          padding: "3rem",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          textAlign: "center",
          maxWidth: "400px",
          width: "90%",
        }}
      >
        <h1
          style={{
            marginBottom: "2rem",
            color: "#1a202c",
            fontSize: "1.75rem",
          }}
        >
          Account Settings
        </h1>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Link to="/change-password" style={{ textDecoration: "none" }}>
            <Button
              style={{
                width: "100%",
                background: "#4CAF50",
                height: "48px",
                fontSize: "1rem",
                borderRadius: "8px",
              }}
            >
              Change Password
            </Button>
          </Link>
          <Link to="/jobs" style={{ textDecoration: "none" }}>
            <Button
              style={{
                width: "100%",
                background: "#3b82f6",
                height: "48px",
                fontSize: "1rem",
                borderRadius: "8px",
              }}
            >
              View Background Jobs
            </Button>
          </Link>
          <Button
            onClick={handleLogout}
            style={{
              width: "100%",
              background: "#ff4d4f",
              height: "48px",
              fontSize: "1rem",
              borderRadius: "8px",
            }}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
