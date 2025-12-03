export interface User {
  id?: string;
  nom?: string;
  email: string;
  mot_de_passe?: string;
}

export interface AccessTokenType {
  accessToken: string;
}

export interface PayloadType {
  id: string;
  nom: string;
  email: string;
  exp: number;
}

export type CreateUserDto = User;
export type ResponseUserDto = Omit<User, "mot_de_passe">;
export type UpdateUserDto = Partial<User>;
