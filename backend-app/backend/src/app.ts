import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import jobRoutes from "./modules/jobs/job.routes";
import { globalErrorHandler } from "./middlewares/error.middleware";


const app = express();

app.use(cors());
app.use(express.json());



app.get("/", (_req, res) => {
  res.json({ message: "Welcome to the Backend API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

app.use(globalErrorHandler);

export default app;
