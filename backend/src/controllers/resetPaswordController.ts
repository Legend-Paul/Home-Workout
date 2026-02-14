// import type { Request, Response } from "express";
// import { prisma } from "../lib/prisma.js";
// import { body, validationResult } from "express-validator";
// import { sendVerificationEmail } from "../utils/sendEmailVerification.js";
// import bcrypt from "bcryptjs";

// const validate = [
//     body("password")
//         .trim()
//         .isLength({ min: 8 })
//         .withMessage("Password must be at least 8 characters long"),
//     body("confirmPassword")
//         .trim()
//         .custom((value, { req }) => value === req.body.password)
//         .withMessage("Passwords do not match"),
// ]

// interface ResetPasswordRequest extends Request {
//     body: {
//         token: string;
//         password: string;
//     };
// }

// const resetPasswordHandler = async (
//     req: ResetPasswordRequest,
//     res: Response,
// ): Promise<void> => {

// };

// const resetPassword = [...validate, resetPasswordHandler];

// export { resetPassword };
