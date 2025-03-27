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
  services: z.string().optional(),
  additionalContact: z.string().optional(),
  socialMedia: z.string().optional(),
  videos: z.string().optional(),
  whatsapp: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  email: z.string(),
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

export type Service = {
  name: string;
};

export type SocialMedia = {
  name: string;
  url: string;
};

export type Video = {
  url: string;
};
