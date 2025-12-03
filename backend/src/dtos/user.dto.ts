import { IsDate, IsString, IsOptional, IsEmail } from "class-validator";

class User {
  @IsString()
  nom!: string;

  @IsEmail()
  email!: string;

  @IsString()
  mot_de_passe!: string;

  @IsDate()
  createdAt?: Date;

  @IsDate()
  updatedAt?: Date;
}

// CreateUser: tous les champs sauf createdAt et updatedAt
export class CreateUser {
  @IsString()
  nom!: string;

  @IsEmail()
  email!: string;

  @IsString()
  mot_de_passe!: string;
}

// CreateUserLogin: tous les champs optionnels
export class CreateUserLogin {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  mot_de_passe?: string;
}

// UpdateUser: tous les champs optionnels
export class UpdateUser {
  @IsOptional()
  @IsString()
  nom?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  mot_de_passe?: string;
}

// UserResponse: sans createdAt, updatedAt et mot_de_passe
export class UserResponse {
  @IsString()
  nom!: string;

  @IsEmail()
  email!: string;
}

export class ResponseToken {
  accessToken!: string;
}
