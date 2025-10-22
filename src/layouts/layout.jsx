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
      <footer className="p-10 text-center bg-gray-900 mt-10 border-t border-gray-800">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
          <span>Created with</span>
          <Heart className="h-4 w-4 text-orange-500 fill-orange-500/30" />
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;