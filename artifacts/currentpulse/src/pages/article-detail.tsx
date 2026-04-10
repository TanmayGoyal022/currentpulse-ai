import { useGetArticle, useCreateBookmark, useDeleteBookmark, useListBookmarks, getListBookmarksQueryKey, useListNotes, useCreateNote, useUpdateNote, getListNotesQueryKey } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ArrowLeft, Bookmark, BookmarkCheck, FileText, Headphones, Play, CheckCircle2, ChevronRight, PenLine } from "lucide-react";
import { formatCategory, categoryColors, gsMappingColors, examRelevanceColors } from "@/lib/constants";
import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const articleId = parseInt(id || "0", 10);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: article, isLoading: isArticleLoading } = useGetArticle(articleId, { 
    query: { enabled: !!articleId, queryKey: [`/api/articles/${articleId}`] } 
  });

  const { data: bookmarks } = useListBookmarks();
  const isBookmarked = bookmarks?.some(b => b.articleId === articleId);
  const bookmark = bookmarks?.find(b => b.articleId === articleId);

  const createBookmark = useCreateBookmark();
  const deleteBookmark = useDeleteBookmark();

  const handleBookmarkToggle = () => {
    if (isBookmarked && bookmark) {
      deleteBookmark.mutate({ id: bookmark.id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListBookmarksQueryKey() });
          toast({ title: "Bookmark removed" });
        }
      });
    } else {
      createBookmark.mutate({ data: { articleId } }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListBookmarksQueryKey() });
          toast({ title: "Article bookmarked" });
        }
      });
    }
  };

  // Notes logic
  const { data: notes } = useListNotes();
  const articleNote = notes?.find(n => n.articleId === articleId);
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  
  const [noteContent, setNoteContent] = useState("");
  const [isEditingNote, setIsEditingNote] = useState(false);
  const initializedNoteId = useRef<number | null>(null);

  useEffect(() => {
    if (articleNote && initializedNoteId.current !== articleNote.id) {
      setNoteContent(articleNote.content);
      initializedNoteId.current = articleNote.id;
    }
  }, [articleNote]);

  const handleSaveNote = () => {
    if (articleNote) {
      updateNote.mutate({ id: articleNote.id, data: { content: noteContent } }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListNotesQueryKey() });
          setIsEditingNote(false);
          toast({ title: "Note updated" });
        }
      });
    } else {
      createNote.mutate({ data: { articleId, content: noteContent } }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListNotesQueryKey() });
          setIsEditingNote(false);
          toast({ title: "Note created" });
        }
      });
    }
  };

  if (isArticleLoading) {
    return (
      <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-12 w-full" />
        <div className="flex gap-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!article) return <div className="p-10 text-center">Article not found</div>;

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      <Link href="/articles">
        <Button variant="ghost" size="sm" className="mb-4 -ml-4 text-muted-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Feed
        </Button>
      </Link>

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Badge variant="secondary" className={gsMappingColors[article.gsMapping]}>{article.gsMapping}</Badge>
            <Badge variant="secondary" className={categoryColors[article.category]}>{formatCategory(article.category)}</Badge>
            <Badge variant="outline" className={examRelevanceColors[article.examRelevance]}>{formatCategory(article.examRelevance)}</Badge>
            <span className="text-muted-foreground">{format(new Date(article.publishedAt), "MMMM d, yyyy")}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleBookmarkToggle}>
              {isBookmarked ? <BookmarkCheck className="mr-2 h-4 w-4 text-primary" /> : <Bookmark className="mr-2 h-4 w-4" />}
              {isBookmarked ? "Saved" : "Save"}
            </Button>
            <Link href={`/quiz?articleId=${article.id}`}>
              <Button size="sm">Take Quiz</Button>
            </Link>
          </div>
        </div>

        <h1 className="text-3xl md:text-5xl font-serif font-bold leading-tight">{article.title}</h1>
        <p className="text-lg text-muted-foreground border-l-4 border-primary pl-4 py-1">{article.background}</p>
      </div>

      <Tabs defaultValue="read" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6">
          <TabsTrigger value="read" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-medium">
            <FileText className="mr-2 h-4 w-4" /> Read
          </TabsTrigger>
          <TabsTrigger value="listen" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-medium">
            <Headphones className="mr-2 h-4 w-4" /> Listen
          </TabsTrigger>
          <TabsTrigger value="watch" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-medium">
            <Play className="mr-2 h-4 w-4" /> Watch
          </TabsTrigger>
          <TabsTrigger value="notes" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-medium ml-auto">
            <PenLine className="mr-2 h-4 w-4" /> My Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="read" className="space-y-10 mt-0">
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold border-b pb-2">Key Points</h2>
            <ul className="space-y-4">
              {article.keyPoints.map((point, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-lg">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold border-b pb-2">Detailed Analysis</h2>
            <div className="prose dark:prose-invert max-w-none text-lg">
              {article.analysis.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          {article.sourceUrl && (
            <div className="pt-6 border-t">
              <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center">
                Read original source on {article.source} <ChevronRight className="h-4 w-4 ml-1" />
              </a>
            </div>
          )}
        </TabsContent>

        <TabsContent value="listen" className="mt-0">
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="p-10 flex flex-col items-center justify-center text-center space-y-6">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                <Headphones className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Audio Summary</h3>
                <p className="text-muted-foreground max-w-md mx-auto">Listen to a structured 3-minute AI-generated summary of this topic.</p>
              </div>
              
              {/* Fake Audio Player */}
              <div className="w-full max-w-md bg-background border rounded-full p-2 flex items-center gap-4 shadow-sm">
                <Button size="icon" className="rounded-full h-10 w-10 shrink-0">
                  <Play className="h-5 w-5 ml-1" />
                </Button>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-1/3"></div>
                </div>
                <div className="text-xs font-medium pr-4 text-muted-foreground">01:14 / 03:45</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="watch" className="mt-0">
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="p-2 sm:p-6 text-center">
              <div className="aspect-video bg-black rounded-lg flex items-center justify-center relative group overflow-hidden border">
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
                <Button size="icon" variant="outline" className="h-16 w-16 rounded-full border-2 bg-background/50 backdrop-blur-sm group-hover:scale-110 transition-transform">
                  <Play className="h-8 w-8 ml-1" />
                </Button>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
                  <div className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-md text-sm font-medium text-left">
                    Concept Explainer: {article.title}
                  </div>
                  <div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-mono">
                    05:20
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Personal Notes</CardTitle>
              <CardDescription>Jot down important points for your revision</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditingNote || !articleNote ? (
                <div className="space-y-4">
                  <Textarea 
                    placeholder="Write your notes here..." 
                    className="min-h-[200px] text-lg font-serif resize-y"
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    {articleNote && (
                      <Button variant="outline" onClick={() => {
                        setNoteContent(articleNote.content);
                        setIsEditingNote(false);
                      }}>Cancel</Button>
                    )}
                    <Button onClick={handleSaveNote} disabled={createNote.isPending || updateNote.isPending}>
                      Save Notes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-6 bg-muted/30 rounded-lg min-h-[200px] whitespace-pre-wrap font-serif text-lg border">
                    {articleNote.content || <span className="text-muted-foreground italic">No content.</span>}
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={() => setIsEditingNote(true)}>
                      <PenLine className="mr-2 h-4 w-4" /> Edit Notes
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
