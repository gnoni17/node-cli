import { Router } from "express";
import { validateData } from "../middleware/validationMiddleware";
import { userSchema } from "../schemas";
import { signup, signin, deleteUser, get, put } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";
import { Authlimiter } from "../middleware/limiterMiddleware";
import { csrfMiddleware } from "../middleware/csrfMiddleware";

const userRoute = Router();

userRoute.post("/signup", [validateData(userSchema), Authlimiter], signup);
userRoute.post("/signin", [validateData(userSchema), Authlimiter], signin);

userRoute.get("/user", authMiddleware, get);
userRoute.put("/user", [validateData(userSchema), authMiddleware, csrfMiddleware], put);
userRoute.delete("/user", [authMiddleware, csrfMiddleware], deleteUser);

export { userRoute };
