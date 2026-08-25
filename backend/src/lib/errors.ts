import type { ErrorRequestHandler } from "express";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

export const badRequest = (message: string) => new ApiError(400, "VALIDATION_ERROR", message);
export const notFound = (message: string) => new ApiError(404, "NOT_FOUND", message);
export const conflict = (message: string) => new ApiError(409, "CONFLICT", message);

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ApiError) {
    response.status(error.status).json({ code: error.code, message: error.message });
    return;
  }

  if (error instanceof SyntaxError && "body" in error) {
    response.status(400).json({ code: "VALIDATION_ERROR", message: "Тело запроса содержит некорректный JSON." });
    return;
  }

  console.error(error);
  response.status(500).json({ code: "INTERNAL_ERROR", message: "Внутренняя ошибка сервера." });
};
