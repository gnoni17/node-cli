import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { ZodError } from "zod";
import { db } from "../db";
import { ApiResponse, statusCodes } from "../utils/response";
import { userSchema } from "../schemas";

function getsignupError(error: any) {
  if (error instanceof ZodError) {
    return error.errors.map(e => ({ field: e.path.join("."), message: e.message }));
  } else {
    return [{ field: null, message: error.message }];
  }
}

export async function signup(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    userSchema.parse(req.body);
    // check if exist
    const found = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (found) {
      const error = [{ field: "email", message: "Email already used" }];
      return res.render("signup", { error });
    }

    // crypt password
    const salt = await bcrypt.genSalt(10);
    const passwordCrypt = await bcrypt.hash(password, salt);

    // create user
    const user = await db.user.create({
      data: {
        email,
        password: passwordCrypt,
      },
    });

    req.session.user = { ...user, password: undefined };

    res.redirect("/");
  } catch (e) {
    const error = getsignupError(e);
    res.render("signup", { error });
  }
}

export async function signin(req: Request, res: Response) {
  const { email, password }: { email: string; password: string } = req.body;

  try {
    userSchema.parse(req.body);
    // check if exist
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    const isCorrect = await bcrypt.compare(password, user?.password || "");

    if (!isCorrect || user == null) {
      const error = [{ field: null, message: "Password or email is not correct" }];
      return res.render("signin", { error });
    }

    req.session.user = { ...user, password: undefined };

    res.redirect("/");
  } catch (e) {
    const error = getsignupError(e);
    res.render("signin", { error });
  }
}

export async function get(req: Request, res: Response) {
  try {
    const user = await db.user.findUnique({
      where: {
        id: req.session.user?.id,
      },
    });

    if (!user) {
      const response = new ApiResponse(statusCodes.NotFound, "User not found");
      return response.send(res);
    }

    const response = new ApiResponse(statusCodes.Ok, undefined, req.session.user);
    response.send(res);
  } catch (error) {
    const response = new ApiResponse(statusCodes.InternalServerError);
    response.send(res);
  }
}

export async function put(req: Request, res: Response) {
  const { email } = req.body;

  try {
    const user = await db.user.update({
      where: {
        id: req.session.user?.id,
      },

      data: {
        email,
      },
    });

    const response = new ApiResponse(statusCodes.Ok, undefined, { id: user.id, email: user.email });
    response.send(res);
  } catch (error) {
    const response = new ApiResponse(statusCodes.InternalServerError);
    response.send(res);
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    await db.user.softDelete({
      where: {
        id: req.session.user?.id,
      },
    });

    const response = new ApiResponse(statusCodes.Ok, "User deleted");
    response.send(res);
  } catch (error) {
    const response = new ApiResponse(statusCodes.InternalServerError);
    response.send(res);
  }
}
