import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, quizQuestionsTable } from "@workspace/db";
import {
  ListQuizQuestionsResponse,
  ListQuizQuestionsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/quiz", async (req, res): Promise<void> => {
  const params = ListQuizQuestionsQueryParams.safeParse(req.query);

  let questions = await db.select().from(quizQuestionsTable).orderBy(quizQuestionsTable.createdAt);

  if (params.success && params.data.articleId != null) {
    questions = questions.filter((q) => q.articleId === params.data.articleId);
  }

  res.json(ListQuizQuestionsResponse.parse(questions));
});

export default router;
