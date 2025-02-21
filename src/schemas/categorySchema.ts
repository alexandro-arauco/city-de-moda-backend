import { z } from "zod";

export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  active: z.boolean(),
});

export const insertCategorySchema = categorySchema.pick({ name: true });
