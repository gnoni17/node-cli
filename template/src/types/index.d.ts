import session from "express-session";
import { User } from "@prisma/client";

declare module "express-session" {
  interface SessionData {
    user?: Partial<User>;
  }
}

export = session;