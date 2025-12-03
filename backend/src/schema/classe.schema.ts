import { Schema, model } from "mongoose";
import type { IClasse } from "../interfaces/classe.interface";

const classeSchema = new Schema<IClasse>(
  {
    nom: {
      type: String,
      required: [true, "Le nom de la classe est requis."],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Classe = model<IClasse>("Classe", classeSchema);

export default Classe;
