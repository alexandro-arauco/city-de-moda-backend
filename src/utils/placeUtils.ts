import { eq } from "drizzle-orm";
import { PgTransaction } from "drizzle-orm/pg-core";
import { UploadedFile } from "express-fileupload";
import { z } from "zod";
import {
  CategoryPlaceTable,
  PlaceImagesTable,
  PlaceSchedulesTable,
  PlaceServicesTable,
  PlaceSocialMediaTable,
  PlaceTable,
  PlaceVideosTable,
} from "../db/schema";
import { categorySchema } from "../schemas/categorySchema";
import { Schedule, Service, SocialMedia, Video } from "../schemas/placeSchema";
import { cloudinaryConfig } from "./cloudinaryUtil";

export const insertImages = async (
  tx: PgTransaction<any, any, any>,
  mainImage: UploadedFile | UploadedFile[],
  additionalImages: UploadedFile | UploadedFile[],
  placeId: number
) => {
  try {
    const urlMainImage = await urlUploadImage(
      mainImage as UploadedFile,
      placeId
    );

    await tx
      .update(PlaceTable)
      .set({ urlImage: urlMainImage })
      .where(eq(PlaceTable.id, placeId));

    if (Array.isArray(additionalImages)) {
      await Promise.all(
        additionalImages.map(async (file: UploadedFile) => {
          const urlImage = await urlUploadImage(file, placeId);
          await insertPlaceImage(tx, placeId, urlImage);
        })
      );
    } else if (additionalImages) {
      const urlImage = await urlUploadImage(
        additionalImages as UploadedFile,
        placeId
      );
      await insertPlaceImage(tx, placeId, urlImage);
    }
  } catch (error) {
    console.error("Insert Place Image", error);
  }
};

export const insertPlaceCategory = async (
  tx: PgTransaction<any, any, any>,
  categoriesValues: string,
  placeId: number
) => {
  try {
    type Categories = Omit<z.infer<typeof categorySchema>, "active">;
    const categories: Categories[] = JSON.parse(categoriesValues);

    const categoryPlace = categories.map((category: any) => ({
      categoryId: category.id,
      placeId,
    }));
    await tx.insert(CategoryPlaceTable).values(categoryPlace);
  } catch (error) {
    console.error("Insert Place Category", error);
  }
};

export const insertPlaceSchedule = async (
  tx: PgTransaction<any, any, any>,
  schedule: string,
  placeId: number
) => {
  try {
    const schedules: Schedule[] = JSON.parse(schedule);
    const placeSchedules = schedules.map((item) => ({
      placeId,
      ...item,
    }));

    await tx.insert(PlaceSchedulesTable).values(placeSchedules);
  } catch (error) {
    console.error("Insert Place Schedule", error);
  }
};

export const insertPlaceServices = async (
  tx: PgTransaction<any, any, any>,
  servicesValues: string,
  placeId: number
) => {
  try {
    const services: Service[] = servicesValues
      ? JSON.parse(servicesValues)
      : [];

    const placeServies = services.map((service) => ({
      placeId,
      ...service,
    }));

    await tx.insert(PlaceServicesTable).values(placeServies);
  } catch (error) {
    console.error("Insert Place Services", error);
  }
};

export const insertPlaceSocialMedia = async (
  tx: PgTransaction<any, any, any>,
  socialMedia: string,
  placeId: number
) => {
  try {
    const socialMediaValues: SocialMedia[] = JSON.parse(socialMedia);
    const placeSocialMedia = socialMediaValues.map((item) => ({
      placeId,
      ...item,
    }));

    await tx.insert(PlaceSocialMediaTable).values(placeSocialMedia);
  } catch (error) {
    console.error("Insert Place Social Media", error);
  }
};

export const insertPlaceVideos = async (
  tx: PgTransaction<any, any, any>,
  videos: string,
  placeId: number
) => {
  try {
    const videosValues: Video[] = JSON.parse(videos);
    const placeVideos = videosValues.map((item) => ({
      placeId,
      ...item,
    }));

    await tx.insert(PlaceVideosTable).values(placeVideos);
  } catch (error) {
    console.error("Insert Place Videos", error);
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
        transformation: { width: 800, height: 600, crop: "limit" },
        chunk_size: 6000000,
      }
    );

    return uploadResult.secure_url;
  } catch (error) {
    console.error("Upload Image to Cloudinary failed:", error);

    return "";
  }
};
