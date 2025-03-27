import { Request, Response } from "express";
import { z } from "zod";
import { db } from "../db/db";
import { PlaceTable } from "../db/schema";
import { placeSchema } from "../schemas/placeSchema";
import {
  insertImages,
  insertPlaceCategory,
  insertPlaceSchedule,
  insertPlaceServices,
  insertPlaceSocialMedia,
  insertPlaceVideos,
} from "../utils/placeUtils";
import { extractLatLng } from "../utils/utilities";

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
    const {
      name,
      address,
      phone,
      country,
      city,
      additionalContact,
      whatsapp,
      description,
      email,
      videos,
      location,
      socialMedia,
      schedule,
    } = req.body as z.infer<typeof placeSchema>;

    const urlImage = "";
    const { latitude, longitude } = extractLatLng(location || "");

    await db.transaction(async (tx) => {
      try {
        const place = await tx
          .insert(PlaceTable)
          .values({
            name: JSON.parse(name),
            address: JSON.parse(address),
            lat: latitude.toString(),
            lng: longitude.toString(),
            phone: JSON.parse(phone),
            country: JSON.parse(country),
            city: JSON.parse(city),
            urlImage,
            additionalContact: JSON.parse(additionalContact || ""),
            whatsapp: JSON.parse(whatsapp || "false"),
            description: JSON.parse(description || ""),
            email: JSON.parse(email),
          })
          .returning();

        const placeId = place[0].id;
        if (!placeId) {
          res.status(400).json({ message: "Error creating place, try again" });
          return;
        }

        await insertPlaceCategory(tx, req.body.categories, placeId);
        await insertPlaceSchedule(tx, schedule, placeId);
        await insertPlaceServices(tx, req.body.services, placeId);
        await insertPlaceSocialMedia(tx, socialMedia || "[]", placeId);
        await insertPlaceVideos(tx, videos || "[]", placeId);

        if (req.files) {
          const { mainImage, additionalImages } = req.files;
          await insertImages(tx, mainImage, additionalImages, placeId);
        }

        const response = {
          data: place,
          message: "Place registered successfully",
        };

        res.status(201).json(response);
      } catch (error) {
        console.error("Register Place", error);
        throw error;
      }
    });
  } catch (error) {
    console.error("Insert Place", error);
  }
};
