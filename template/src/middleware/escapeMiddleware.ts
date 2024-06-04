import { NextFunction, Request, Response } from "express";

export function escapeStr(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\//g, "&#x2F;")
    .replace(/\\/g, "&#x5C;")
    .replace(/`/g, "&#96;");
}

export const sanitizeMiddleware = (req: Request, res: Response, next: NextFunction) => {
  function sanitize(obj: any) {
    if (typeof obj !== "object" || obj === null || Object.keys(obj).length == 0) throw new Error("Bad request");

    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] !== null && typeof obj[key] === "object") {
          obj[key] = sanitize(obj[key]);
        } else {
          if (typeof obj[key] === "string") {
            obj[key] = escapeStr(obj[key]);
          }
        }
      }
    }

    return obj;
  }

  try {
    if (req.method == "POST") {
      req.body = sanitize(req.body);
    }
    next();
  } catch (error: any) {
    res.json({ error: error.message }).status(400);
  }
};
