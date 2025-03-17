import express, { urlencoded, json } from "express";
import cors from "cors";
import categoryRouter from "./routes/category";
import placeRouter from "./routes/place";
import fileUpload from "express-fileupload";

const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors());

app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));

app.use("/api/category", categoryRouter);
app.use("/api/place", placeRouter);

export default app;
