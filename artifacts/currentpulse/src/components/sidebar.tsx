import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  BookOpen, 
  Layers, 
  BrainCircuit, 
  Bookmark, 
  FileText, 
  CalendarDays,
  Moon,
  Sun
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/articles", icon: BookOpen, label: "Daily Feed" },
  { href: "/categories", icon: Layers, label: "GS Papers" },
  { href: "/weekly", icon: CalendarDays, label: "Weekly Compilations" },
  { href: "/quiz", icon: BrainCircuit, label: "Daily Quiz" },
  { href: "/bookmarks", icon: Bookmark, label: "Bookmarks" },
  { href: "/notes", icon: FileText, label: "My Notes" },
];

export function Sidebar() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  return (
    <aside className="w-64 border-r border-border bg-sidebar h-screen flex flex-col sticky top-0 left-0 hidden md:flex">
      <div className="p-6">
        <Link href="/">
          <div className="flex items-center gap-2 font-serif text-2xl font-bold tracking-tight text-sidebar-primary cursor-pointer">
            <BookOpen className="h-6 w-6" />
            <span>CurrentPulse</span>
          </div>
        </Link>
        <p className="text-xs text-muted-foreground mt-1 tracking-wider uppercase">UPSC Study Companion</p>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}>
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors cursor-pointer text-sm font-medium ${
                isActive 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}>
                <item.icon className="h-5 w-5" />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {theme === "dark" ? "Light Mode" : "Night Mode"}
        </Button>
      </div>
    </aside>
  );
}
