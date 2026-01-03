import Header from "@/components/header";
import { Outlet } from "react-router-dom";
import { Heart, Link2 } from "lucide-react";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Geometric pattern background */}
      <div className="fixed inset-0 pattern-dots pointer-events-none opacity-30" />

      {/* Scattered shapes for playful neobrutalism feel */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Yellow blob */}
        <div
          className="absolute -top-20 -right-20 w-64 h-64 bg-neo-yellow border-3 border-foreground rotate-12 opacity-50"
          style={{ borderRadius: '60% 40% 70% 30%' }}
        />
        {/* Pink square */}
        <div
          className="absolute top-1/3 -left-16 w-32 h-32 bg-neo-pink border-3 border-foreground -rotate-12 opacity-40"
        />
        {/* Blue circle */}
        <div
          className="absolute bottom-20 right-1/4 w-24 h-24 bg-neo-blue border-3 border-foreground rounded-full opacity-40"
        />
        {/* Green shape */}
        <div
          className="absolute bottom-1/3 -right-10 w-40 h-40 bg-neo-green border-3 border-foreground rotate-45 opacity-30"
        />
      </div>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="relative z-10 flex-1">
        <div className="container mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t-3 border-foreground mt-20 bg-neo-yellow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:grid md:grid-cols-3 items-center gap-6">

            {/* Left Section - Brand + Made with */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Brand */}
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Shivanshu Sahil
                </h3>
              </div>

              {/* Made with heart */}
              <div className="flex items-center gap-2 text-sm text-foreground font-bold">
                <span>Created with</span>
                <Heart className="h-4 w-4 text-destructive fill-destructive" />
              </div>
            </div>

            {/* Center Section - Copyright */}
            <div className="text-sm text-foreground font-bold text-center">
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