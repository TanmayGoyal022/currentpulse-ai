import { useListBookmarks, useDeleteBookmark, getListBookmarksQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { BookmarkMinus, Bookmark as BookmarkIcon, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCategory, categoryColors, gsMappingColors } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Bookmarks() {
  const { data: bookmarks, isLoading } = useListBookmarks();
  const deleteBookmark = useDeleteBookmark();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleRemove = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    deleteBookmark.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListBookmarksQueryKey() });
        toast({ title: "Bookmark removed" });
      }
    });
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">Saved Articles</h1>
        <p className="text-muted-foreground mt-2 text-lg">Your personal collection for revision</p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-64 w-full" />)}
        </div>
      ) : (
        <>
          {bookmarks && bookmarks.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {bookmarks.map(bookmark => {
                const article = bookmark.article;
                return (
                  <Link key={bookmark.id} href={`/articles/${article.id}`}>
                    <Card className="h-full flex flex-col hover:border-primary/50 transition-colors cursor-pointer group">
                      <CardContent className="p-5 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex gap-2">
                            <Badge variant="secondary" className={gsMappingColors[article.gsMapping]}>{article.gsMapping}</Badge>
                            <Badge variant="secondary" className={categoryColors[article.category]}>{formatCategory(article.category)}</Badge>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0 -mt-1 -mr-1 z-10 relative"
                            onClick={(e) => handleRemove(e, bookmark.id)}
                            disabled={deleteBookmark.isPending}
                          >
                            <BookmarkMinus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-3 mb-2">{article.title}</h3>
                        
                        <div className="mt-auto pt-4 flex items-center text-xs text-muted-foreground">
                          <Calendar className="mr-1 h-3 w-3" />
                          Published {format(new Date(article.publishedAt), "MMM d, yyyy")}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center p-16 border border-dashed rounded-lg bg-muted/10">
              <BookmarkIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-20" />
              <h3 className="text-xl font-medium">No saved articles</h3>
              <p className="text-muted-foreground max-w-md mx-auto mt-2">
                You haven't bookmarked any articles yet. Save important articles while reading to build your revision library.
              </p>
              <Link href="/articles">
                <Button className="mt-6">Browse Daily Feed</Button>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
