import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, bookmarksTable, articlesTable } from "@workspace/db";
import {
  ListBookmarksResponse,
  CreateBookmarkBody,
  DeleteBookmarkParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/bookmarks", async (req, res): Promise<void> => {
  const rows = await db
    .select({
      id: bookmarksTable.id,
      articleId: bookmarksTable.articleId,
      createdAt: bookmarksTable.createdAt,
      article: articlesTable,
    })
    .from(bookmarksTable)
    .leftJoin(articlesTable, eq(bookmarksTable.articleId, articlesTable.id))
    .orderBy(bookmarksTable.createdAt);

  const bookmarks = rows
    .filter((r) => r.article !== null)
    .map((r) => ({
      id: r.id,
      articleId: r.articleId,
      createdAt: r.createdAt,
      article: r.article!,
    }));

  res.json(ListBookmarksResponse.parse(bookmarks));
});

router.post("/bookmarks", async (req, res): Promise<void> => {
  const parsed = CreateBookmarkBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [bookmark] = await db
    .insert(bookmarksTable)
    .values({ articleId: parsed.data.articleId })
    .returning();

  const [article] = await db
    .select()
    .from(articlesTable)
    .where(eq(articlesTable.id, bookmark.articleId));

  if (!article) {
    res.status(404).json({ error: "Article not found" });
    return;
  }

  res.status(201).json({ ...bookmark, article });
});

router.delete("/bookmarks/:id", async (req, res): Promise<void> => {
  const params = DeleteBookmarkParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(bookmarksTable)
    .where(eq(bookmarksTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Bookmark not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
