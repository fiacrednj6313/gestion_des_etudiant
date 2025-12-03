import type { Request, Response } from "express";
import * as EtudiantService from "../services/etudiant.service";
import { CreateEtudiant } from "../dtos/etudiant.dto";

export const getAllEtudiant = async (req: Request, res: Response) => {
  try {
    const listEtudiant = await EtudiantService.getAll();
    res.status(200).json(listEtudiant);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getEtudiant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const etudiant = await EtudiantService.getEtudiant(id as string);
    res.status(200).json(etudiant);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const createEtudiant = async (req: Request, res: Response) => {
  try {
    const data: CreateEtudiant = req.body;

    const etudiant = await EtudiantService.create(data);
    res.status(200).json(etudiant);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const updateEtudiant = async (req: Request, res: Response) => {
  try {
    const data: CreateEtudiant = req.body;
    const { id } = req.params;

    const etudiant = await EtudiantService.updatedEtudiant(id as string, data);
    res.status(200).json(etudiant);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const deleteEtudiant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const etudiant = await EtudiantService.deletedEtudiant(id as string);
    res.status(200).json(etudiant);
  } catch (error) {
    res.status(500).json({ error });
  }
};
