import { z } from "zod";

export const PostSchema = z.object({
  content: z
    .string()
    .min(1, "Post content is required")
    .min(3, "Content must be at least 3 characters"),

  image: z.custom<FileList>().optional(),
});

export type PostSchemaType = z.infer<typeof PostSchema>;
