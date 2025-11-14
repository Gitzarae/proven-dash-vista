import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  AlertCircle,
  CheckCircle,
  BarChart3,
  ChevronLeft,
  Bell,
  ListTodo,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const { user, isLoading } = useAuth();

  // Role-based navigation items
  const getNavItems = () => {
    const role = user?.role;

    // All roles see Dashboard
    const items = [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    ];

    switch (role) {
      case "top_management":
        items.push(
          { icon: FolderKanban, label: "Portfolio", path: "/portfolio" },
          { icon: CheckCircle, label: "Decisions", path: "/decisions" },
          { icon: AlertCircle, label: "Issues", path: "/issues" },
          { icon: BarChart3, label: "Analytics", path: "/analytics" },
          { icon: Bell, label: "Notifications", path: "/notifications" },
          { icon: Users, label: "Meetings", path: "/meetings" }
        );
        break;

      case "project_owner":
        items.push(
          { icon: FolderKanban, label: "Portfolio", path: "/portfolio" },
          { icon: CheckCircle, label: "Decisions", path: "/decisions" },
          { icon: AlertCircle, label: "Issues", path: "/issues" },
          { icon: ListTodo, label: "Actions", path: "/actions" },
          { icon: FileText, label: "Documents", path: "/documents" },
          { icon: Users, label: "Meetings", path: "/meetings" },
          { icon: Bell, label: "Notifications", path: "/notifications" }
        );
        break;

      case "project_manager":
        items.push(
          { icon: FolderKanban, label: "Portfolio", path: "/portfolio" },
          { icon: AlertCircle, label: "Issues", path: "/issues" },
          { icon: ListTodo, label: "Actions", path: "/actions" },
          { icon: FileText, label: "Documents", path: "/documents" },
          { icon: Users, label: "Meetings", path: "/meetings" },
          { icon: Bell, label: "Notifications", path: "/notifications" }
        );
        break;

      case "project_officer":
        items.push(
          { icon: FolderKanban, label: "Portfolio", path: "/portfolio" },
          { icon: ListTodo, label: "Actions", path: "/actions" },
          { icon: FileText, label: "Documents", path: "/documents" },
          { icon: Bell, label: "Notifications", path: "/notifications" }
        );
        break;

      case "system_admin":
        items.push({
          icon: Users,
          label: "User Management",
          path: "/user-management",
        });
        break;
    }

    return items;
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen bg-card border-r border-border z-50 transition-all duration-300",
          isOpen ? "w-64" : "w-0 lg:w-16"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-border">
            {isOpen && (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    src="/logo.png"
                    alt="PROVEN"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const el = e.currentTarget as HTMLImageElement;
                      el.style.display = "none";
                    }}
                  />
                </div>
                <span className="font-bold text-lg">PROVEN</span>
              </div>
            )}
            <button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-muted transition-smooth hidden lg:flex"
            >
              <ChevronLeft
                className={cn(
                  "w-5 h-5 transition-transform",
                  !isOpen && "rotate-180"
                )}
              />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-9 rounded-md bg-muted animate-pulse"
                  />
                ))}
              </div>
            ) : (
              navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted transition-smooth"
                  activeClassName="bg-primary/10 text-primary font-medium hover:bg-primary/15"
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {isOpen && <span>{item.label}</span>}
                </NavLink>
              ))
            )}
          </nav>

          {/* User Info */}
          {isOpen && user && (
            <div className="p-4 border-t border-border">
              <div className="text-sm">
                <p className="font-medium truncate">{user.name}</p>
                <p className="text-muted-foreground text-xs truncate">
                  {user.email}
                </p>
                <p className="text-primary text-xs mt-1 capitalize">
                  {user.role ? user.role.replace("_", " ") : "guest"}
                </p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
