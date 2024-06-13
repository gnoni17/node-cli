import { Router } from "express";
import { authMiddleware, Authlimiter, validateData } from "../middleware";
import { userSchema } from "../schemas";
import { signup, signin, deleteUser, get, put } from "../controllers/userController";

const userRoute = Router();

userRoute.post("/signup", Authlimiter, signup);
userRoute.post("/signin", Authlimiter, signin);

userRoute.get("/user", authMiddleware, get);
userRoute.put("/user", [validateData(userSchema), authMiddleware], put);
userRoute.delete("/user", [authMiddleware], deleteUser);

export { userRoute };
