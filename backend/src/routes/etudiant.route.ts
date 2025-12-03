import { Router } from "express";
import * as EtudiantController from "../controllers/etudiant.controller";
import { CreateEtudiant, UpdateEtudiant } from "../dtos/etudiant.dto";
import validation from "../middlewares/validation.middleware";
import { protect } from "../middlewares/auth.middleware";

export const EtudiantRouter = Router();
EtudiantRouter.use(protect);

/**
 * @swagger
 * tags:
 * name: Etudiants
 * description: API de gestion des étudiants
 */
EtudiantRouter.get("/", EtudiantController.getAllEtudiant)
  .get("/:id", EtudiantController.getEtudiant)
  .post("/", validation(CreateEtudiant), EtudiantController.createEtudiant)
  .put("/:id", validation(UpdateEtudiant), EtudiantController.updateEtudiant)
  .delete("/:id", EtudiantController.deleteEtudiant);
