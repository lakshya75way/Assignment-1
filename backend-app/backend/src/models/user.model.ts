import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";


export interface IUser extends Document {
  email: string;
  password: string;
  isVerified: boolean;
  role: "user" | "admin";
  verificationToken?: string;
  resetToken?: string;
  refreshToken?: string;
  tokenVersion: number;
}


const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    verificationToken: String,
    resetToken: String,
    refreshToken: String,
    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);


userSchema.pre<IUser>("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});


export const User = mongoose.model<IUser>("User", userSchema);
