import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Layout } from "@/components/layout";

// Pages
import Dashboard from "@/pages/dashboard";
import Articles from "@/pages/articles";
import ArticleDetail from "@/pages/article-detail";
import Categories from "@/pages/categories";
import Quiz from "@/pages/quiz";
import Bookmarks from "@/pages/bookmarks";
import Notes from "@/pages/notes";
import Weekly from "@/pages/weekly";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/articles" component={Articles} />
      <Route path="/articles/:id" component={ArticleDetail} />
      <Route path="/categories" component={Categories} />
      <Route path="/quiz" component={Quiz} />
      <Route path="/bookmarks" component={Bookmarks} />
      <Route path="/notes" component={Notes} />
      <Route path="/weekly" component={Weekly} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="currentpulse-theme">
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Layout>
              <Router />
            </Layout>
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
