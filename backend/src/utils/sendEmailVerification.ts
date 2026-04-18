import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import nodemailer from "nodemailer";

const trasporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async ({
  userId,
  email,
  heading,
  action,
  role,
}: {
  userId: string;
  email: string;
  heading: string;
  action: string;
  role: "USER" | "ADMIN" | "MASTER";
}) => {
  await prisma.verificationToken.deleteMany({
    where: { userId },
  });
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

  await prisma.verificationToken.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  const verificationLink = `
  ${role === "USER" ? process.env.FRONTEND_URL : process.env.ADMIN_FRONTEND_URL}/auth/signup/verify-email?token=${token}`;

  await trasporter.sendMail({
    from: `FitTrack <${process.env.EMAIL_USER}>`,
    to: email,
    subject: heading,

    html: `<h2 style="color: #ff6b35;">${heading}</h2>
    <p><strong>This link expires in 1 hour.</strong></p>
    <p>Please click the link below to ${action}</p>
    <a href="${verificationLink}"
     style="display:inline-block;
            background-color: #ff6b35;
            color:white;
            padding:10px 20px;
            text-decoration:none;
            border-radius:5px;">
    ${action.charAt(0).toUpperCase() + action.slice(1)}
  </a>
    `,
  });
};
