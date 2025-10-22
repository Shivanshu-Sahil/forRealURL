import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ArrowRight, Zap, BarChart3, Lock } from 'lucide-react';

const Home = () => {
  const [longUrl, setLongUrl] = useState('');
  const navigate = useNavigate();

  const handleShorten = (e) => {
    e.preventDefault();
    if (longUrl) {
      navigate(`/auth?createNew=${encodeURIComponent(longUrl)}`);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="w-full px-4 py-16 md:py-24 flex flex-col items-center justify-center">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Transform Long URLs into
              <span className="block bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Shareable Links
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
              Create, track, and manage your shortened URLs with powerful analytics. Fast, reliable, and easy to use.
            </p>
          </div>

          {/* URL Shortening Form */}
          <form onSubmit={handleShorten} className="w-full max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="url"
                placeholder="Paste your long URL here..."
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                className="h-12 flex-1 px-4 text-base bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
                required
              />
              <Button
                type="submit"
                size="lg"
                className="h-12 px-6 whitespace-nowrap gap-2 bg-orange-500 hover:bg-orange-600 text-gray-950"
              >
                Shorten
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* CTA Text */}
          <p className="text-sm text-gray-500">
            All features included • Completely free
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full px-4 py-16 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Why Choose forReal.URL?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-orange-500 transition-colors">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Lightning Fast
              </h3>
              <p className="text-gray-400 text-sm">
                Create shortened URLs instantly with our optimized infrastructure.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-orange-500 transition-colors">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Advanced Analytics
              </h3>
              <p className="text-gray-400 text-sm">
                Track clicks, geolocation, device types, and more with detailed insights.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-orange-500 transition-colors">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Secure & Reliable
              </h3>
              <p className="text-gray-400 text-sm">
                Your data is protected with industry-standard security measures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full px-4 py-16 bg-gray-950">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-gray-800">
              <AccordionTrigger className="text-lg font-medium text-white hover:text-orange-400">
                How does forReal.URL work?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                When you enter a long URL, our system generates a unique shortened version. 
                This shortened URL redirects to your original URL when accessed. You can track 
                all clicks and interactions through your dashboard.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-gray-800">
              <AccordionTrigger className="text-lg font-medium text-white hover:text-orange-400">
                Do I need an account to use forReal.URL?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                Yes, creating a free account allows you to manage your URLs, view analytics, 
                and customize your short URLs with access to all features.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-gray-800">
              <AccordionTrigger className="text-lg font-medium text-white hover:text-orange-400">
                What analytics are available?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                You get access to comprehensive analytics including: total clicks, geographic 
                distribution, device types (mobile/desktop/tablet), browser information, 
                referrer data, and click timeline. All presented in an easy-to-read dashboard.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-gray-800">
              <AccordionTrigger className="text-lg font-medium text-white hover:text-orange-400">
                How many URLs can I shorten?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                You can create unlimited shortened URLs with our free service. All features 
                are available to all users with no limitations.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  );
};

export default Home;