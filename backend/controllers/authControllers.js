import { User } from "../models/userModel.js";
import getDataUrl from "../utils/urlGenrator.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcrypt";
import cloudinary from "cloudinary";
import tryCatch from "../utils/tryCatch.js";

// for otp
import { OtpVerification } from "../models/otpModel.js";
import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD // Use App Password for Gmail
    }
});

export const registerUser = tryCatch(async (req, res) => {
    const { name, email, password, gender } = req.body;

    const file = req.file;
    if (!name || !email || !password || !gender || !file) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    let user = await User.findOne({ email })

    if (user) {
        return res.status(400).json({
            message: "User already exists"
        });
    }
    const fileUrl = getDataUrl(file);

    const hashPassword = await bcrypt.hash(password, 10);

    const myClode = await cloudinary.v2.uploader.upload(fileUrl.content)

    user = await User.create({
        name,
        email,
        password: hashPassword,
        gender,
        profilePic: {
            id: myClode.public_id,
            url: myClode.secure_url
        }
    });
    generateToken(user._id, res);

    res.status(201).json({
        message: "User registered successfully",
        user,
    })
})

export const loginUser = tryCatch(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email })
    if (!user) {
        return res.status(400).json({
            message: "User not found"
        });
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
        return res.status(400).json({
            message: "Invalid password"
        });
    }
    generateToken(user._id, res);
    res.json({
        message: "User logged in successfully",
        user
    });
})

export const logoutUser = tryCatch(async (req, res) => {
    res.cookie("token", "", {
        maxAge: 0,
    });

    res.status(200).json({
        message: "User logged out successfully"
    });
})

export const sendOtp = tryCatch(async (req, res) => {
    const { email } = req.body;
    console.log("Received OTP request for email:", email);

    if (!email) return res.status(400).json({ message: "Email is required" });

    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins expiry

    console.log("Generated OTP:", otp);
    console.log("OTP expires at:", expiresAt);

    // Save or update OTP for that email
    const savedOtp = await OtpVerification.findOneAndUpdate(
        { email },
        { otp, expiresAt },
        { upsert: true, new: true }
    );
    console.log("Saved OTP to database:", savedOtp);

    // Send email using nodemailer
    try {
        const mailOptions = {
            from: `"Connectify" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your Connectify Verification Code",
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Connectify Verification Code</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <!-- Header -->
                        <div style="text-align: center; padding: 20px 0; border-bottom: 1px solid #eee;">
                            <h1 style="color: #2563eb; margin: 0; font-size: 28px;">Connectify</h1>
                            <p style="color: #6b7280; margin: 10px 0 0; font-size: 16px;">Your Social Connection Platform</p>
                        </div>

                        <!-- Main Content -->
                        <div style="padding: 30px 20px;">
                            <h2 style="color: #1f2937; margin: 0 0 20px; font-size: 24px; text-align: center;">Verification Code</h2>
                            
                            <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin: 0 0 20px; text-align: center;">
                                Please use the following verification code to complete your request:
                            </p>

                            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
                                <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #2563eb;">${otp}</span>
                            </div>

                            <p style="color: #6b7280; font-size: 14px; text-align: center; margin: 20px 0;">
                                This code will expire in 5 minutes for security reasons.
                            </p>

                            <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 25px 0; border-radius: 4px;">
                                <p style="color: #991b1b; margin: 0; font-size: 14px;">
                                    If you didn't request this verification code, please ignore this email or contact support if you have concerns.
                                </p>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div style="text-align: center; padding: 20px; border-top: 1px solid #eee; color: #6b7280; font-size: 14px;">
                            <p style="margin: 0 0 10px;">© ${new Date().getFullYear()} Connectify. All rights reserved.</p>
                            <p style="margin: 0; font-size: 12px;">
                                This is an automated message, please do not reply to this email.
                            </p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Failed to send OTP email" });
    }

    res.status(200).json({ message: "OTP sent to email" });
});

export const verifyOtp = tryCatch(async (req, res) => {
  const { email, otp } = req.body;
  console.log("Verifying OTP for:", { email, otp });

  const otpRecord = await OtpVerification.findOne({ email });
  console.log("Found OTP record:", otpRecord);

  if (!otpRecord) {
    console.log("No OTP record found for email:", email);
    return res.status(400).json({ message: "OTP not found" });
  }

  if (otpRecord.expiresAt < new Date()) {
    console.log("OTP expired at:", otpRecord.expiresAt);
    return res.status(400).json({ message: "OTP expired" });
  }

  console.log("Comparing OTPs:", { 
    received: otp, 
    stored: otpRecord.otp, 
    types: { 
      received: typeof otp, 
      stored: typeof otpRecord.otp 
    } 
  });

  if (otpRecord.otp !== Number(otp)) {
    console.log("OTP mismatch");
    return res.status(400).json({ message: "Invalid OTP" });
  }

  await OtpVerification.deleteOne({ email });
  console.log("OTP verified and deleted successfully");

  res.status(200).json({ message: "OTP verified successfully" });
});
