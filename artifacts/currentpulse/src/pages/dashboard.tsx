import { useGetDashboardSummary, useGetTrendingTopics } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Bookmark, FileText, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { formatCategory, categoryColors, gsMappingColors } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: summary, isLoading: isSummaryLoading } = useGetDashboardSummary();
  const { data: trending, isLoading: isTrendingLoading } = useGetTrendingTopics();

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">Today's Pulse</h1>
          <p className="text-muted-foreground mt-2 text-lg">Your UPSC preparation summary for {format(new Date(), "MMMM do, yyyy")}</p>
        </div>
        <Link href="/articles">
          <div className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer">
            Read Today's Feed
          </div>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Articles Today</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isSummaryLoading ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold">{summary?.todayCount || 0}</div>}
            <p className="text-xs text-muted-foreground mt-1">Updates from major sources</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isSummaryLoading ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold">{summary?.weekCount || 0}</div>}
            <p className="text-xs text-muted-foreground mt-1">Articles processed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved for Revision</CardTitle>
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isSummaryLoading ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold">{summary?.totalBookmarks || 0}</div>}
            <p className="text-xs text-muted-foreground mt-1">Bookmarked articles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Notes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isSummaryLoading ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold">{summary?.totalNotes || 0}</div>}
            <p className="text-xs text-muted-foreground mt-1">Personal notes created</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Recent Important Articles</CardTitle>
            <CardDescription>Latest current affairs structured for UPSC</CardDescription>
          </CardHeader>
          <CardContent>
            {isSummaryLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)}
              </div>
            ) : (
              <div className="space-y-4">
                {summary?.recentArticles?.map(article => (
                  <Link key={article.id} href={`/articles/${article.id}`}>
                    <div className="flex flex-col space-y-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-2 text-xs">
                        <Badge variant="secondary" className={gsMappingColors[article.gsMapping]}>{article.gsMapping}</Badge>
                        <span className="text-muted-foreground">{formatCategory(article.category)}</span>
                        <span className="text-muted-foreground ml-auto">{format(new Date(article.publishedAt), "MMM d")}</span>
                      </div>
                      <h3 className="font-medium group-hover:text-primary transition-colors line-clamp-2">{article.title}</h3>
                    </div>
                  </Link>
                ))}
                {(!summary?.recentArticles || summary.recentArticles.length === 0) && (
                  <div className="text-center p-8 text-muted-foreground">No recent articles found.</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Trending Topics</CardTitle>
            <CardDescription>Frequently appearing in recent news</CardDescription>
          </CardHeader>
          <CardContent>
            {isTrendingLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : (
              <div className="space-y-4">
                {trending?.map((topic, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{topic.topic}</p>
                        <p className="text-xs text-muted-foreground">{formatCategory(topic.category)}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{topic.count} articles</Badge>
                  </div>
                ))}
                {(!trending || trending.length === 0) && (
                  <div className="text-center p-8 text-muted-foreground">No trending topics right now.</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
