import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Link as LinkIcon, Plus, LogOut, Menu, X, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UrlState } from '@/context/index';
import { logout as logoutAPI } from '@/db/apiAuth';
import useFetch from '@/hooks/use-fetch';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, fetchUser } = UrlState();
  const { loading: isLoggingOut, execute: fnLogout } = useFetch(logoutAPI);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    fnLogout().then(() => {
      fetchUser(); // CRITICAL: Update auth state after logout
      navigate("/");
    }).catch((error) => {
      console.error("Logout error:", error);
    });
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/linktree", label: "Linktree" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`bg-card border-b-3 border-foreground sticky top-0 z-50 transition-all duration-200 ${isScrolled ? "shadow-neo" : ""
        }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-neo-yellow border-3 border-foreground shadow-neo-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
            <LinkIcon className="h-5 w-5 text-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">forReal.URL</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-4 py-2 text-sm font-bold uppercase tracking-wide border-3 border-foreground shadow-neo-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all ${isActive(link.href)
                ? "bg-neo-pink"
                : "bg-card hover:bg-muted"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="gap-2 neo-button bg-neo-green text-foreground"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create</span>
            </Button>
          )}
          {isAuthenticated ? (
            <Button
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="neo-button bg-destructive text-destructive-foreground gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">{isLoggingOut ? "Logging out..." : "Logout"}</span>
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="gap-2 neo-button bg-card text-foreground"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Create</span>
              </Button>
              <Button
                size="sm"
                onClick={() => navigate("/auth")}
                className="neo-button bg-primary text-primary-foreground"
              >
                Sign In
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 border-3 border-foreground bg-card shadow-neo-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-neo-cream border-b-3 border-foreground animate-slide-up">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-3 text-sm font-bold uppercase tracking-wide border-3 border-foreground shadow-neo-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all ${isActive(link.href)
                  ? "bg-neo-pink"
                  : "bg-card hover:bg-muted"
                  }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t-3 border-foreground my-2" />
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    navigate("/dashboard");
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-4 py-3 text-sm font-bold uppercase bg-neo-green border-3 border-foreground text-left flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create Link
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  disabled={isLoggingOut}
                  className="px-4 py-3 text-sm font-bold uppercase bg-destructive text-destructive-foreground border-3 border-foreground text-left flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate("/dashboard");
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-4 py-3 text-sm font-bold uppercase bg-card border-3 border-foreground hover:bg-muted text-left flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create
                </button>
                <button
                  onClick={() => {
                    navigate("/auth");
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-4 py-3 text-sm font-bold uppercase bg-primary text-primary-foreground border-3 border-foreground text-center"
                >
                  Sign In
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;