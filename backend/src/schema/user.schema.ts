import { Schema, model } from "mongoose";
import type { IUser } from "../interfaces/user.interface";
import bcrypt from "bcryptjs";

const userSchema = new Schema<IUser>(
  {
    nom: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    mot_de_passe: {
      type: String,
      required: true,
      select: false, // SUPER IMPORTANT : Le mot de passe n'est jamais renvoyé par défaut dans les requêtes
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  // Si le mot de passe n'a pas été modifié (ex: on update juste l'email), on ne re-hache pas
  if (!this.isModified("mot_de_passe")) return next();

  // Hachage avec un "cost" de 12 (standard actuel)
  this.mot_de_passe = await bcrypt.hash(this.mot_de_passe, 12);
  next();
});

// 🔑 Méthode : Vérifier le mot de passe
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.mot_de_passe);
};

const User = model<IUser>("User", userSchema);

export default User;
