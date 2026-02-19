import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../utils/sendEmailVerification.js";

interface VerifyEmailRequest extends Request {
  query: {
    token: string;
  };
}

export const verifyVerificationEmail = async (
  req: VerifyEmailRequest,
  res: Response,
): Promise<void> => {
  const { token } = req.query;
  console.log("Received token:", token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken || verificationToken.expiresAt < new Date()) {
      res.status(400).json({ error: "Invalid or expired token" });
      return;
    }

    Promise.all([
      await prisma.user.update({
        where: { id: decoded.userId },
        data: { isVerified: true },
      }),
      await prisma.verificationToken.deleteMany({
        where: { userId: decoded.userId },
      }),
    ]);

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Invalid or expired token" });
  }
};

export async function resendVerificationEmail(
  req: VerifyEmailRequest,
  res: Response,
): Promise<void> {
  const { token } = req.query;
  try {
    console.log("Received token for resending verification email:", token);
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
      include: {
        user: true,
      },
    });
    console.log(verificationToken);
    if (!verificationToken) {
      res.status(400).json({ error: "Invalid token" });
      return;
    }

    try {
      Promise.all([
        await sendVerificationEmail({
          userId: verificationToken.userId,
          email: verificationToken.user.email,
          heading: "Verify Your Email",
          action: "verify your email",
        }),
      ]);
      res.status(201).json({
        message: "Email verification sent to your email.",
      });
    } catch (error) {
      console.error("Error sending verification email:", error);
      res.status(500).json({ error: "Failed to send token to your email" });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Invalid or expired token" });
  }
}
