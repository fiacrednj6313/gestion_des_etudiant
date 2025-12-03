import { Schema, model } from "mongoose";
import type { IEtudiant } from "../interfaces/etudiant.interface";

const etudiantSchema = new Schema<IEtudiant>(
  {
    nom: {
      type: String,
      required: [true, "Le nom de famille est requis."],
      trim: true,
    },
    prenom: {
      type: String,
      required: [true, "Le prénom est requis."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "L'email est requis."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "L'email n'est pas valide."],
    },
    age: {
      type: Number,
      required: false,
      min: [17, "L'étudiant doit avoir au moins 17 ans."],
    },
    classeId: {
      type: Schema.ObjectId,
      ref: "Classes",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Etudiant = model<IEtudiant>("Etudiant", etudiantSchema);

export default Etudiant;
