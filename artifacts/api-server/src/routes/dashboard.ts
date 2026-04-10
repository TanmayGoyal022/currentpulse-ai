import { Router, type IRouter } from "express";
import { desc, gte, lte, and } from "drizzle-orm";
import { db, articlesTable, bookmarksTable, notesTable } from "@workspace/db";
import {
  GetDashboardSummaryResponse,
  GetTrendingTopicsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/dashboard/summary", async (req, res): Promise<void> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 7);

  const [allArticles, bookmarks, notes, recentArticles] = await Promise.all([
    db.select({ category: articlesTable.category, publishedAt: articlesTable.publishedAt }).from(articlesTable),
    db.select().from(bookmarksTable),
    db.select().from(notesTable),
    db.select().from(articlesTable).orderBy(desc(articlesTable.publishedAt)).limit(6),
  ]);

  const todayArticles = allArticles.filter(
    (a) => a.publishedAt >= today && a.publishedAt < tomorrow
  );
  const weekArticles = allArticles.filter((a) => a.publishedAt >= weekAgo);

  const categoryMap: Record<string, number> = {};
  for (const a of allArticles) {
    categoryMap[a.category] = (categoryMap[a.category] || 0) + 1;
  }

  const categoryBreakdown = Object.entries(categoryMap).map(([category, count]) => ({
    category,
    count,
  }));

  const summary = GetDashboardSummaryResponse.parse({
    todayCount: todayArticles.length,
    weekCount: weekArticles.length,
    totalBookmarks: bookmarks.length,
    totalNotes: notes.length,
    categoryBreakdown,
    recentArticles,
  });

  res.json(summary);
});

router.get("/dashboard/trending", async (req, res): Promise<void> => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const articles = await db
    .select({ tags: articlesTable.tags, category: articlesTable.category })
    .from(articlesTable)
    .where(gte(articlesTable.publishedAt, sevenDaysAgo));

  const topicMap: Record<string, { count: number; category: string }> = {};
  for (const { tags, category } of articles) {
    for (const tag of tags) {
      if (!topicMap[tag]) {
        topicMap[tag] = { count: 0, category };
      }
      topicMap[tag].count += 1;
    }
  }

  const trending = Object.entries(topicMap)
    .map(([topic, { count, category }]) => ({ topic, count, category }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  res.json(GetTrendingTopicsResponse.parse(trending));
});

export default router;
