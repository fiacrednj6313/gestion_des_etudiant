// src/utils/AppError.ts

export class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    // Si code 4xx -> fail, si 5xx -> error
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    // Marque l'erreur comme "opérationnelle" (prévue par nous) vs bug de programmation
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
