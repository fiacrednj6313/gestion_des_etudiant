import type { ObjectId } from "mongoose";

export interface IEtudiant extends Document {
  nom: string;
  prenom: string;
  email: string;
  age?: number;
  createdAt?: Date;
  updatedAt?: Date;
  classeId: ObjectId;
}
