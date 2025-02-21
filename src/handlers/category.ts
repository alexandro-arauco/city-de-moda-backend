import { Request, Response } from "express";
import { db } from "../db/db";
import { CategoryTable } from "../db/schema";
import { eq } from "drizzle-orm";

export const getAll = async (req: Request, res: Response) => {
  try {
    const categories = await db.select().from(CategoryTable);
    const response = {
      data: categories,
      message: "Categories fetched successfully",
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const category = await db
      .select()
      .from(CategoryTable)
      .where(eq(CategoryTable.id, Number(req.params.id)));

    const response = {
      data: category,
      message: "Category fetched successfully",
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const category = await db.insert(CategoryTable).values(data).returning();

    const response = {
      data: category,
      message: "Category created successfully",
    };

    res.status(201).json(response);
  } catch (error) {
    console.error(error);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const category = await db
      .update(CategoryTable)
      .set(data)
      .where(eq(CategoryTable.id, data.id))
      .returning();

    const response = {
      data: category,
      message: "Category updated successfully",
    };

    res.status(200).json(response);
  } catch (error) {}
};
