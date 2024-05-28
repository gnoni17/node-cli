import { NextFunction, Request, Response } from "express";
import { ApiResponse, statusCodes } from "../utils/response";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.session.user) {
    const response = new ApiResponse(statusCodes.Unauthorized);
    response.send(res);
  }

  next();
}
