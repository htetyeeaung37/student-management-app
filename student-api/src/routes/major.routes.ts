import express from "express";
import {
  getMajors,
  getMajorById,
  createMajor,
  updateMajor,
  deleteMajor,
} from "../controllers/major.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", getMajors);
router.get("/:id", getMajorById);
router.post("/", authenticate, createMajor);
router.put("/:id", authenticate, updateMajor);
router.delete("/:id", authenticate, deleteMajor);

export default router;