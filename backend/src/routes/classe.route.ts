import { Router } from "express";
import * as ClasseController from "../controllers/classe.controller";
import validation from "../middlewares/validation.middleware";
import { CreateClasse, UpdateClasse } from "../dtos/classe.dto";
import { protect } from "../middlewares/auth.middleware";

export const ClasseRouter = Router();
ClasseRouter.use(protect);

ClasseRouter.get("/", ClasseController.getAllClasse)
  .get("/:id", ClasseController.getClasse)
  .post("/", validation(CreateClasse), ClasseController.createClasse)
  .put("/:id", validation(UpdateClasse), ClasseController.updateClasse)
  .delete("/:id", ClasseController.deleteClasse);
