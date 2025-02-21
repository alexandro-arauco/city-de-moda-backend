import { Request, Response } from "express";
import { db } from "../db/db";
import { CategoryPlaceTable, PlaceTable } from "../db/schema";
import { eq } from "drizzle-orm";

export const getAll = async (req: Request, res: Response) => {
  try {
    const places = await db.query.PlaceTable.findMany({
      with: {
        categoryPlaceTable: {
          with: {
            categoryTable: true,
          },
        },
      },
    });

    const response = {
      data: places,
      message: "Places fetched successfully",
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const place = await db.query.PlaceTable.findFirst({
      where: (table, { eq }) => eq(table.id, Number(req.params.id)),
      with: {
        categoryPlaceTable: {
          with: {
            categoryTable: true,
          },
        },
      },
    });

    const response = {
      data: place,
      message: "Place fetched successfully",
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
  }
};

export const getPlacesByCategory = async (req: Request, res: Response) => {
  try {
    const places = await db.query.CategoryPlaceTable.findMany({
      where: (table, { eq }) =>
        eq(table.categoryId, Number(req.params.categoryId)),
      with: {
        placeTable: true,
      },
    });

    const response = {
      data: places,
      message: "Places fetched successfully",
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
  }
};

export const registePlacerWithCategories = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      address,
      lat,
      lng,
      phone,
      country,
      city,
      urlImage,
      categories,
    } = req.body;

    const place = await db
      .insert(PlaceTable)
      .values({
        name,
        address,
        lat,
        lng,
        phone,
        country,
        city,
        urlImage,
      })
      .returning();

    const placeId = place[0].id;

    const categoryPlace = categories.map((categoryId: number) => ({
      categoryId,
      placeId,
    }));

    await db.insert(CategoryPlaceTable).values(categoryPlace);

    const response = {
      data: place,
      message: "Place registered successfully",
    };

    res.status(201).json(response);
  } catch (error) {
    console.error(error);
  }
};
