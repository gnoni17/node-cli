import { NextFunction, Request, Response } from "express";
import { ApiResponse, statusCodes } from "../utils/response";

// Synchronizer Token pattern
export function csrfMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.csrf;

  if (req.session.csrf == token) {
    next();
  } else {
    const response = new ApiResponse(statusCodes.InternalServerError);
    response.send(res);
  }
}
