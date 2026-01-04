import { useState, useEffect } from "react";
import { Search, Link as LinkIcon, Zap, BarChart3, Copy, Download, Trash, ExternalLink, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Error from "@/components/error";
import { Link } from "react-router-dom";

import useFetch from "@/hooks/use-fetch";
import { getUrls } from "@/db/apiUrls";
import { getClicksForUrls } from "@/db/apiClicks";
import { deleteUrl } from "@/db/apiUrls";
import { UrlState } from "@/context";
import { CreateLink } from "@/components/create-link";
import { copyToClipboard } from "@/lib/copyToClipboard";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const { user, loading: userLoading } = UrlState();

  const { loading, error, data: urls, fn: fnUrls } = useFetch(getUrls, []);

  const {
    loading: loadingClicks,
    data: clicks,
    fn: fnClicks,
  } = useFetch(getClicksForUrls, []);

  useEffect(() => {
    if (user?.id) {
      fnUrls(user.id);
    }
  }, [user?.id]);

  useEffect(() => {
    if (urls?.length) {
      const urlIds = urls.map((url) => url.id);
      fnClicks(urlIds);
    }
  }, [urls?.length]);

  const filteredUrls = Array.isArray(urls)
    ? urls.filter((url) =>
      url?.title?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  // Safely calculate total clicks
  const totalClicks = Array.isArray(clicks) && clicks.length > 0 ? clicks.length : 0;
  const avgClicks = filteredUrls.length > 0 ? Math.round(totalClicks / filteredUrls.length) : 0;

  // Handle copy with visual feedback
  const handleCopy = (id, shortUrl) => {
    copyToClipboard(shortUrl, '✓ URL copied to clipboard!');
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Handle delete
  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, null);

  const handleDelete = async (urlId) => {
    try {
      await fnDelete(urlId);
      fnUrls(user.id);
    } catch (error) {
      console.error("Error deleting URL:", error);
    }
  };

  // Download QR code
  const downloadImage = (qrUrl, title) => {
    const anchor = document.createElement("a");
    anchor.href = qrUrl;
    anchor.download = title;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-foreground border-t-primary animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <Error message={error?.message} />;
  }

  const stats = [
    { label: "Total Links", value: loading ? "..." : urls?.length || 0, icon: LinkIcon, color: "bg-neo-yellow" },
    { label: "Total Clicks", value: loadingClicks ? "..." : totalClicks, icon: BarChart3, color: "bg-neo-pink" },
    { label: "Avg Clicks", value: loadingClicks ? "..." : avgClicks, icon: Zap, color: "bg-neo-green" },
  ];

  // Alternating colors for link cards
  const linkColors = ["bg-neo-cream", "bg-card"];

  // Get base URL and construct full short URL
  const baseUrl = import.meta.env.VITE_CUSTOM_URL || window.location.origin;
  const getFullShortUrl = (url) => {
    const shortUrlPath = url?.custom_url || url?.short_url;
    return `${baseUrl}/${shortUrlPath}`;
  };
  const getDisplayUrl = (url) => {
    const shortUrlPath = url?.custom_url || url?.short_url;
    return new URL(baseUrl).hostname + "/" + shortUrlPath;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl sm:text-5xl font-display text-foreground mb-2">
              {user?.user_metadata?.name
                ? <>{user.user_metadata.name}'s Dashboard</>
                : <>{user?.email?.split('@')[0] || 'My'} Dashboard</>
              }
            </h1>
            <p className="text-muted-foreground font-medium">
              Manage and track your shortened URLs
            </p>
          </div>
          <CreateLink />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`${stat.color} border-3 border-foreground shadow-neo p-6 hover:shadow-neo-xl hover:-translate-x-1 hover:-translate-y-1 transition-all animate-bounce-in`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-card border-3 border-foreground flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-foreground" />
                </div>
              </div>
              <p className="text-3xl font-display text-foreground mb-1">{stat.value}</p>
              <p className="text-sm font-bold text-foreground uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Search Section */}
        <div className="bg-card border-3 border-foreground shadow-neo p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground" />
            <Input
              type="text"
              placeholder="Search your links..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>
        </div>

        {/* Links List */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-16 h-16 border-4 border-foreground border-t-primary animate-spin"></div>
            </div>
          ) : filteredUrls.length > 0 ? (
            filteredUrls.map((url, index) => (
              <div
                key={url.id}
                className={`${linkColors[index % 2]} border-3 border-foreground shadow-neo p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-neo-xl hover:-translate-x-1 hover:-translate-y-1 transition-all`}
              >
                <Link to={`/link/${url.id}`} className="flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity">
                  <p className="font-bold text-lg text-foreground mb-1 truncate">{url?.title}</p>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 bg-neo-pink border-2 border-foreground flex items-center justify-center">
                      <LinkIcon className="w-3 h-3 text-foreground" />
                    </div>
                    <span className="font-bold text-foreground text-sm">{getDisplayUrl(url)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate font-medium">{url?.org_url}</p>
                  <p className="text-xs text-muted-foreground mt-1 font-bold uppercase">
                    {new Date(url?.created_at).toLocaleString()}
                  </p>
                </Link>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-display text-xl text-foreground">
                      {clicks?.filter(click => click.url_id === url.id).length || 0}
                    </p>
                    <p className="text-xs text-muted-foreground font-bold uppercase">clicks</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 border-2 border-foreground bg-neo-green hover:bg-neo-green/80"
                      onClick={() => handleCopy(url.id, getFullShortUrl(url))}
                    >
                      {copiedId === url.id ? (
                        <Check className="w-4 h-4 text-foreground" />
                      ) : (
                        <Copy className="w-4 h-4 text-foreground" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 border-2 border-foreground bg-neo-blue hover:bg-neo-blue/80"
                      onClick={() => downloadImage(url?.qr, url?.title)}
                    >
                      <Download className="w-4 h-4 text-foreground" />
                    </Button>
                    <a href={getFullShortUrl(url)} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon" className="h-10 w-10 border-2 border-foreground bg-neo-yellow hover:bg-neo-yellow/80">
                        <ExternalLink className="w-4 h-4 text-foreground" />
                      </Button>
                    </a>
                    <Link to={`/link/${url.id}`}>
                      <Button variant="ghost" size="icon" className="h-10 w-10 border-2 border-foreground bg-neo-pink hover:bg-neo-pink/80">
                        <BarChart3 className="w-4 h-4 text-foreground" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 border-2 border-foreground bg-red-500 hover:bg-red-600"
                      onClick={() => handleDelete(url.id)}
                      disabled={loadingDelete}
                    >
                      {loadingDelete ? (
                        <div className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Trash className="w-4 h-4 text-white" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-card border-3 border-foreground shadow-neo p-12 text-center">
              <div className="w-16 h-16 bg-neo-yellow border-3 border-foreground mx-auto mb-4 flex items-center justify-center">
                <LinkIcon className="w-8 h-8 text-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2 uppercase">
                No links found
              </h3>
              <p className="text-muted-foreground font-medium mb-4">
                {searchQuery ? "Try adjusting your search" : "Create your first link to get started"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
