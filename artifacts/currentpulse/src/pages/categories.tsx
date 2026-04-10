import { useListCategories } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Layers, BookOpen, ChevronRight } from "lucide-react";
import { gsMappingColors } from "@/lib/constants";

export default function Categories() {
  const { data: categories, isLoading } = useListCategories();

  const gsGroups = [
    { id: "GS1", title: "General Studies Paper I", desc: "History, Geography, Heritage & Culture, Society" },
    { id: "GS2", title: "General Studies Paper II", desc: "Governance, Constitution, Polity, Social Justice, IR" },
    { id: "GS3", title: "General Studies Paper III", desc: "Technology, Economic Development, Environment, Security" },
    { id: "GS4", title: "General Studies Paper IV", desc: "Ethics, Integrity, and Aptitude" }
  ];

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">Syllabus Mapping</h1>
        <p className="text-muted-foreground mt-2 text-lg">Current affairs organized by GS Papers</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {gsGroups.map(group => {
          const groupCategories = categories?.filter(c => c.gsMapping === group.id) || [];
          
          return (
            <Card key={group.id} className="overflow-hidden border-2">
              <div className={`h-2 w-full ${gsMappingColors[group.id].split(' ')[0]}`}></div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                      <Layers className="h-5 w-5 text-muted-foreground" />
                      {group.id}
                    </CardTitle>
                    <CardDescription className="text-base mt-1">{group.title}</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-sm">
                    {groupCategories.reduce((acc, cat) => acc + cat.articleCount, 0)} Articles
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2 bg-muted/50 p-2 rounded-md">{group.desc}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {groupCategories.map(category => (
                      <Link key={category.id} href={`/articles?category=${category.id}`}>
                        <div className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 hover:border-primary/50 transition-colors cursor-pointer group">
                          <div>
                            <div className="font-medium group-hover:text-primary transition-colors">{category.label}</div>
                            <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{category.description}</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="font-mono">{category.articleCount}</Badge>
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                          </div>
                        </div>
                      </Link>
                    ))}
                    {groupCategories.length === 0 && (
                      <div className="text-sm text-muted-foreground p-4 text-center border border-dashed rounded-md">
                        No sub-categories defined
                      </div>
                    )}
                  </div>
                )}
                
                <div className="pt-4">
                  <Link href={`/articles?search=${group.id}`}>
                    <Button variant="ghost" className="w-full justify-between" size="sm">
                      View all {group.id} articles <BookOpen className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// Ensure Button is available
import { Button } from "@/components/ui/button";