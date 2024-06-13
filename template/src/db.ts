import { PrismaClient } from "@prisma/client";

export const db = new PrismaClient().$extends({
  name: "softDelete",
  model: {
    $allModels: {
      async softDelete(this: any, where: any) {
        return this.update({
          where: {
            ...where.where,
          },
          data: {
            deleted_at: new Date(),
          },
        });
      },
    },
  },

  query: {
    $allModels: {
      async $allOperations({ operation, args, query, model }) {
        const methods = ["findUnique", "findUniqueOrThrow", "findFirst", "findFirstOrThrow", "findMany"];

        if (methods.some(e => e == operation)) {
          args.where = { ...args.where, deleted_at: null };
        }

        return query(args);
      },
    },
  },
});

export const resetDb = async () => {
  await db.$transaction([db.user.deleteMany()]);
};
