import type {
  CreateEtudiant,
  EtudiantResponse,
  UpdateEtudiant,
} from "../dtos/etudiant.dto";
import Etudiant from "../schema/etudiant.schema";
import { AppError } from "../utils/AppError";

export const create = async (
  data: CreateEtudiant
): Promise<EtudiantResponse> => {
  const etudiant: EtudiantResponse = await Etudiant.create(data);
  return etudiant;
};

export const getAll = async (): Promise<EtudiantResponse[]> => {
  return await Etudiant.find({});
};

export const getEtudiant = async (id: string): Promise<EtudiantResponse> => {
  const etudiant: EtudiantResponse | null = await Etudiant.findById(id);

  if (!etudiant) {
    throw new AppError(`Etudiant ${id} not found`, 404);
  }

  return etudiant;
};

export const updatedEtudiant = async (
  id: string,
  data: UpdateEtudiant
): Promise<EtudiantResponse> => {
  const etudiantUpdated = await Etudiant.findByIdAndUpdate(id, data).exec();

  if (!etudiantUpdated) {
    throw new Error(`Etudiant ${id} not found`);
  }

  return etudiantUpdated as EtudiantResponse;
};

export const deletedEtudiant = async (
  id: string
): Promise<EtudiantResponse> => {
  const etudiantDeleted = await Etudiant.findByIdAndDelete(id);

  if (!etudiantDeleted) {
    throw new AppError(`Classe ${id} not found`, 404);
  }

  return etudiantDeleted as EtudiantResponse;
};
