import { PrismaClient } from "@prisma/client";

export const db = new PrismaClient();

export const resetDb = async () => {
  await db.$transaction([db.user.deleteMany()]);
};
