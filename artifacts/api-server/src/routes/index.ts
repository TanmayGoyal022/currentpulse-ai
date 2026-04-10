import { Router, type IRouter } from "express";
import healthRouter from "./health";
import articlesRouter from "./articles";
import bookmarksRouter from "./bookmarks";
import notesRouter from "./notes";
import quizRouter from "./quiz";
import categoriesRouter from "./categories";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(articlesRouter);
router.use(bookmarksRouter);
router.use(notesRouter);
router.use(quizRouter);
router.use(categoriesRouter);
router.use(dashboardRouter);

export default router;
