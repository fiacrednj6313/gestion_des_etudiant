import type { Request, Response } from "express";
import * as ClasseService from "../services/classe.service";
import { CreateClasse } from "../dtos/classe.dto";

export const getAllClasse = async (req: Request, res: Response) => {
  try {
    const listClasse = await ClasseService.getAll();
    res.status(200).json(listClasse);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getClasse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const classe = await ClasseService.getClasse(id as string);
    res.status(200).json(classe);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const createClasse = async (req: Request, res: Response) => {
  try {
    const data: CreateClasse = req.body;

    const classe = await ClasseService.create(data);
    res.status(200).json(classe);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const updateClasse = async (req: Request, res: Response) => {
  try {
    const data: CreateClasse = req.body;
    const { id } = req.params;

    const classe = await ClasseService.updatedClasse(id as string, data);
    res.status(200).json(classe);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const deleteClasse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const classe = await ClasseService.deletedClasse(id as string);
    res.status(200).json(classe);
  } catch (error) {
    res.status(500).json({ error });
  }
};
