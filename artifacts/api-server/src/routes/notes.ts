import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, notesTable } from "@workspace/db";
import {
  ListNotesResponse,
  CreateNoteBody,
  UpdateNoteBody,
  UpdateNoteParams,
  UpdateNoteResponse,
  DeleteNoteParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/notes", async (req, res): Promise<void> => {
  const notes = await db.select().from(notesTable).orderBy(notesTable.updatedAt);
  res.json(ListNotesResponse.parse(notes));
});

router.post("/notes", async (req, res): Promise<void> => {
  const parsed = CreateNoteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [note] = await db.insert(notesTable).values(parsed.data).returning();
  res.status(201).json(note);
});

router.patch("/notes/:id", async (req, res): Promise<void> => {
  const params = UpdateNoteParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateNoteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (!parsed.data.content && parsed.data.content !== "") {
    res.status(400).json({ error: "Nothing to update" });
    return;
  }

  const [note] = await db
    .update(notesTable)
    .set({ content: parsed.data.content })
    .where(eq(notesTable.id, params.data.id))
    .returning();

  if (!note) {
    res.status(404).json({ error: "Note not found" });
    return;
  }

  res.json(UpdateNoteResponse.parse(note));
});

router.delete("/notes/:id", async (req, res): Promise<void> => {
  const params = DeleteNoteParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(notesTable)
    .where(eq(notesTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Note not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
