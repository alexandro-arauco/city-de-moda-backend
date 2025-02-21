import { Router } from "express";
import { validateData } from "../middleware/validationMiddleware";
import { getAll, getById, register, update } from "../handlers/category";
import {
  categorySchema,
  insertCategorySchema,
} from "../schemas/categorySchema";

const router = Router();

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", validateData(insertCategorySchema), register);
router.put("/", validateData(categorySchema), update);

export default router;
