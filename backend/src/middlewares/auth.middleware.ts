import passport from "passport";
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const protect = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: any, user: any, info: any) => {
      // S'il y a une erreur technique interne
      if (err) {
        return next(err);
      }

      // Si pas d'utilisateur trouvé ou token invalide
      if (!user) {
        // Info contient le message d'erreur de passport (ex: "No auth token")
        let message = "Vous n'êtes pas connecté.";
        if (info && info.message) message += ` (${info.message})`;

        return next(new AppError(message, 401));
      }

      // Succès ! On attache l'utilisateur à la requête
      req.user = user;
      next();
    }
  )(req, res, next);
};
