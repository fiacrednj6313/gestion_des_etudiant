import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Gestion Étudiants",
      version: "1.0.0",
      description:
        "Documentation de l'API pour la gestion des étudiants et des classes",
      contact: {
        name: "Votre Nom",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Serveur de développement",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  // C'est ici qu'on dit à Swagger où chercher les commentaires @swagger
  // On inclut les routes ET les DTOs/Modèles pour les définitions
  apis: ["./src/routes/*.ts", "./src/schema/*.ts", "./src/dtos/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
