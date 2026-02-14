import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import nodemailer from "nodemailer";
import "dotenv/config.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendPasswordResetEmail = async (userId: string, email: string) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  const expiresAt = new Date(Date.now() + 3600000);

  await prisma.passwordResetToken.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  const resetLink = `${process.env.FRONTEND_URL || "http://localhost:5000"}
    /auth/reset-password/${token}`;

  await transporter.sendMail({
    from: `FitTrack <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Your Password",
    html: `<h2 style="color: #007bff;">Reset Your Password</h2>
        <p><strong>This link expires in 1 hour.</strong></p>
        <p>Please click the link below to reset your password</p>
        <button 
        style="background-color: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px;"><a href="${resetLink}" style="color: white; text-decoration: none;">
        Reset Password</a></button>
        `,
  });
};
