import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes"

const app = express();

app.use(cors());
app.use(express.json());

// Pure API - No longer serving static files from here
// app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (_req, res) => {
    res.json({ message: "Welcome to the Backend API" });
});

app.use("/api/auth", authRoutes);

import { globalErrorHandler } from "./middlewares/error.middleware";
app.use(globalErrorHandler);

export default app; 