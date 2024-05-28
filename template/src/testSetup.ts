import { resetDb } from "./db";

afterAll(async () => {
  await resetDb();
});
