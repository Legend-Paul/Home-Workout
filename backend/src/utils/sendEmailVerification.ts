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

export const sendVerificationEmail = async (
  userId: string,
  email: string,
  route: string,
  heading: string,
  action: string,
) => {
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

  const verificationLink = `${process.env.FRONTEND_URL || "http://localhost:5000"}
  /verification-email/${route}/${token}`;

  await trasporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: heading,

    html: `<h2 style="color: #007bff;">FitTrack</h2>
    <p><strong>This link expires in 1 hour.</strong></p>
    <p>Please click the link below to ${action.charAt(0).toLocaleUpperCase() + action.slice(1)}</p>
    <button 
    style="background-color: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px;"><a href="${verificationLink}" style="color: white; text-decoration: none;">
    Verify Email</a></button>
    `,
  });
};
