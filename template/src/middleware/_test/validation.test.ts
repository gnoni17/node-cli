import { z, ZodError } from "zod";

describe("test validation middleware", () => {
  const obj = z.object({
    name: z.string(),
    password: z.string(),
  });

  function validate(user: any) {
    try {
      obj.parse(user);

      return 200;
    } catch (error) {
      if (error instanceof ZodError) {
        return 403;
      } else {
        return 500;
      }
    }
  }

  it("validation error", () => {
    expect(
      validate({
        name: "test",
        password: 0,
      })
    ).toEqual(403);
  });

  it("validation done", () => {
    expect(
      validate({
        name: "test",
        password: "test",
      })
    ).toEqual(200);
  });
});
