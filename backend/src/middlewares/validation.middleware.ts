import type { Request, Response, NextFunction, RequestHandler } from "express";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";

// "T" est un type générique qui représente n'importe quelle classe DTO
function validation<T extends object>(
  type: new () => T,
  skipMissingProperties = false
): RequestHandler {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // 1. Transformation : JSON -> Instance de Classe
    const dtoObj = plainToInstance(type, req.body);

    // 2. Validation
    const errors: ValidationError[] = await validate(dtoObj, {
      skipMissingProperties,
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    // 3. Gestion des erreurs
    if (errors.length > 0) {
      // On formatte les erreurs pour qu'elles soient lisibles par le client
      const formattedErrors = errors.map((error: ValidationError) => {
        return {
          field: error.property,
          errors: error.constraints
            ? Object.values(error.constraints)
            : ["Erreur inconnue"],
        };
      });

      res.status(400).json({
        message: "Échec de la validation",
        details: formattedErrors,
      });
      return;
    }

    // 4. Succès : On met à jour req.body avec l'objet typé et nettoyé
    req.body = dtoObj;
    next();
  };
}

export default validation;
