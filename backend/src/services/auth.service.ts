import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { AppError } from "../utils/AppError";
import type {
  CreateUser,
  CreateUserLogin,
  ResponseToken,
  UserResponse,
} from "../dtos/user.dto";
import User from "../schema/user.schema";
import { JWT_EXPIRES_IN, JWT_SECRETS } from "../config/env.config";

interface PayloadType {
  id: string;
  nom: string;
  email: string;
}

// Fonction utilitaire pour signer un token
const signToken = (payload: PayloadType): string => {
  // On force le type 'Secret' pour le secret
  const secret = JWT_SECRETS as Secret;

  // On définit les options proprement
  const signInOptions: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as any, // Cast explicite en string (ex: "1d")
  };

  return jwt.sign({ ...payload }, secret, signInOptions);
};

export const register = async (data: CreateUser): Promise<UserResponse> => {
  const newUser: UserResponse = await User.create({ ...data });
  return newUser;
};

export const login = async (data: CreateUserLogin): Promise<ResponseToken> => {
  const { email, mot_de_passe } = data;

  if (!email || !mot_de_passe) {
    throw new AppError("Veuillez fournir un email et un mot de passe", 400);
  }

  // Important: Ajouter select("+mot_de_passe") pour récupérer le mot de passe
  const user = await User.findOne({ email }).select("+mot_de_passe");

  if (!user) {
    throw new AppError("Email ou mot de passe incorrect", 401);
  }

  // Vérifier le mot de passe
  const isPasswordCorrect = await user.comparePassword(mot_de_passe);

  if (!isPasswordCorrect) {
    throw new AppError("Email ou mot de passe incorrect", 401);
  }

  const payload: PayloadType = {
    id: user.id,
    nom: user.nom,
    email: user.email,
  };

  const token: ResponseToken = { accessToken: signToken(payload) };

  return token;
};
