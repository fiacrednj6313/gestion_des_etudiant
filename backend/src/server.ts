import app from "./app";
import { PORT } from "./config/env.config";
import { logger } from "./config/logger.config";
import connectDB from "./config/database.config";
import { EtudiantRouter } from "./routes/etudiant.route";
import { ClasseRouter } from "./routes/classe.route";
import type { NextFunction, Request, Response } from "express";
import { AppError } from "./utils/AppError";
import { globalErrorHandler } from "./middlewares/error-handler.middleware";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.config";
import passport from "passport";
import { jwtStrategy } from "./config/passport.config";
import { AuthRouter } from "./routes/auth.route";

try {
  // Connexion a la base de données mongoDB
  connectDB();

  // Initialisation de passport et strategie JWT
  app.use(passport.initialize());
  passport.use(jwtStrategy);

  // ROUTE SWAGGER
  // L'interface sera accessible sur http://localhost:5000/api-docs
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  logger.info(`Docs api in http://localhost:${PORT}/api-docs`);

  // Route pour les etudiants
  app.use("/api/auth/", AuthRouter);
  app.use("/api/etudiants", EtudiantRouter);
  app.use("/api/classes", ClasseRouter);

  // Gestion des routes introuvables (404)
  app.use((req: Request, res: Response, next: NextFunction) => {
    // On crée une erreur et on la passe à next()
    next(new AppError(`Route ${req.originalUrl} not found`, 404));
  });

  app.use(globalErrorHandler);

  // Initialisation du server
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
} catch (error) {
  logger.error("(500) Internal server error\n", error);
}
