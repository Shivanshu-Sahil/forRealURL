import Header from "@/components/header";
import { Outlet } from "react-router-dom";
import { Heart } from "lucide-react";

const AppLayout = () => {
  return (
    <div className="bg-gray-950 min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto">
          <Outlet />
        </div>
      </main>
      <footer className="bg-gray-900/50 border-t border-gray-800 mt-10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:grid md:grid-cols-3 items-center gap-6">
            
            {/* Left Section - Brand + Made with */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Brand */}
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  Shivanshu Sahil
                </h3>
              </div>

              {/* Made with heart */}
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Created with</span>
                <Heart className="h-4 w-4 text-orange-500 fill-orange-500/30" />
              </div>
            </div>

            {/* Center Section - Copyright */}
            <div className="text-sm text-gray-400 text-center">
              <p>© {new Date().getFullYear()} Shivanshu Sahil. All rights reserved.</p>
            </div>

            {/* Right Section - Empty for grid balance */}
            <div className="hidden md:block"></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;