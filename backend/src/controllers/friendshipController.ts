import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { body, validationResult } from "express-validator";

const validate = [
  body("friendId").isUUID().withMessage("Friend id must be a valid uuid"),
];

interface FriendshipRequest extends Request {
  body: {
    friendId: string;
  };
  params: {
    id: string;
  };
}

export const sendNewFriendship = [
  ...validate,
  async (req: FriendshipRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { friendId } = req.body;
    const userId = req.params.id;

    try {
      const [user, friend, friendshipExist] = await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
        }),
        prisma.user.findUnique({
          where: { id: friendId },
        }),
        prisma.friendship.findUnique({
          where: {
            userId_friendId: {
              userId,
              friendId,
            },
          },
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

      if (friendshipExist) {
        res.status(400).json({ error: "Frieship exist!" });
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

export const acceptNewFriendship = [
  ...validate,
  async (req: FriendshipRequest, res: Response): Promise<void> => {
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

      await prisma.friendship.update({
        where: {
          userId_friendId: {
            userId: friendId,
            friendId: userId,
          },
        },
        data: {
          status: "ACCEPTED",
        },
      });
      res.status(201).json({ message: "Friendship accepted!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to send friendship" });
    }
  },
];

export const getFriends = async (
  req: FriendshipRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const friends = await prisma.friendship.findMany({
      where: {
        OR: [{ userId: id }, { friendId: id }],
      },
      include: {
        user: {
          include: {
            calendarEntries: true,
          },
        },
      },
    });
    res.status(200).json(friends);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to get friends" });
  }
};

export const deleteFriendship = [
  ...validate,
  async (req: FriendshipRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { friendId } = req.body;
    const userId = req.params.id;

    try {
      const friendshipExist = await prisma.friendship.findUnique({
        where: {
          userId_friendId: {
            userId,
            friendId,
          },
        },
      });

      if (friendshipExist) {
        res.status(400).json({ error: "Frieship exist!" });
        return;
      }

      await Promise.all([
        prisma.friendship.delete({
          where: {
            userId_friendId: {
              userId,
              friendId,
            },
          },
        }),
        prisma.friendship.delete({
          where: {
            userId_friendId: {
              userId: friendId,
              friendId: userId,
            },
          },
        }),
      ]);
      res.status(201).json({ message: "Friendship deleted!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to delete friendship" });
    }
  },
];
