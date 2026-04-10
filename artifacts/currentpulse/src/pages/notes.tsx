import { useListNotes, useDeleteNote, useUpdateNote, getListNotesQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { FileText, Calendar, PenLine, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function Notes() {
  const { data: notes, isLoading } = useListNotes();
  const deleteNote = useDeleteNote();
  const updateNote = useUpdateNote();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [editingNote, setEditingNote] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this note?")) {
      deleteNote.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListNotesQueryKey() });
          toast({ title: "Note deleted" });
        }
      });
    }
  };

  const handleEditOpen = (id: number, content: string) => {
    setEditingNote(id);
    setEditContent(content);
  };

  const handleEditSave = () => {
    if (editingNote) {
      updateNote.mutate({ id: editingNote, data: { content: editContent } }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListNotesQueryKey() });
          setEditingNote(null);
          toast({ title: "Note updated" });
        }
      });
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">My Notes</h1>
        <p className="text-muted-foreground mt-2 text-lg">Your personal study notes and jottings</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full" />)}
        </div>
      ) : (
        <>
          {notes && notes.length > 0 ? (
            <div className="space-y-6">
              {notes.map(note => (
                <Card key={note.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/30 py-3 flex flex-row items-center justify-between border-b">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      Last updated {format(new Date(note.updatedAt), "MMMM d, yyyy h:mm a")}
                    </div>
                    {note.articleId && (
                      <Link href={`/articles/${note.articleId}`}>
                        <Button variant="link" size="sm" className="h-auto p-0 text-primary">
                          View Article <ExternalLink className="ml-1 h-3 w-3" />
                        </Button>
                      </Link>
                    )}
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="font-serif text-lg whitespace-pre-wrap leading-relaxed">
                      {note.content}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/10 border-t py-3 flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditOpen(note.id, note.content)}>
                      <PenLine className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(note.id)} disabled={deleteNote.isPending}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-16 border border-dashed rounded-lg bg-muted/10">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-20" />
              <h3 className="text-xl font-medium">No notes yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto mt-2">
                Write notes on articles while reading them to see them here.
              </p>
              <Link href="/articles">
                <Button className="mt-6">Browse Articles</Button>
              </Link>
            </div>
          )}
        </>
      )}

      <Dialog open={editingNote !== null} onOpenChange={(open) => !open && setEditingNote(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea 
              value={editContent} 
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[300px] text-lg font-serif resize-y"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingNote(null)}>Cancel</Button>
            <Button onClick={handleEditSave} disabled={updateNote.isPending}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
