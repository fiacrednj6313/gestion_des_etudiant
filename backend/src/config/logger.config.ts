import winston from "winston";
import morgan, { type StreamOptions } from "morgan";
import express from "express";
import { NODE_ENV } from "./env.config";

// Détermine le niveau de log en fonction de l'environnement
const level = NODE_ENV === "production" ? "warn" : "debug";

/**
 * Définit un format de log personnalisé pour la console.
 * Inclut le timestamp, le niveau (colorisé), et le message.
 */
const consoleFormat = winston.format.printf(({ timestamp, level, message }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

/**
 * Configure les "transports" (les sorties) pour Winston.
 * Nous allons logger différemment en dev et en prod.
 */
const transports: winston.transport[] = [
  // Toujours logger sur la console
  new winston.transports.Console({
    level: level, // Log 'debug' et plus en dev, 'warn' et plus en prod
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.timestamp({ format: "HH:mm:ss" }),
      winston.format.colorize({ all: true }), // Colorise la sortie console
      consoleFormat
    ),
  }),
];

// En production, on ajoute des transports de fichiers
if (NODE_ENV === "production") {
  transports.push(
    // Un fichier pour les logs d'erreur
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json() // Format JSON pour les fichiers
      ),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Un fichier pour tous les autres logs (niveau 'info')
    new winston.transports.File({
      filename: "logs/combined.log",
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
}

/**
 * Crée l'instance principale du logger Winston
 */
export const logger = winston.createLogger({
  level: level, // Niveau de log global
  levels: winston.config.npm.levels, // Niveaux standards (error, warn, info, ...)
  transports: transports,
  exitOnError: false, // Ne pas quitter l'application sur une exception non gérée
});

/**
 * Crée un objet "stream" compatible avec Morgan,
 * qui redirige la sortie de Morgan vers le logger Winston.
 * On utilise le niveau 'http' de Winston pour ces logs.
 */
const stream: StreamOptions = {
  write: (message) => {
    // Morgan ajoute un '\n' à la fin, on le retire avec trim()
    logger.http(message.trim());
  },
};

/**
 * Crée le middleware Morgan.
 * On utilise le format 'combined' en production et 'dev' en développement.
 * Le stream est redirigé vers Winston.
 */
const morganFormat = NODE_ENV === "production" ? "combined" : "dev";

export const morganMiddleware: express.Handler = morgan(morganFormat, {
  stream: stream,
});
