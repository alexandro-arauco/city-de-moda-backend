import express, { urlencoded, json } from "express";
import cors from "cors";
import categoryRouter from "./routes/category";
import placeRouter from "./routes/place";

const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors());

app.use("/api/category", categoryRouter);
app.use("/api/place", placeRouter);

export default app;
