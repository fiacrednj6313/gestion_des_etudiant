import "reflect-metadata";
import express from "express";
import helmet from "helmet";
import cors, { type CorsOptions } from "cors";
import { CREDENTIALS, METHODS, ORIGIN } from "../config/env.config";
import hpp from "hpp";
import compression from "compression";
import { morganMiddleware } from "../config/logger.config";

const app = express();
const corsOptions: CorsOptions = {
  origin: ORIGIN,
  credentials: CREDENTIALS,
  methods: METHODS,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors(corsOptions));
app.use(hpp());
app.use(compression());
app.use(morganMiddleware);

export default app;
