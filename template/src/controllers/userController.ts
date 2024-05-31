import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { db } from "../db";
import { ApiResponse, statusCodes } from "../utils/response";

export const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // check if exist
    const found = await db.user.findFirst({
      where: {
        email,
      },
    });

    if (found) {
      const response = new ApiResponse(statusCodes.BadRequest, "Email already used");
      return response.send(res);
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

    req.session.user = user;

    const response = new ApiResponse(statusCodes.Ok, undefined, { id: user.id, email: user.email });
    response.send(res);
  } catch (error) {
    const response = new ApiResponse(statusCodes.InternalServerError);
    response.send(res);
  }
};

export const signin = async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body;

  try {
    // check if exist
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (user == null) {
      const response = new ApiResponse(statusCodes.NotFound, "User not found");
      return response.send(res);
    }

    // compare password
    const isCorrect = await bcrypt.compare(password, user.password);

    if (!isCorrect) {
      const response = new ApiResponse(statusCodes.BadRequest, "Password is not correct");
      return response.send(res);
    }

    req.session.user = user;

    const response = new ApiResponse(statusCodes.Ok, undefined, { id: user.id, email: user.email });
    response.send(res);
  } catch (error) {
    const response = new ApiResponse(statusCodes.InternalServerError);
    response.send(res);
  }
};

export const get = async (req: Request, res: Response) => {
  const response = new ApiResponse(statusCodes.Ok, undefined, req.session.user);
  response.send(res);
};

export const put = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordCrypt = await bcrypt.hash(password, salt);

    const user = await db.user.update({
      where: {
        id: req.session.user?.id,
      },

      data: {
        email,
        password: passwordCrypt,
      },
    });

    const response = new ApiResponse(statusCodes.Ok, undefined, { id: user.id, email: user.email });
    response.send(res);
  } catch (error) {
    const response = new ApiResponse(statusCodes.InternalServerError);
    response.send(res);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await db.user.delete({
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
};
