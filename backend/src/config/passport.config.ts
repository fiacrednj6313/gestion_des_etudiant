import {
  Strategy as JwtStrategy,
  ExtractJwt,
  type StrategyOptions,
} from "passport-jwt";
import User from "../schema/user.schema";
import { JWT_SECRETS } from "./env.config";

const options: StrategyOptions = {
  // On dit à Passport de chercher le token dans le Header "Authorization: Bearer <token>"
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  // On lui donne la clé secrète pour vérifier la signature
  secretOrKey: JWT_SECRETS as string,
};

export const jwtStrategy = new JwtStrategy(options, async (payload, done) => {
  try {
    // Le payload contient ce qu'on a mis dans le token (ex: l'ID de l'user)
    const user = await User.findById(payload.id);

    if (user) {
      // Si l'utilisateur existe, on le passe à la requête (req.user)
      return done(null, user);
    }

    // Sinon, c'est un échec (token valide mais utilisateur supprimé par exemple)
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
});
