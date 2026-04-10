import { useListArticles } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { formatCategory, categoryColors, gsMappingColors, examRelevanceColors } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Search, Filter, Calendar as CalendarIcon, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Articles() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | undefined>();
  const [examRelevance, setExamRelevance] = useState<string | undefined>();
  
  const { data: articles, isLoading } = useListArticles({ 
    search: search || undefined, 
    category: category && category !== "all" ? category : undefined,
    examRelevance: examRelevance && examRelevance !== "all" ? examRelevance : undefined
  });

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">Daily Feed</h1>
        <p className="text-muted-foreground mt-2 text-lg">Comprehensive daily current affairs for UPSC preparation</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search articles, topics, keywords..." 
            className="pl-9 h-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={category || "all"} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px] h-10">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="polity">Polity & Governance</SelectItem>
              <SelectItem value="economy">Economy</SelectItem>
              <SelectItem value="environment">Environment</SelectItem>
              <SelectItem value="international_relations">International Relations</SelectItem>
              <SelectItem value="science_tech">Science & Tech</SelectItem>
            </SelectContent>
          </Select>

          <Select value={examRelevance || "all"} onValueChange={setExamRelevance}>
            <SelectTrigger className="w-[160px] h-10">
              <SelectValue placeholder="Relevance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="prelims">Prelims</SelectItem>
              <SelectItem value="mains">Mains</SelectItem>
              <SelectItem value="both">Prelims + Mains</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {articles?.map(article => (
            <Link key={article.id} href={`/articles/${article.id}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                <CardContent className="p-6 flex flex-col md:flex-row gap-4 md:items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <Badge variant="secondary" className={gsMappingColors[article.gsMapping]}>{article.gsMapping}</Badge>
                      <Badge variant="secondary" className={categoryColors[article.category]}>{formatCategory(article.category)}</Badge>
                      <Badge variant="outline" className={examRelevanceColors[article.examRelevance]}>{formatCategory(article.examRelevance)}</Badge>
                      <span className="text-muted-foreground ml-auto flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        {format(new Date(article.publishedAt), "MMM d, yyyy")}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{article.title}</h3>
                    <p className="text-muted-foreground line-clamp-2 text-sm">{article.background}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {article.tags.map(tag => (
                        <span key={tag} className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-sm">#{tag}</span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          {(!articles || articles.length === 0) && (
            <div className="text-center p-12 border rounded-lg bg-muted/20">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-20" />
              <h3 className="text-lg font-medium">No articles found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
              <Button variant="outline" className="mt-4" onClick={() => { setSearch(""); setCategory("all"); setExamRelevance("all"); }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
