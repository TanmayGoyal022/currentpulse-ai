import { useGetWeeklyArticles } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format, subWeeks, startOfWeek, endOfWeek } from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { formatCategory, categoryColors, gsMappingColors } from "@/lib/constants";
import { Article } from "@workspace/api-client-react";

export default function Weekly() {
  const [weekOffset, setWeekOffset] = useState(0);
  
  const { data: articles, isLoading } = useGetWeeklyArticles({ weekOffset });

  const targetDate = subWeeks(new Date(), weekOffset);
  const startDate = startOfWeek(targetDate, { weekStartsOn: 1 }); // Monday
  const endDate = endOfWeek(targetDate, { weekStartsOn: 1 }); // Sunday

  // Group by category
  const byCategory = articles?.reduce((acc, article) => {
    if (!acc[article.category]) acc[article.category] = [];
    acc[article.category].push(article);
    return acc;
  }, {} as Record<string, Article[]>);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">Weekly Compilation</h1>
          <p className="text-muted-foreground mt-2 text-lg">The perfect revision resource for your weekend</p>
        </div>
        
        <div className="flex items-center gap-4 bg-muted p-1 rounded-md border">
          <Button variant="ghost" size="icon" onClick={() => setWeekOffset(prev => prev + 1)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="text-sm font-medium whitespace-nowrap min-w-[140px] text-center">
            {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")}
          </div>
          <Button variant="ghost" size="icon" onClick={() => setWeekOffset(prev => Math.max(0, prev - 1))} disabled={weekOffset === 0}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center bg-primary/10 border border-primary/20 rounded-lg p-4 mb-8">
        <div className="flex items-center gap-3">
          <CalendarDays className="h-6 w-6 text-primary" />
          <div>
            <h3 className="font-bold">Ready for print</h3>
            <p className="text-sm text-muted-foreground">Download as a structured PDF for offline reading</p>
          </div>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" /> Download PDF
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-8">
          {[1, 2].map(i => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-12">
          {(!articles || articles.length === 0) ? (
            <div className="text-center p-16 border rounded-lg bg-muted/20">
              <p className="text-lg font-medium">No articles for this week</p>
            </div>
          ) : (
            Object.entries(byCategory || {}).map(([category, catArticles]) => (
              <div key={category} className="space-y-4">
                <div className="flex items-center gap-3 border-b pb-2">
                  <h2 className="text-2xl font-bold font-serif">{formatCategory(category)}</h2>
                  <Badge variant="secondary" className="font-mono">{catArticles.length}</Badge>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  {catArticles.map(article => (
                    <Link key={article.id} href={`/articles/${article.id}`}>
                      <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                        <CardContent className="p-5 flex flex-col h-full">
                          <div className="flex gap-2 mb-2">
                            <Badge variant="secondary" className={gsMappingColors[article.gsMapping]}>{article.gsMapping}</Badge>
                            <span className="text-xs text-muted-foreground my-auto ml-auto">{format(new Date(article.publishedAt), "EEE")}</span>
                          </div>
                          <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">{article.title}</h3>
                          <ul className="text-sm text-muted-foreground space-y-1 pl-4 list-disc mt-auto">
                            {article.keyPoints.slice(0, 2).map((point, i) => (
                              <li key={i} className="line-clamp-1">{point}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
