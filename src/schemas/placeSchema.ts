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
  urlImage: z.string(),
  active: z.boolean(),

  categories: z.array(z.number()),
});

export const insertPlaceSchema = placeSchema.omit({
  id: true,
  active: true,
});
