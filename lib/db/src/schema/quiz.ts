import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { articlesTable } from "./articles";

export const quizQuestionsTable = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  articleId: integer("article_id").notNull().references(() => articlesTable.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  options: text("options").array().notNull().default([]),
  correctAnswer: integer("correct_answer").notNull(),
  explanation: text("explanation").notNull(),
  difficulty: text("difficulty").notNull().default("medium"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertQuizQuestionSchema = createInsertSchema(quizQuestionsTable).omit({ id: true, createdAt: true });
export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;
export type QuizQuestion = typeof quizQuestionsTable.$inferSelect;
