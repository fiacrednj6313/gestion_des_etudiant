import api from "../../../common/config/axios.config";
import type {
  CreateEtudiantDto,
  EtudiantDto,
  UpdateEtudiantDto,
} from "../dtos/etudiant.dto";

export const getAllEtudiant = async (): Promise<readonly EtudiantDto[]> => {
  const response = await api.get<Readonly<EtudiantDto[]>>("/api/etudiants");

  return response.data;
};

export const getEtudiant = async (id: string): Promise<EtudiantDto> => {
  const response = await api.get<EtudiantDto>(`/api/etudiant/${id}`);

  return response.data;
};

export const createEtudiant = async (
  data: CreateEtudiantDto
): Promise<EtudiantDto> => {
  const response = await api.post<EtudiantDto>(`/api/etudiant`, data);

  return response.data;
};

export const updateEtudiant = async (
  id: string,
  data: UpdateEtudiantDto
): Promise<EtudiantDto> => {
  const response = await api.put<EtudiantDto>(`/api/etudiant/${id}`, data);

  return response.data;
};

export const deleteEtudiant = async (id: string): Promise<EtudiantDto> => {
  const response = await api.delete<EtudiantDto>(`/api/etudiant/${id}`);

  return response.data;
};
