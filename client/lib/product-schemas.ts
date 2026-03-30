import { z } from "zod";

const PRODUCT_CATEGORY_VALUES = ["general", "electronics", "clothing", "home", "sports"] as const;

export const addProductSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title must be at most 200 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description must be at most 5000 characters"),
  price: z.coerce
    .number()
    .min(0, "Price must be 0 or greater")
    .finite("Enter a valid price"),
  category: z.enum(PRODUCT_CATEGORY_VALUES, { message: "Select a category" }).default("general"),
  imageUrl: z
    .string()
    .optional()
    .refine((v) => !v || v === "" || z.string().url().safeParse(v).success, "Enter a valid URL"),
});

export type AddProductInput = z.infer<typeof addProductSchema>;
