import { signAccessToken, signRefreshToken } from "../../utils/jwt";
import { AppError } from "../../middlewares/error.middleware";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { User } from "../../models/user.model";
//import { JwtPayload } from "../../utils/jwt.types";
import { sendMail } from "../../utils/mailer";
// import { accessSync } from "fs";
// import { string } from "zod";
// import { error } from "console";


export const signupService = async (
    email: string,
    password: string
) => {
    const exists = await User.findOne({ email });

    if (exists) throw new AppError("user already exists", 400);

    const hashed = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString("hex");

    await User.create({
        email,
        password: hashed,
        verificationToken: token
    });

    await sendMail(
        email,
        "verify Your account ",
        `click here:
        http://localhost:3000/api/auth/verify/${token}`
    );
};

export const verifyService = async (
    token: string
) => {
    const user = await User.findOne({ verificationToken: token });
    if (!user) throw new AppError("invalid token", 400);

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

};

export const loginService = async (
    email: string,
    password: string) => {


    const user = await User.findOne({ email });
    if (!user) throw new AppError("Incorrect username or password", 401);

    if (!user.isVerified) throw new AppError("Please verify your email", 401);
    const match = await bcrypt.compare(
        password,
        user.password as string

    );
    if (!match) throw new AppError("wrong email or password", 401);
    const payload = {
        userId: user.id,
        email: user.email,
        tokenVersion: user.tokenVersion
    };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    user.refreshToken = refreshToken;
    await user.save();

    return {
        accessToken,
        refreshToken
    };
};

export const refreshTokenService = async (
    refreshToken: string
) => {
    const user = await User.findOne({ refreshToken });
    if (!user) throw new AppError("Invalid refresh token", 401);
    const payload = {
        userId: user.id,
        email: user.email,
        tokenVersion: user.tokenVersion
    };


    const newAccessToken = signAccessToken(payload);

    return newAccessToken;

};

export const logoutService = async (
    refreshToken: string
) => {
    const user = await User.findOne({ refreshToken });
    if (!user) throw new AppError("Invalid refresh token", 401);
    user.tokenVersion += 1;
    user.refreshToken = undefined;
    await user.save();
};

export const changePass = async (
    userId: string,
    oldPass: string,
    newPass: string
) => {
    const user = await User.findById(userId);

    if (!user) throw new AppError("user not found", 404);
    const match = await bcrypt.compare(oldPass, user.password);
    if (!match) throw new AppError("invalid password", 401);

    user.password = await bcrypt.hash(newPass, 10);
    user.tokenVersion += 1;
    user.refreshToken = undefined;
    await user.save();
};

export const forgotPass = async (
    email: string
) => {
    const user = await User.findOne({ email });
    if (!user) throw new AppError("no user found please signup", 404);

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    await user.save();

    await sendMail(
        email,
        "Reset password",
        `Reset Link: http://localhost:3000/api/auth/reset/${token}`
    );

};

export const resetPass = async (
    token: string,
    newpass: string
) => {
    const user = await User.findOne({
        resetToken: token
    });
    if (!user) throw new AppError("invalid token", 400);
    user.password = await bcrypt.hash(newpass, 10);
    user.resetToken = undefined;
    user.tokenVersion += 1;
    user.refreshToken = undefined;
    await user.save();
};