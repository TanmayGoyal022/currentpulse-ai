import { Router, type IRouter } from "express";
import { eq, ilike, and, gte, lte, desc } from "drizzle-orm";
import { db, articlesTable, bookmarksTable } from "@workspace/db";
import {
  GetArticleParams,
  GetArticleResponse,
  ListArticlesResponse,
  GetTodayArticlesResponse,
  GetWeeklyArticlesResponse,
  GetWeeklyArticlesQueryParams,
  ListArticlesQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/articles/today", async (req, res): Promise<void> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const articles = await db
    .select()
    .from(articlesTable)
    .where(and(gte(articlesTable.publishedAt, today), lte(articlesTable.publishedAt, tomorrow)))
    .orderBy(desc(articlesTable.publishedAt));

  const byCategory: Record<string, typeof articles> = {};
  for (const article of articles) {
    if (!byCategory[article.category]) {
      byCategory[article.category] = [];
    }
    byCategory[article.category].push(article);
  }

  const result = GetTodayArticlesResponse.parse({
    date: today.toISOString().split("T")[0],
    totalCount: articles.length,
    byCategory,
  });
  res.json(result);
});

router.get("/articles/weekly", async (req, res): Promise<void> => {
  const params = GetWeeklyArticlesQueryParams.safeParse(req.query);
  const weekOffset = params.success && params.data.weekOffset != null ? params.data.weekOffset : 0;

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() - weekOffset * 7);
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  const articles = await db
    .select()
    .from(articlesTable)
    .where(and(gte(articlesTable.publishedAt, startOfWeek), lte(articlesTable.publishedAt, endOfWeek)))
    .orderBy(desc(articlesTable.publishedAt));

  res.json(GetWeeklyArticlesResponse.parse(articles));
});

router.get("/articles", async (req, res): Promise<void> => {
  const params = ListArticlesQueryParams.safeParse(req.query);

  let conditions: ReturnType<typeof eq>[] = [];

  if (params.success) {
    if (params.data.category) {
      conditions.push(eq(articlesTable.category, params.data.category));
    }
    if (params.data.examRelevance) {
      conditions.push(eq(articlesTable.examRelevance, params.data.examRelevance));
    }
  }

  const allArticles = await db
    .select()
    .from(articlesTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(articlesTable.publishedAt));

  let filtered = allArticles;

  if (params.success && params.data.search) {
    const s = params.data.search.toLowerCase();
    filtered = allArticles.filter(
      (a) =>
        a.title.toLowerCase().includes(s) ||
        a.background.toLowerCase().includes(s) ||
        a.analysis.toLowerCase().includes(s) ||
        a.tags.some((t) => t.toLowerCase().includes(s))
    );
  }

  if (params.success && params.data.date) {
    const d = new Date(params.data.date);
    const next = new Date(d);
    next.setDate(d.getDate() + 1);
    filtered = filtered.filter((a) => a.publishedAt >= d && a.publishedAt < next);
  }

  res.json(ListArticlesResponse.parse(filtered));
});

router.get("/articles/:id", async (req, res): Promise<void> => {
  const params = GetArticleParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [article] = await db
    .select()
    .from(articlesTable)
    .where(eq(articlesTable.id, params.data.id));

  if (!article) {
    res.status(404).json({ error: "Article not found" });
    return;
  }

  res.json(GetArticleResponse.parse(article));
});

export default router;
