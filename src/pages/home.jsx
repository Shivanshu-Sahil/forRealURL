import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight,
  Zap,
  BarChart3,
  Lock,
  Link2,
  QrCode,
  Shield,
  Globe,
  Sparkles,
} from 'lucide-react';

const Home = () => {
  const [longUrl, setLongUrl] = useState('');
  const navigate = useNavigate();

  // ORIGINAL FUNCTIONALITY: Navigate to auth with URL param
  const handleShorten = (e) => {
    e.preventDefault();
    if (longUrl) {
      navigate(`/auth?createNew=${encodeURIComponent(longUrl)}`);
    }
  };

  const features = [
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Track clicks, locations, devices, and referrers in real-time with beautiful dashboards.",
      color: "bg-neo-pink",
      size: "md:col-span-2",
    },
    {
      icon: QrCode,
      title: "QR Codes",
      description: "Generate customizable QR codes for every link instantly.",
      color: "bg-neo-blue",
      size: "",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Sub-millisecond redirects powered by edge computing.",
      color: "bg-neo-yellow",
      size: "",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "SSL encryption, malware detection, and link expiration controls.",
      color: "bg-neo-green",
      size: "",
    },
    {
      icon: Globe,
      title: "Custom Domains",
      description: "Use your own branded domains for professional short links.",
      color: "bg-neo-coral",
      size: "md:col-span-2",
    },
    {
      icon: Lock,
      title: "Unlimited Links",
      description: "Create unlimited shortened URLs with our free service. All features available to all users.",
      color: "bg-neo-purple",
      size: "",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Yellow Background */}
      <section className="relative py-16 md:py-24 bg-neo-yellow border-b-3 border-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-card border-3 border-foreground shadow-neo mb-8 animate-bounce-in">
              <Sparkles className="w-4 h-4 text-foreground" />
              <span className="text-sm font-bold text-foreground uppercase tracking-wide">
                Trusted by 100,000+ marketers
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display mb-6 animate-fade-in-delay-1 -rotate-1">
              <span className="text-foreground">Shorten Your Links,</span>
              <br />
              <span className="text-foreground bg-neo-pink px-4 inline-block rotate-1 border-3 border-foreground shadow-neo mt-2">
                Expand Your Reach
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-foreground font-medium max-w-2xl mx-auto mb-10 animate-fade-in-delay-2">
              Transform long, ugly URLs into powerful, trackable short links. Get deep insights into who's clicking and supercharge your marketing campaigns.
            </p>

            {/* URL Shortener Input - ORIGINAL FUNCTIONALITY */}
            <form onSubmit={handleShorten} className="animate-fade-in-delay-3">
              <div className="max-w-2xl mx-auto">
                <div className="bg-card border-3 border-foreground shadow-neo-xl p-3 flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground" />
                    <Input
                      type="url"
                      placeholder="Paste your long URL here..."
                      value={longUrl}
                      onChange={(e) => setLongUrl(e.target.value)}
                      className="pl-12 h-14"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="h-14 bg-neo-pink text-foreground border-3 border-foreground shadow-neo hover:shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px]"
                  >
                    Shorten
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </form>

            {/* CTA Text */}
            <p className="mt-6 text-sm text-foreground font-medium animate-fade-in-delay-3">
              All features included • Completely free
            </p>
          </div>
        </div>
      </section>


      {/* Features Section - Bento Grid */}
      <section className="py-16 md:py-24 bg-background border-t-3 border-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display mb-4">
              Everything you need to{" "}
              <span className="bg-neo-blue px-3 border-3 border-foreground shadow-neo-sm inline-block rotate-1">
                dominate
              </span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
              Powerful features designed for modern marketers, developers, and creators who demand excellence.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`${feature.color} border-3 border-foreground shadow-neo p-6 md:p-8 hover:shadow-neo-xl hover:-translate-x-1 hover:-translate-y-1 transition-all cursor-default ${feature.size}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 bg-card border-3 border-foreground shadow-neo-sm flex items-center justify-center mb-5">
                  <feature.icon className="w-7 h-7 text-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 uppercase tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-foreground font-medium">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Coral background */}
      <section className="py-16 md:py-24 bg-neo-coral border-t-3 border-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-card border-3 border-foreground shadow-neo-xl p-8 md:p-16">
              <h2 className="text-3xl md:text-5xl font-display mb-6">
                Ready to transform your{" "}
                <span className="bg-neo-yellow px-3 border-3 border-foreground inline-block -rotate-1">
                  link strategy
                </span>
                ?
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8 font-medium">
                Join thousands of marketers who trust forReal.URL to power their campaigns. Start free, scale as you grow.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/auth">
                  <Button size="lg" className="bg-neo-yellow text-foreground border-3 border-foreground shadow-neo hover:shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px]">
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline" size="lg">
                    View Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;