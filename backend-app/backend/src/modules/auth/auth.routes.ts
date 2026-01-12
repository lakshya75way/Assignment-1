import { Router } from "express";

import { protect } from "../../middlewares/auth.middlewares";
import {
    signup,
    login,
    verify,
    changePassword,
    forgotPassword,
    resetPassword,
    refreshToken,
    logout
} from "./auth.controller";

const router = Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/verify/:token", verify);
router.post("/change-password", protect, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset/:token", resetPassword);
router.post("/refresh-token", refreshToken);
router.post("/logout", protect, logout);
export default router;
