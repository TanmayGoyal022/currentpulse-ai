import { Router, type IRouter } from "express";
import { db, articlesTable } from "@workspace/db";
import { ListCategoriesResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const CATEGORIES = [
  {
    id: "polity",
    label: "Polity & Governance",
    gsMapping: "GS2",
    description: "Constitutional provisions, Parliament, Judiciary, Governance reforms, and Political systems.",
  },
  {
    id: "economy",
    label: "Economy",
    gsMapping: "GS3",
    description: "Economic development, Budget, Fiscal policy, Trade, Agriculture, and Infrastructure.",
  },
  {
    id: "environment",
    label: "Environment & Ecology",
    gsMapping: "GS3",
    description: "Biodiversity, Climate change, Conservation, Pollution, Disasters, and Environmental policies.",
  },
  {
    id: "international_relations",
    label: "International Relations",
    gsMapping: "GS2",
    description: "India's foreign policy, Bilateral relations, International organizations, and Geopolitics.",
  },
  {
    id: "science_tech",
    label: "Science & Technology",
    gsMapping: "GS3",
    description: "Space, Defence technology, Biotechnology, AI, IT, and Innovation.",
  },
];

router.get("/categories", async (req, res): Promise<void> => {
  const allArticles = await db.select({ category: articlesTable.category }).from(articlesTable);

  const countMap: Record<string, number> = {};
  for (const { category } of allArticles) {
    countMap[category] = (countMap[category] || 0) + 1;
  }

  const result = CATEGORIES.map((c) => ({
    ...c,
    articleCount: countMap[c.id] || 0,
  }));

  res.json(ListCategoriesResponse.parse(result));
});

export default router;
