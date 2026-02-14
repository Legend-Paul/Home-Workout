import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { body, validationResult } from "express-validator";
import { sendVerificationEmail } from "../utils/sendEmailVerification.js";

const validate = [
  body("email").trim().isEmail().withMessage("Invalid email format"),
];

interface ForgotPasswordRequest extends Request {
  body: {
    email: string;
  };
}

const updatePasswordHandler = async (
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

    await sendVerificationEmail(
      user.id,
      user.email,
      "forgot-password",
      "Reset Your Password",
      "reset your password",
    );
    res.status(200).json({ message: "Verification email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
const updatePassword = [...validate, updatePasswordHandler];

export { updatePassword };
