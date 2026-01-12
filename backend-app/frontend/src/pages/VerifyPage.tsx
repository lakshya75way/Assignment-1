import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AuthLayout from "../components/organisms/AuthLayout";
import Button from "../components/atoms/Button";
import { verifyEmail } from "../services/authService";
import { AxiosError } from "axios";

const VerifyPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [message, setMessage] = useState("Verifying your account...");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const hasCalled = React.useRef(false);
  useEffect(() => {
    const doVerify = async () => {
      if (!token || hasCalled.current) return;
      hasCalled.current = true;
      try {
        const response = await verifyEmail(token);
        setMessage(response.message || "Email verified successfully!");
      } catch (err: unknown) {
        const axiosError = err as AxiosError<{ message: string }>;
        setError(axiosError.response?.data?.message || "Verification failed");
      } finally {
        setIsLoading(false);
      }
    };
    doVerify();
  }, [token]);

  return (
    <AuthLayout title="Email Verification">
      <div className="verify-container">
        {isLoading ? (
          <p>{message}</p>
        ) : error ? (
          <div>
            <p className="error-text">{error}</p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                marginTop: "1rem",
              }}
            >
              <Link to="/forgot-password">
                <Button style={{ width: "100%" }}>
                  Send New Verification Link
                </Button>
              </Link>
              <Link to="/signup">
                <Button style={{ width: "100%", background: "#666" }}>
                  Back to Signup
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <p className="success-text">{message}</p>
            <Link to="/login">
              <Button style={{ marginTop: "1rem" }}>Login Now</Button>
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerifyPage;
