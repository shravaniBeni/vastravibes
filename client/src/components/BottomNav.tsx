import { Link, useLocation } from "react-router-dom";
import { Home, Search, Play, MessageCircle, Heart, User, ShoppingBag } from "lucide-react";

const BottomNav = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { icon: Home, path: "/", label: "Home" },
    { icon: Play, path: "/reels", label: "Reels" },
    { icon: MessageCircle, path: "/message", label: "Messages" },
    { icon: User, path: "/login", label: "Profile" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
            isActive("/") ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>

        {/* Reels */}
        <Link
          to="/reels"
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
            isActive("/reels") ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Play className="h-5 w-5" />
          <span className="text-xs mt-1">Reels</span>
        </Link>

        {/* Create - Center Floating Button */}
        <Link
          to="/create"
          className="flex flex-col items-center justify-center bg-primary text-primary-foreground rounded-full p-3 shadow-lg transform translate-y-[-8px] transition-all hover:scale-110"
        >
          <div className="bg-primary rounded-full p-2">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </Link>

        {/* Messages */}
        <Link
          to="/message"
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
            isActive("/message") ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-xs mt-1">Messages</span>
        </Link>

        {/* Profile */}
        <Link
          to="/login"
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
            isActive("/login") ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNav;