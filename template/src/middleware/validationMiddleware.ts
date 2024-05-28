import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";
import { ApiResponse, statusCodes } from "../utils/response";

export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          field: issue.path.join("."),
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));

        const response = new ApiResponse(statusCodes.BadRequest, undefined, undefined, undefined, errorMessages);
        response.send(res);
      } else {
        const response = new ApiResponse(statusCodes.InternalServerError);
        response.send(res);
      }
    }
  };
}
