import { eq } from "drizzle-orm";
import { PgTransaction } from "drizzle-orm/pg-core";
import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { z } from "zod";
import { db } from "../db/db";
import {
  CategoryPlaceTable,
  PlaceImagesTable,
  PlaceSchedulesTable,
  PlaceTable,
} from "../db/schema";
import { categorySchema } from "../schemas/categorySchema";
import { Schedule } from "../schemas/placeSchema";
import { cloudinaryConfig } from "../utils/cloudinaryUtil";

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
  try {
    const { name, address, lat, lng, phone, country, city } = req.body;

    const urlImage = "";

    type Categories = Omit<z.infer<typeof categorySchema>, "active">;
    const categories: Categories[] = JSON.parse(req.body.categories);

    const schedules: Schedule[] = JSON.parse(req.body.schedule);

    await db.transaction(async (tx) => {
      const place = await tx
        .insert(PlaceTable)
        .values({
          name: JSON.parse(name),
          address: JSON.parse(address),
          lat,
          lng,
          phone: JSON.parse(phone),
          country: JSON.parse(country),
          urlImage,
          city: JSON.parse(city),
        })
        .returning();

      const placeId = place[0].id;
      if (!placeId) {
        res.status(400).json({ message: "Error creating place, try again" });
        return;
      }

      const categoryPlace = categories.map((category: any) => ({
        categoryId: category.id,
        placeId,
      }));

      const placeSchedules = schedules.map((item) => ({
        placeId,
        ...item,
      }));

      await tx.insert(CategoryPlaceTable).values(categoryPlace);
      await tx.insert(PlaceSchedulesTable).values(placeSchedules);

      if (req.files) {
        const { mainImage, additionalImages } = req.files;
        const urlMainImage = await urlUploadImage(
          mainImage as UploadedFile,
          placeId
        );

        await tx
          .update(PlaceTable)
          .set({ urlImage: urlMainImage })
          .where(eq(PlaceTable.id, placeId));

        if (Array.isArray(additionalImages)) {
          additionalImages.forEach(async (file: UploadedFile) => {
            const urlImage = await urlUploadImage(file, placeId);

            await new Promise((r) => setTimeout(r, 2000));

            await insertPlaceImage(tx, placeId, urlImage);
          });
        } else {
          const urlImage = await urlUploadImage(
            additionalImages as UploadedFile,
            placeId
          );
          await insertPlaceImage(tx, placeId, urlImage);
        }
      }

      const response = {
        data: place,
        message: "Place registered successfully",
      };

      res.status(201).json(response);
    });
  } catch (error) {
    console.error("Insert Place", error);
  }
};

const insertPlaceImage = async (
  tx: PgTransaction<any, any, any>,
  placeId: number,
  url: string
) => {
  try {
    await tx
      .insert(PlaceImagesTable)
      .values({
        url,
        placeId,
      })
      .returning();
  } catch (error) {
    console.error("Insert Place Image", error);
  }
};

const urlUploadImage = async (file: UploadedFile, placeId: number) => {
  try {
    const uploadResult = await cloudinaryConfig.uploader.upload(
      file.tempFilePath,
      {
        folder: `city-de-moda/places/${placeId}`,
        resource_type: "image",
      }
    );

    return uploadResult.secure_url;
  } catch (error) {
    console.error("Upload Image to Cloudinary failed:", error);

    return "";
  }
};

/* export const uploadImage = async (req: Request, res: Response) => {
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
}; */
