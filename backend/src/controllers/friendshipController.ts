import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { body, validationResult } from "express-validator";

const validate = [
  body("friendId").isUUID().withMessage("Friend id must be a valid uuid"),
];

interface NewFriendRequest extends Request {
  body: {
    friendId: string;
  };
  params: {
    id: string;
  };
}

export const sendNewFriendship = [
  ...validate,
  async (req: NewFriendRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { friendId } = req.body;
    const userId = req.params.id;

    try {
      const [user, friend] = await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
        }),
        prisma.user.findUnique({
          where: { id: friendId },
        }),
      ]);

      if (!user) {
        res.status(400).json({ error: "User not found!" });
        return;
      }

      if (!friend) {
        res.status(400).json({ error: "friend not found!" });
        return;
      }

      await prisma.friendship.create({
        data: {
          friendId,
          userId,
        },
      });
      res.status(201).json({ message: "Friendship sent!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to send friendship" });
    }
  },
];
