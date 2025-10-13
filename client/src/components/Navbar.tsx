import { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingBag, Play, Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MyContext } from "../context/myContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/FirebaseConfig";
import { useEffect } from "react";
import ProfileModal from "./ProfileSetupModal";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const { loading, firestoreUser, isProfileComplete, currentUser } =
    useContext(MyContext);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    // Only show modal if user exists AND profile is incomplete
    if (firestoreUser && !isProfileComplete) {
      setShowProfileModal(true);
    }
  }, [firestoreUser, isProfileComplete]);

  if (loading) {
    return (
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="container-custom flex h-16 items-center justify-center">
          <p>Loading...</p>
        </div>
      </header>
    );
  }

  const isActive = (path: string) => location.pathname === path;

  const leftNavItems = [
    { name: "Shop", path: "/shop" },
    { name: "About Us", path: "/about" },
    { name: "Home", path: "/" },
    { name: "Thrift", path: "/thrift" },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  // console.log("currentUser:", currentUser);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login")
    setDropdownOpen(false);
  };

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      {showProfileModal && (
        <ProfileModal
          firestoreUser={firestoreUser}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      <div className="container-custom">
        <div className="flex h-16 items-center justify-between">
          {/* Left Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {leftNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${isActive(item.path)
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground"
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link
              to="/"
              className="text-2xl font-serif font-semibold text-foreground hover:text-gray-600 transition-colors"
            >
              VastraVibes
            </Link>
          </div>

          {/* Mobile Icons */}
          <div className="md:hidden flex items-center space-x-2">
            <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Search className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <div className="flex flex-col space-y-6 mt-6">
                  <Link to="/" className="text-xl font-serif font-semibold">
                    VastraVibes
                  </Link>
                  <nav className="flex flex-col space-y-4">
                    {leftNavItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={`text-lg font-medium transition-colors hover:text-primary ${isActive(item.path)
                          ? "text-primary"
                          : "text-muted-foreground"
                          }`}
                        onClick={() => setIsSearchOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Heart className="h-4 w-4" />
              </Button>
            </Link>

            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative h-8 w-8">
                <ShoppingBag className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center text-[10px]">
                  0
                </span>
              </Button>
            </Link>
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/reels">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground h-8 w-8"
              >
                <Play className="h-4 w-4" />
              </Button>
            </Link>

            <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground h-8 w-8"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-6 mt-6">
                  <h2 className="text-xl font-serif font-semibold">
                    Navigation
                  </h2>
                  <nav className="flex flex-col space-y-4">
                    {leftNavItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={`text-lg font-medium transition-colors hover:text-primary ${isActive(item.path)
                          ? "text-primary"
                          : "text-muted-foreground"
                          }`}
                        onClick={() => setIsSearchOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            {/* Profile / User */}
            {currentUser ? (
              <div className="relative">
                <div
                  className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium cursor-pointer"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {getInitials(currentUser.displayName || "User")}
                </div>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-md z-50">
                    <Link
                      to={`/designer/${currentUser?.uid}`}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground h-8 w-8"
                >
                  <User className="h-4 w-4" />
                </Button>
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground relative h-8 w-8"
              >
                <ShoppingBag className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                  0
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
