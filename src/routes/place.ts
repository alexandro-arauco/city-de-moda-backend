import { Router } from "express";
import { getAll, getById, getPlacesByCategory } from "../handlers/place";

const router = Router();

router.get("/", getAll);
router.get("/:id", getById);
/* router.post("/", register); 
router.put("/", update); */

router.get("/category/:categoryId/", getPlacesByCategory);

export default router;