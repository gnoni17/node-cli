import { Response } from "express";

export enum statusCodes {
  Ok = 200,
  Created = 201,
  Accepted = 202,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500,
  ServiceUnavailable = 503,
}

export class ApiResponse<T> {
  statusCode: number;
  message: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    perPage: number;
  };
  errors?: Array<{
    field: string;
    message: string;
  }>;
  data?: T;

  constructor(
    statusCode: number,
    message?: string,
    data?: T,
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      perPage: number;
    },
    errors?: Array<{
      field: string;
      message: string;
    }>
  ) {
    this.statusCode = statusCode;
    this.message = message || statusCodes[this.statusCode].replace(/([a-z])([A-Z])/g, "$1 $2");
    this.data = data;
    this.pagination = pagination;
    this.errors = errors;
  }

  send(res: Response): void {
    res.status(this.statusCode).json(this);
  }
}
