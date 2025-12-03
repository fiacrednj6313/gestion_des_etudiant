import api from "../../../common/config/axios.config";
import type { ClasseDto } from "../dtos/classe.dto";

export const getAllClasses = async (): Promise<readonly ClasseDto[]> => {
  const response = await api.get<Readonly<ClasseDto[]>>("/api/classes");

  return response.data;
};

export const getOneClasse = async (id: string): Promise<ClasseDto> => {
  const response = await api.get<Readonly<ClasseDto>>(`/api/classes/${id}`);

  return response.data;
};

export const createClasse = async (data: ClasseDto): Promise<ClasseDto> => {
  const response = await api.post<ClasseDto>("/api/classes", data);

  return response.data;
};

export const updateClasse = async (
  id: string,
  data: ClasseDto
): Promise<ClasseDto> => {
  const response = await api.put(`/api/classes/${id}`, data);

  return response.data;
};

export const deleteClasse = async (id: string): Promise<ClasseDto> => {
  const response = await api.delete(`/api/classes/${id}`);

  return response.data;
};
