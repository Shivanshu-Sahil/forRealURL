import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Link as LinkIcon, Plus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UrlState } from '@/context/index';
import { logout as logoutAPI } from '@/db/apiAuth';
import useFetch from '@/hooks/use-fetch';

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, fetchUser } = UrlState();
  const { loading: isLoggingOut, execute: fnLogout } = useFetch(logoutAPI);

  const handleLogout = () => {
    fnLogout().then(() => {
      fetchUser();
      navigate("/");
    }).catch((error) => {
      console.error("Logout error:", error);
    });
  };

  return (
    <header className="border-b border-gray-800 bg-gray-950 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo/Brand */}
        <Link 
          to="/" 
          className="flex items-center gap-2 group"
        >
          <div className="p-2 bg-orange-500 rounded-lg group-hover:bg-orange-600 transition-colors">
            <LinkIcon className="h-5 w-5 text-gray-950" />
          </div>
          <span className="text-xl font-semibold text-white">forReal.URL</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link 
            to="/" 
            className="text-sm font-medium text-gray-400 hover:text-orange-400 transition-colors"
          >
            Home
          </Link>
          <Link 
            to="/dashboard" 
            className="text-sm font-medium text-gray-400 hover:text-orange-400 transition-colors flex items-center gap-1"
          >
            <LinkIcon className="h-4 w-4" />
            Dashboard
          </Link>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="gap-2 border-gray-700 text-gray-300 hover:bg-gray-800 transition-all duration-200 animate-in fade-in slide-in-from-right-2"
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
              className="bg-red-600 hover:bg-red-700 text-white transition-all duration-200 animate-in fade-in slide-in-from-right-2 gap-2"
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
                className="gap-2 border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Create</span>
              </Button>
              <Button 
                size="sm"
                onClick={() => navigate("/auth")}
                className="bg-orange-500 hover:bg-orange-600 text-gray-950"
              >
                Sign In
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;