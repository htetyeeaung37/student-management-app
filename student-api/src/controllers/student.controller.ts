import { Request, Response } from "express";
import prisma from "../config/prisma";

// GET /students
export const getStudents = async (req: Request, res: Response) => {
  try {
    const students = await prisma.student.findMany({
      include: { major: true },
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve students." });
  }
};

// GET /students/:id
export const getStudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const student = await prisma.student.findUnique({
      where: { id: Number(id) },
      include: { major: true },
    });

    if (!student) {
      res.status(404).json({ message: "Student not found." });
      return;
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve student." });
  }
};

// GET /students/major/:majorId
export const getStudentsByMajor = async (req: Request, res: Response) => {
  try {
    const { majorId } = req.params;
    const students = await prisma.student.findMany({
      where: { majorId: Number(majorId) },
      include: { major: true },
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve students by major." });
  }
};

// POST /students
export const createStudent = async (req: Request, res: Response) => {
  try {
    const {
      studentId,
      name,
      age,
      township,
      gender,
      email,
      phone,
      academicYear,
      majorId,
    } = req.body;

    // Check required fields
    if (!studentId || !name || !email || !majorId || !gender || !township) {
      res.status(400).json({ message: "Required fields are missing." });
      return;
    }

    // Check duplicate email
    const existingEmail = await prisma.student.findUnique({ where: { email } });
    if (existingEmail) {
      res.status(409).json({ message: "Email already exists." });
      return;
    }

    // Check duplicate studentId
    const existingStudentId = await prisma.student.findUnique({ where: { studentId } });
    if (existingStudentId) {
      res.status(409).json({ message: "Student ID already exists." });
      return;
    }

    const student = await prisma.student.create({
      data: {
        studentId,
        name,
        age,
        township,
        gender,
        email,
        phone,
        academicYear,
        majorId,
      },
      include: { major: true },
    });

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: "Failed to create student." });
  }
};

// PUT /students/:id
export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      studentId,
      name,
      age,
      township,
      gender,
      email,
      phone,
      academicYear,
      majorId,
    } = req.body;

    const existing = await prisma.student.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      res.status(404).json({ message: "Student not found." });
      return;
    }

    const student = await prisma.student.update({
      where: { id: Number(id) },
      data: {
        studentId,
        name,
        age,
        township,
        gender,
        email,
        phone,
        academicYear,
        majorId,
      },
      include: { major: true },
    });

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Failed to update student." });
  }
};

// DELETE /students/:id
export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.student.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      res.status(404).json({ message: "Student not found." });
      return;
    }

    await prisma.student.delete({ where: { id: Number(id) } });
    res.json({ message: "Student deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete student." });
  }
};