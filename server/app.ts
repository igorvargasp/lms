import express, { NextFunction, Response, Request } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { ErrorMiddleware } from "./middleware/error";

export const app = express();
dotenv.config();

// body parser
app.use(express.json({ limit: "50mb" }));

// cookie parser

app.use(cookieParser());

// cors
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

// testing api

app.get("/test", (_req: Request, res: Response, _next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

// unkown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

app.use(ErrorMiddleware);
