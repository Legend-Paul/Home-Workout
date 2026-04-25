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

export const sendPasswordResetEmail = async (
  userId: string,
  email: string,
  role: "USER" | "ADMIN" | "MASTER",
) => {
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

  const resetLink = `${role === "USER" ? process.env.FRONTEND_URL : process.env.ADMIN_FRONTEND_URL}auth/forgot-password/reset?token=${token}`;

  await transporter.sendMail({
    from: `FitTrack <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Your Password",
    html: `<h2 style="color: #ff6b35;">Reset Your Password</h2>
        <p><strong>This link expires in 1 hour.</strong></p>
        <p>Please click the link below to reset your password</p>
        <a href="${resetLink}"
          style="display:inline-block;
            background-color: #ff6b35;
            color:white;
            padding:10px 20px;
            text-decoration:none;
            border-radius:5px;">
            Reset Password
        </a>
        `,
  });
};
