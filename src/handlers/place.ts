import { v2 as cloudinary } from "cloudinary";
import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { db } from "../db/db";
import {
  CategoryPlaceTable,
  PlaceSchedulesTable,
  PlaceTable,
} from "../db/schema";
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

export const registerPlace = async (req: Request, res: Response) => {
  console.log({ body: req.body, files: req.files });
  try {
    const {
      name,
      address,
      lat,
      lng,
      phone,
      country,
      city,
      categories,
      schedule,
    } = req.body;

    const urlImage = "";

    await db.transaction(async (tx) => {
      const place = await tx
        .insert(PlaceTable)
        .values({
          name,
          address,
          lat,
          lng,
          phone,
          country,
          urlImage,
          city,
        })
        .returning();

      const placeId = place[0].id;

      const categoryPlace = categories.map((category: any) => ({
        categoryId: category.value,
        placeId,
      }));

      const placeSchedules = schedule.map((item: any) => ({
        placeId,
        ...item,
      }));

      await tx.insert(CategoryPlaceTable).values(categoryPlace);
      await tx.insert(PlaceSchedulesTable).values(placeSchedules);

      const response = {
        data: place,
        message: "Place registered successfully",
      };

      res.status(201).json(response);
    });
  } catch (error) {
    console.error(error);
  }
};

export const uploadImage = async (req: Request, res: Response) => {
  try {
    cloudinary.config({
      cloud_name: "datg1ylrp",
      api_key: "416186796815297",
      api_secret: "_iV7Aa-qF07SYSaqmtUBRaNeGAs", // Replace with your actual API secret
    });

    if (!req.files || !req.files.image) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    // Get the uploaded file
    const image = req.files.image as UploadedFile;

    // Upload file to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(image.tempFilePath, {
      folder: "city-de-moda",
    });

    res.json({
      message: "Upload successful",
      url: uploadResult.secure_url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed", error });
  }
};
