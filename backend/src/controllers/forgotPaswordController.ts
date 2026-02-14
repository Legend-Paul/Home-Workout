import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { body, validationResult } from "express-validator";
import { sendPasswordResetEmail } from "../utils/passwordReset.js";

const validate = [
  body("email").trim().isEmail().withMessage("Invalid email format"),
];

interface ForgotPasswordRequest extends Request {
  body: {
    email: string;
  };
}

const sendEmailConfirmationHandler = async (
  req: ForgotPasswordRequest,
  res: Response,
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    if (!user.isVerified) {
      res.status(400).json({ message: "Email not verified" });
      return;
    }

    try {
      await sendPasswordResetEmail(user.id, user.email);
      res.json({ message: "Password reset email sent successfully" });
    } catch (error) {
      console.error("Error sending password reset email:", error);
      res.status(500).json({ message: "Failed to send password reset email" });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
const sendEmailConfirmation = [...validate, sendEmailConfirmationHandler];

export { sendEmailConfirmation };
