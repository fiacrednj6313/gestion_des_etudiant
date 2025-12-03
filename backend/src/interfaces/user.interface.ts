export interface IUser extends Document {
  nom: string;
  email: string;
  mot_de_passe: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt?: Date;
  updatedAt?: Date;
}
