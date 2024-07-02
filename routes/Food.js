import express from "express";
import { addProducts, getFoodById, getFoodItems, insertData } from "../controllers/Food.js";

const router = express.Router();

router.post("/add", addProducts);
router.get("/", getFoodItems);
router.get("/insertdata",insertData);
router.get("/:id", getFoodById);


export default router;
