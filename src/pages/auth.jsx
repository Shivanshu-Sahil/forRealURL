import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Link2, ArrowLeft, BarChart3, Link2Icon, LinkIcon } from "lucide-react";
import Login from "@/components/login";
import Signup from "@/components/signup";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState(initialMode);

  return (
    <div className="min-h-[calc(100vh-80px)] flex -mb-20">
      {/* Left Side - Features Showcase (Hidden on mobile) */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden border-r-3 border-neo-cream"
        style={{ backgroundColor: '#0a0a0a' }}
      >
        {/* Dotted neobrutalist background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Scattered shapes with animations */}
        <div className="absolute top-20 right-20 w-24 h-24 bg-neo-yellow border-3 border-neo-cream rotate-12 animate-float" />
        <div className="absolute bottom-40 left-20 w-32 h-32 bg-neo-pink border-3 border-neo-cream rounded-full animate-float-delayed" />
        <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-neo-blue border-3 border-neo-cream -rotate-12 animate-float" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group w-fit">
            <div className="w-10 h-10 bg-neo-cream border-3 border-neo-cream flex items-center justify-center">
              <LinkIcon className="w-8 h-8 text-neo-coral" />
            </div>
            <span className="text-xl font-bold text-neo-coral">
              forReal.URL
            </span>
          </Link>

          {/* Features Grid */}
          <div className="bg-neo-cream border-3 border-neo-cream shadow-neo-lg p-6 space-y-4">
            <h2 className="text-2xl font-bold text-neo-black mb-6">
              Powerful Features
            </h2>

            <div className="bg-neo-yellow border-3 border-neo-cream shadow-neo p-4 -rotate-1 hover:shadow-neo-lg hover:-translate-x-1 hover:-translate-y-1 transition-all cursor-default">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neo-black border-3 border-neo-cream flex items-center justify-center">
                  <Link2 className="w-5 h-5 text-neo-yellow" />
                </div>
                <div>
                  <p className="font-bold text-foreground">Custom Short Links</p>
                  <p className="text-sm text-muted-foreground">Create branded, memorable URLs</p>
                </div>
              </div>
            </div>

            <div className="bg-neo-pink border-3 border-neo-cream shadow-neo p-4 rotate-1 hover:shadow-neo-lg hover:-translate-x-1 hover:-translate-y-1 transition-all cursor-default">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neo-black border-3 border-neo-cream flex items-center justify-center">
                  <svg className="w-5 h-5 text-neo-pink" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="4" height="4" />
                    <rect x="19" y="14" width="2" height="2" />
                    <rect x="14" y="19" width="2" height="2" />
                    <rect x="19" y="19" width="2" height="2" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-foreground">QR Code Generator</p>
                  <p className="text-sm text-muted-foreground">Download QR codes instantly</p>
                </div>
              </div>
            </div>

            <div className="bg-neo-green border-3 border-neo-cream shadow-neo p-4 -rotate-1 hover:shadow-neo-lg hover:-translate-x-1 hover:-translate-y-1 transition-all cursor-default">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neo-black border-3 border-neo-cream flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-neo-green" />
                </div>
                <div>
                  <p className="font-bold text-foreground">Click Analytics</p>
                  <p className="text-sm text-muted-foreground">Track link performance in real-time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            <div className="bg-neo-yellow border-3 border-neo-cream shadow-neo p-4 hover:shadow-neo-lg hover:-translate-x-1 hover:-translate-y-1 transition-all cursor-default">
              <p className="text-2xl font-display text-neo-black">∞</p>
              <p className="text-xs font-bold text-neo-black uppercase">Links</p>
            </div>
            <div className="bg-neo-blue border-3 border-neo-cream shadow-neo p-4 hover:shadow-neo-lg hover:-translate-x-1 hover:-translate-y-1 transition-all cursor-default">
              <p className="text-2xl font-display text-neo-black">Free</p>
              <p className="text-xs font-bold text-neo-black uppercase">Forever</p>
            </div>
            <div className="bg-neo-green border-3 border-neo-cream shadow-neo p-4 hover:shadow-neo-lg hover:-translate-x-1 hover:-translate-y-1 transition-all cursor-default">
              <p className="text-2xl font-display text-neo-black">1-Click</p>
              <p className="text-xs font-bold text-neo-black uppercase">Actions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 bg-background">
        {/* Mobile Logo */}
        <div className="lg:hidden mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-neo-yellow border-3 border-foreground shadow-neo-sm flex items-center justify-center">
              <Link2 className="w-5 h-5 text-foreground" />
            </div>
            <span className="text-xl font-display text-foreground">
              forReal.URL
            </span>
          </Link>
        </div>

        {/* Back link */}
        <Link
          to="/"
          className="self-start mb-8 flex items-center gap-2 text-foreground font-bold hover:underline underline-offset-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        {/* Form Container */}
        <div className="w-full max-w-md">
          <div className="bg-card border-3 border-foreground shadow-neo-xl p-8">
            {/* Tab Switcher */}
            <div className="flex gap-0 mb-8 border-3 border-foreground">
              <button
                onClick={() => setMode("login")}
                className={`flex-1 py-3 px-4 text-sm font-bold uppercase tracking-wide transition-all border-r-3 border-foreground ${mode === "login"
                  ? "bg-neo-pink text-foreground"
                  : "bg-muted text-muted-foreground hover:bg-secondary"
                  }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode("signup")}
                className={`flex-1 py-3 px-4 text-sm font-bold uppercase tracking-wide transition-all ${mode === "signup"
                  ? "bg-neo-pink text-foreground"
                  : "bg-muted text-muted-foreground hover:bg-secondary"
                  }`}
              >
                Create Account
              </button>
            </div>

            {/* Form */}
            {mode === "login" ? <Login /> : <Signup />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;