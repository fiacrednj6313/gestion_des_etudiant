import { IsDate, IsOptional, IsString } from "class-validator";

class Classe {
  @IsString()
  nom!: string;

  @IsDate()
  createdAt?: Date;

  @IsDate()
  updatedAt?: Date;
}

// CreateClasse: sans createdAt et updatedAt
export class CreateClasse {
  @IsString()
  nom!: string;
}

// UpdateClasse: tous les champs optionnels
export class UpdateClasse {
  @IsOptional()
  @IsString()
  nom?: string;
}

// ClasseResponse: sans createdAt et updatedAt
export class ClasseResponse {
  @IsString()
  nom!: string;
}
