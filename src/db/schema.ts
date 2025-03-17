import { count } from "console";
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { update } from "../handlers/category";
import { relations } from "drizzle-orm";
import { placeSchema } from "../schemas/placeSchema";

export const CategoryTable = pgTable("category", {
  id: serial("id").primaryKey(),
  name: text().notNull(),
  active: boolean().notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const PlaceTable = pgTable("place", {
  id: serial("id").primaryKey(),
  name: text().notNull(),
  address: text().notNull(),
  lat: text().notNull(),
  lng: text().notNull(),
  phone: text().notNull(),
  country: text().notNull(),
  city: text().notNull(),
  urlImage: text().notNull(),
  active: boolean().notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const CategoryPlaceTable = pgTable("category_place", {
  id: serial("id").primaryKey(),
  categoryId: serial("category_id")
    .notNull()
    .references(() => CategoryTable.id),
  placeId: serial("place_id")
    .notNull()
    .references(() => PlaceTable.id),
  active: boolean().notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const CategoryTableRelations = relations(CategoryTable, ({ many }) => ({
  categoryPlaceTable: many(CategoryPlaceTable),
}));

export const PlaceTableRelations = relations(PlaceTable, ({ many }) => ({
  categoryPlaceTable: many(CategoryPlaceTable),
  placeSchedulesTable: many(PlaceSchedulesTable),
}));

export const CategoryPlaceTableRelations = relations(
  CategoryPlaceTable,
  ({ one }) => ({
    categoryTable: one(CategoryTable, {
      fields: [CategoryPlaceTable.categoryId],
      references: [CategoryTable.id],
    }),
    placeTable: one(PlaceTable, {
      fields: [CategoryPlaceTable.placeId],
      references: [PlaceTable.id],
    }),
  })
);

export const PlaceSchedulesTable = pgTable("place_schedule", {
  id: serial("id").primaryKey(),
  day: text().notNull(),
  initHour: text().notNull(),
  endHour: text().notNull(),
  placeId: integer("place_id"),
});

export const PlaceSchedulesTableRelations = relations(
  PlaceSchedulesTable,
  ({ one }) => ({
    placeTable: one(PlaceTable, {
      fields: [PlaceSchedulesTable.placeId],
      references: [PlaceTable.id],
    }),
  })
);
