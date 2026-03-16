import { Request, Response } from "express";
import prisma from "../config/prisma";

// GET /majors
export const getMajors = async (req: Request, res: Response) => {
  try {
    const majors = await prisma.major.findMany({
      include: { students: true },
    });
    res.json(majors);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve majors." });
  }
};

// GET /majors/:id
export const getMajorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const major = await prisma.major.findUnique({
      where: { id: Number(id) },
      include: { students: true },
    });

    if (!major) {
      res.status(404).json({ message: "Major not found." });
      return;
    }

    res.json(major);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve major." });
  }
};

// POST /majors
export const createMajor = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({ message: "Major name is required." });
      return;
    }

    const existing = await prisma.major.findUnique({ where: { name } });
    if (existing) {
      res.status(409).json({ message: "Major name already exists." });
      return;
    }

    const major = await prisma.major.create({
      data: { name, description },
    });

    res.status(201).json(major);
  } catch (error) {
    res.status(500).json({ message: "Failed to create major." });
  }
};

// PUT /majors/:id
export const updateMajor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const existing = await prisma.major.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      res.status(404).json({ message: "Major not found." });
      return;
    }

    const major = await prisma.major.update({
      where: { id: Number(id) },
      data: { name, description },
    });

    res.json(major);
  } catch (error) {
    res.status(500).json({ message: "Failed to update major." });
  }
};

// DELETE /majors/:id
export const deleteMajor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if major exists and has students
    const majorWithStudents = await prisma.major.findUnique({
      where: { id: Number(id) },
      include: { students: true },
    });

    if (!majorWithStudents) {
      res.status(404).json({ message: "Major not found." });
      return;
    }

    if (majorWithStudents.students.length > 0) {
      res.status(400).json({
        message: "Cannot delete major because it has enrolled students.",
      });
      return;
    }

    await prisma.major.delete({ where: { id: Number(id) } });
    res.json({ message: "Major deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete major." });
  }
};