import mongoose from "mongoose";
import { DATABASE_URL } from "./env.config";

const connectDB = async () => {
  try {
    await mongoose.connect(DATABASE_URL);

    console.log("Connexion à MongoDB réussie !");
  } catch (error) {
    console.error("Erreur de connexion à MongoDB :", error);
    process.exit(1);
  }
};

export default connectDB;
