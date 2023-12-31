import express, { NextFunction, Response, Request } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";

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

//routes

app.use("/api/v1", userRouter);
app.use("/api/v1", courseRouter);
app.use("/api/v1", orderRouter);

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
