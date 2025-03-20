import { z } from "zod";

export const placeSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string(),
  lat: z.string(),
  lng: z.string(),
  phone: z.string(),
  country: z.string(),
  city: z.string(),
  active: z.boolean(),
  categories: z.string(),
  schedule: z.string(),
  mainImage: z.instanceof(File).optional(),
  additionalImages: z.array(z.instanceof(File)).optional(),
});

export const insertPlaceSchema = placeSchema.omit({
  id: true,
  active: true,
});

export type Schedule = {
  day: string;
  initHour: string;
  endHour: string;
};
