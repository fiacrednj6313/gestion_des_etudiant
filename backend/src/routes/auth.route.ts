import { Router } from "express";
import * as AuthController from "../controllers/auth.controller";
import validation from "../middlewares/validation.middleware";
import { CreateUser, CreateUserLogin } from "../dtos/user.dto";

export const AuthRouter = Router();

AuthRouter.post(
  "/register",
  validation(CreateUser),
  AuthController.register
).post("/login", validation(CreateUserLogin), AuthController.login);
