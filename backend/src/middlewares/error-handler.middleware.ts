// src/middlewares/errorHandler.ts
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { NODE_ENV } from "../config/env.config";

// Gestion spécifique des erreurs courantes
const handleCastErrorDB = (err: any) => {
  const message = `Invalide ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any) => {
  // Extrait la valeur entre guillemets du message d'erreur Mongo
  // Ex: E11000 duplicate key error ... name: "Dupont"
  const value = err.errmsg
    ? err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
    : "Valeur inconnue";
  const message = `Valeur dupliquée : ${value}. Veuillez utiliser une autre valeur.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: any) => {
  // Combine tous les messages d'erreur de validation Mongoose
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Données invalides. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

// Le Middleware
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // ENVIRONNEMENT DE DÉVELOPPEMENT (On veut tout voir)
  if (NODE_ENV === "development") {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // ENVIRONNEMENT DE PRODUCTION (On nettoie les messages)
  else {
    let error = { ...err, message: err.message };

    // 1. Erreur ID invalide (CastError)
    if (err.name === "CastError") error = handleCastErrorDB(err);

    // 2. Erreur Duplication (code 11000)
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);

    // 3. Erreur Validation Mongoose
    if (err.name === "ValidationError") error = handleValidationErrorDB(err);

    // Réponse au client
    if (error.isOperational) {
      // Erreur connue (de notre code)
      res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    } else {
      // Erreur de programmation ou inconnue (ne pas fuiter les détails)
      console.error("ERREUR CRITIQUE 💥", err);
      res.status(500).json({
        status: "error",
        message: "Quelque chose s'est mal passé !",
      });
    }
  }
};
