import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const articlesTable = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  source: text("source").notNull(),
  sourceUrl: text("source_url"),
  category: text("category").notNull(),
  gsMapping: text("gs_mapping").notNull(),
  keyPoints: text("key_points").array().notNull().default([]),
  background: text("background").notNull(),
  analysis: text("analysis").notNull(),
  examRelevance: text("exam_relevance").notNull(),
  tags: text("tags").array().notNull().default([]),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertArticleSchema = createInsertSchema(articlesTable).omit({ id: true, createdAt: true });
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articlesTable.$inferSelect;
