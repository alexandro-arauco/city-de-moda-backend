import { Router } from "express";
import {
  getAll,
  getById,
  getPlacesByCategory,
  registerPlace,
} from "../handlers/place";
import {
  validateData,
  validateDataAndFiles,
} from "../middleware/validationMiddleware";
import { insertPlaceSchema } from "../schemas/placeSchema";

const router = Router();

router.get("/", getAll);
router.get("/:id", getById);
router.post(
  "/",
  validateDataAndFiles(insertPlaceSchema, 5 * 1024 * 1024, [
    "image/jpeg",
    "image/png",
    "image/jpg",
  ]),
  registerPlace
);
//router.put("/", update);
//router.post("/upload", uploadImage);

router.get("/category/:categoryId", getPlacesByCategory);

export default router;
