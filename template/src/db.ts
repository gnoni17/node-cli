import { PrismaClient } from "@prisma/client";

export const db = new PrismaClient();

export const resetDb = async () => {
  await db.$transaction([db.user.deleteMany()]);
};

export function extend() {
  db.$extends({
    name: "softDelete",
    model: {
      $allModels: {
        async softDelete(this: any, where: any) {
          return this.update({
            where,
            data: {
              deleted_at: new Date(),
            },
          });
        },
      },
    },

    query: {
      $allModels: {
        async $allOperations({ operation, args, query }) {
          const methods = ["findUnique", "findUniqueOrThrow", "findFirst", "findFirstOrThrow", "findMany"];

          if (methods.some(e => e == operation)) {
            args.where = { ...args.where, deleted_at: new Date() };
          }

          return query(args);
        },
      },
    },
  });
}
