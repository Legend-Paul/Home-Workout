import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import jwt from "jsonwebtoken";

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
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken || verificationToken.expiresAt < new Date()) {
      res.status(400).json({ message: "Invalid or expired token" });
      return;
    }

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { isVerified: true },
    });

    await prisma.verificationToken.deleteMany({
      where: { userId: decoded.userId },
    });

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};
