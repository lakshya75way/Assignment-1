import { Request, Response } from "express";
import { AppError, catchAsync } from "../../middlewares/error.middleware";
import {
    signupService,
    verifyService,
    loginService,
    changePass,
    forgotPass,
    resetPass,
    refreshTokenService,
    logoutService


} from "./auth.service";

import {
    signupSchema,
    loginSchema,
    changePassSchema,
    resetPassSchema,
    forgotPasswordSchema
} from "./auth.validation";

export const signup = catchAsync(async (req: Request, res: Response) => {
    const data = signupSchema.parse(req.body);
    await signupService(data.email, data.password);
    res.json({ message: "signup success. Check email for verification link" });
});


export const verify = catchAsync(async (req: Request, res: Response) => {
    await verifyService(req.params.token);
    res.json({ message: "email verified" });
});

export const login = catchAsync(async (req: Request, res: Response) => {
    const data = loginSchema.parse(req.body);
    const tokens = await loginService(data.email, data.password);
    res.json({ tokens });
});


export const changePassword = catchAsync(async (req: Request, res: Response) => {
    const data = changePassSchema.parse(req.body);
    const userId = (req as any).user.userId;
    await changePass(userId, data.oldPassword, data.newPassword);
    res.json({ message: "password changed" });
});

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const data = forgotPasswordSchema.parse(req.body);
    await forgotPass(data.email);
    res.json({ message: "reset email sent!!" });
});

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const data = resetPassSchema.parse(req.body);
    await resetPass(req.params.token, data.password);
    res.json({ message: "pass reset done" });
});

export const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken;
    const newAccesstoken = await refreshTokenService(refreshToken);
    res.json({ accesstoken: newAccesstoken });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        throw new AppError("refresh token is required", 400);
    }
    await logoutService(refreshToken);
    res.json({ message: "logout success" });
});