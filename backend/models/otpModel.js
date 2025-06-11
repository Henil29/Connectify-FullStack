import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: Number, required: true },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

export const OtpVerification = mongoose.model("OtpVerification", otpSchema);
