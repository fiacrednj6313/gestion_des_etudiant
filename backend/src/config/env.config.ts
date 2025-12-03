import "dotenv/config";

export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || "development";

export const ORIGIN = process.env.ORIGIN || "*";
export const CREDENTIALS = process.env.CREDENTIALS === "true";
export const METHODS = process.env.METHODS || "*";

export const DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://localhost:27017/gestion_etudiant";

export const JWT_SECRETS =
  process.env.JJWT_SECRETS || "fsi8080842902@#3%SsS#Q#@DS@f";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";
