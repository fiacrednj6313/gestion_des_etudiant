import type {
  CreateClasse,
  ClasseResponse,
  UpdateClasse,
} from "../dtos/classe.dto";
import classe from "../schema/classe.schema";
import { AppError } from "../utils/AppError";

export const create = async (data: CreateClasse): Promise<ClasseResponse> => {
  const Classe: ClasseResponse = await classe.create(data);
  return Classe;
};

export const getAll = async (): Promise<ClasseResponse[]> => {
  return await classe.find({});
};

export const getClasse = async (id: string): Promise<ClasseResponse> => {
  const Classe: ClasseResponse | null = await classe.findById(id);

  if (!Classe) {
    throw new Error(`Classe ${id} not found`);
  }

  return Classe;
};

export const updatedClasse = async (
  id: string,
  data: UpdateClasse
): Promise<ClasseResponse> => {
  const ClasseUpdated = await classe.findByIdAndUpdate(id, data).exec();

  if (!ClasseUpdated) {
    throw new AppError(`Classe ${id} not found`, 404);
  }

  return ClasseUpdated as ClasseResponse;
};

export const deletedClasse = async (id: string): Promise<ClasseResponse> => {
  const ClasseDeleted = await classe.findByIdAndDelete(id);

  if (!ClasseDeleted) {
    throw new AppError(`Classe ${id} not found`, 404);
  }

  return ClasseDeleted as ClasseResponse;
};
