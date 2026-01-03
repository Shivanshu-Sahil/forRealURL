import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Link2, ArrowLeft } from "lucide-react";
import Login from "@/components/login";
import Signup from "@/components/signup";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState(initialMode);

  const testimonials = [
    {
      quote: "forReal.URL transformed how we track our marketing campaigns. The analytics are unmatched.",
      author: "Sarah Chen",
      role: "Head of Marketing, TechCorp",
    },
    {
      quote: "Finally, a link shortener that looks as good as it performs. Our clients love the branded links.",
      author: "Marcus Williams",
      role: "Creative Director, BrandStudio",
    },
    {
      quote: "The API integration was seamless. We shortened 1M links in our first month.",
      author: "Alex Rivera",
      role: "Lead Developer, StartupX",
    },
  ];

  const [currentTestimonial] = useState(0);

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Marketing / Testimonials (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-neo-coral border-r-3 border-foreground">
        {/* Scattered shapes */}
        <div className="absolute top-20 right-20 w-24 h-24 bg-neo-yellow border-3 border-foreground rotate-12" />
        <div className="absolute bottom-40 left-20 w-32 h-32 bg-neo-pink border-3 border-foreground rounded-full" />
        <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-neo-blue border-3 border-foreground -rotate-12" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group w-fit">
            <div className="w-10 h-10 bg-foreground border-3 border-foreground flex items-center justify-center">
              <Link2 className="w-5 h-5 text-neo-yellow" />
            </div>
            <span className="text-xl font-display text-foreground">
              forReal.URL
            </span>
          </Link>

          {/* Testimonial */}
          <div className="max-w-md">
            <div className="bg-card border-3 border-foreground shadow-neo-xl p-8 -rotate-1">
              <blockquote className="text-xl font-bold text-foreground leading-relaxed mb-6">
                "{testimonials[currentTestimonial].quote}"
              </blockquote>
              <div>
                <p className="font-bold text-foreground">
                  {testimonials[currentTestimonial].author}
                </p>
                <p className="text-muted-foreground font-medium">
                  {testimonials[currentTestimonial].role}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            <div className="bg-neo-yellow border-3 border-foreground shadow-neo p-4">
              <p className="text-2xl font-display text-foreground">10B+</p>
              <p className="text-xs font-bold text-foreground uppercase">Links</p>
            </div>
            <div className="bg-neo-blue border-3 border-foreground shadow-neo p-4">
              <p className="text-2xl font-display text-foreground">150+</p>
              <p className="text-xs font-bold text-foreground uppercase">Countries</p>
            </div>
            <div className="bg-neo-green border-3 border-foreground shadow-neo p-4">
              <p className="text-2xl font-display text-foreground">99.99%</p>
              <p className="text-xs font-bold text-foreground uppercase">Uptime</p>
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

          {/* Footer text */}
          <p className="text-center text-sm text-muted-foreground mt-6 font-medium">
            By continuing, you agree to our{" "}
            <a href="#" className="text-foreground font-bold underline underline-offset-4">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-foreground font-bold underline underline-offset-4">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;