import express from "express";
import {
  getStudents,
  getStudentById,
  getStudentsByMajor,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/student.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", getStudents);
router.get("/major/:majorId", getStudentsByMajor);
router.get("/:id", getStudentById);
router.post("/", authenticate, createStudent);
router.put("/:id", authenticate, updateStudent);
router.delete("/:id", authenticate, deleteStudent);

export default router;