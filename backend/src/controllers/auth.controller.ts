import * as AuthService from "../services/auth.service";
import type { Request, Response } from "express";

export const register = async (req: Request, res: Response) => {
  try {
    const listClasse = await AuthService.register(req.body);
    res.status(200).json(listClasse);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const listClasse = await AuthService.login(req.body);
    res.status(200).json(listClasse);
  } catch (error) {
    res.status(500).json({ error });
  }
};
