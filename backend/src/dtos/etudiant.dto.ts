import {
  IsDate,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from "class-validator";
import type { ObjectId } from "mongoose";

class Etudiant {
  @IsString()
  nom!: string;

  @IsString()
  prenom!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  age?: number;

  @IsDate()
  createdAt?: Date;

  @IsDate()
  updatedAt?: Date;

  @IsString()
  classeId!: ObjectId;
}

// CreateEtudiant: sans createdAt et updatedAt
export class CreateEtudiant {
  @IsString()
  nom!: string;

  @IsString()
  prenom!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  age?: number;

  @IsString()
  classeId!: ObjectId;
}

// UpdateEtudiant: tous les champs optionnels
export class UpdateEtudiant {
  @IsOptional()
  @IsString()
  nom?: string;

  @IsOptional()
  @IsString()
  prenom?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  age?: number;

  @IsOptional()
  @IsString()
  classeId?: ObjectId;
}

// EtudiantResponse: sans createdAt et updatedAt
export class EtudiantResponse {
  @IsString()
  nom!: string;

  @IsString()
  prenom!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  age?: number;

  @IsString()
  classeId!: ObjectId;
}
