export interface EtudiantDto {
  id?: string;
  nom: string;
  prenom: string;
  email: string;
  age?: number;
  classeId: string;
}

export type CreateEtudiantDto = Omit<EtudiantDto, "id">;

export type UpdateEtudiantDto = Partial<EtudiantDto>;
