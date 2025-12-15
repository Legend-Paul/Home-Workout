import { Strategy, ExtractJwt } from "passport-jwt";
import { prisma } from "./prisma.js";

interface JwtPayload {
  id: string;
  iat?: number;
  exp?: number;
  //   [key: string]: any;
}

import type { PassportStatic } from "passport";

import "dotenv/config";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string,
};

export const jwtStrategy = new Strategy(
  opts,
  async (jwt_payload: JwtPayload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: jwt_payload.id },
        omit: {
          password: true,
        },
      });

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  }
);

const passportConfig = (passport: PassportStatic) => {
  passport.use(jwtStrategy);
};

export default passportConfig;
