import { useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download, LinkIcon, Trash, ExternalLink } from "lucide-react";
import { UrlState } from "@/context";
import useFetch from "@/hooks/use-fetch";
import { getUrl, deleteUrl } from "@/db/apiUrls";
import { getClicksForUrl } from "@/db/apiClicks";
import DeviceStats from "@/components/deviceStats";
import LocationStats from "@/components/locationStats";
import { copyToClipboard } from "@/lib/copyToClipboard";

const Link = () => {
  const navigate = useNavigate();
  const { user } = UrlState();
  const { id } = useParams();

  // Fetch URL details
  const {
    loading,
    data: url,
    fn: fetchUrl,
    error,
  } = useFetch(getUrl, null);

  // Fetch click statistics
  const {
    loading: loadingStats,
    data: stats,
    fn: fetchStats,
  } = useFetch(getClicksForUrl, null);

  // Delete URL
  const {
    loading: loadingDelete,
    fn: deleteUrlFn,
  } = useFetch(deleteUrl, null);

  // Download QR code function
  const downloadImage = () => {
    const imageUrl = url?.qr;
    if (!imageUrl) return;

    const fileName = `${url?.title || 'qrcode'}.png`;
    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  // Fetch URL on component mount - using useCallback to prevent recreation on every render
  const fetchUrlData = useCallback(() => {
    if (user?.id && id) {
      fetchUrl({ id, user_id: user.id });
    }
  }, [user?.id, id]);

  // Fetch stats after URL is loaded - using useCallback to prevent recreation on every render
  const fetchStatsData = useCallback(() => {
    if (!error && !loading && url?.id) {
      fetchStats(url.id);
    }
  }, [error, loading, url?.id]);

  // Initial data loading
  useEffect(() => {
    fetchUrlData();
  }, [fetchUrlData]);

  // Fetch stats when URL is loaded
  useEffect(() => {
    fetchStatsData();
  }, [fetchStatsData]);

  // Redirect to dashboard on error
  useEffect(() => {
    if (error) {
      navigate("/dashboard");
    }
  }, [error, navigate]);

  // Generate full URL
  const baseUrl = window.location.origin;
  const shortUrlSuffix = url?.custom_url || url?.short_url;
  const fullShortUrl = shortUrlSuffix ? `${baseUrl}/${shortUrlSuffix}` : "";

  // Handle URL deletion
  const handleDelete = async () => {
    try {
      await deleteUrlFn(id);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting URL:", error);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Loading indicator */}
      {(loading || loadingStats) && (
        <div className="w-full h-2 mb-4 bg-muted border-2 border-foreground overflow-hidden">
          <div className="h-full bg-primary animate-pulse"></div>
        </div>
      )}

      <div className="flex flex-col gap-8 lg:flex-row justify-between">
        {/* URL Details Section */}
        <div className="flex flex-col items-start gap-6 lg:w-2/5">
          <button
            className="text-4xl sm:text-5xl font-display text-foreground bg-neo-coral border-3 border-foreground shadow-neo px-6 py-3 hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all text-left"
            onClick={() => copyToClipboard(url?.title || '', '✓ Title copied!')}
          >
            {url?.title || "Loading..."}
          </button>

          {url && (
            <>
              <a
                href={fullShortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl sm:text-3xl text-primary font-bold hover:underline underline-offset-4 flex items-center gap-2"
              >
                {fullShortUrl}
                <ExternalLink className="h-5 w-5" />
              </a>

              <a
                href={url.org_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-muted-foreground hover:text-foreground font-medium break-words"
              >
                <LinkIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span className="break-all">{url.org_url}</span>
              </a>

              <span className="text-muted-foreground text-sm font-bold uppercase">
                Created on {new Date(url.created_at).toLocaleDateString()}
              </span>

              <div className="flex gap-3 mt-2 flex-wrap">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 border-2 border-foreground bg-neo-green shadow-neo hover:shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  onClick={() => copyToClipboard(fullShortUrl, '✓ Short URL copied!')}
                >
                  <Copy className="h-4 w-4 mr-2 text-foreground" />
                  <span className="text-foreground font-bold">Copy</span>
                </Button>

                {url.qr && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 border-2 border-foreground bg-neo-blue shadow-neo hover:shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    onClick={downloadImage}
                  >
                    <Download className="h-4 w-4 mr-2 text-foreground" />
                    <span className="text-foreground font-bold">Download QR</span>
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 border-2 border-foreground bg-red-500 shadow-neo hover:shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  onClick={handleDelete}
                  disabled={loadingDelete}
                >
                  {loadingDelete ? (
                    <div className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <Trash className="h-4 w-4 mr-2 text-foreground" />
                  )}
                  <span className="text-foreground font-bold">Delete</span>
                </Button>
              </div>

              {url.qr && (
                <div className="mt-4 w-full max-w-xs">
                  <div className="bg-card border-3 border-foreground shadow-neo p-4">
                    <img
                      src={url.qr}
                      className="w-full h-auto object-contain"
                      alt="QR Code"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Stats Section */}
        <Card className="lg:w-3/5 bg-card border-3 border-foreground shadow-neo pt-0">
          <CardHeader className="bg-neo-black border-b-3 border-foreground p-4 -mt-6">
            <CardTitle className="text-xl font-bold text-neo-cream">
              Analytics & Statistics
            </CardTitle>
          </CardHeader>

          {loadingStats ? (
            <CardContent className="py-12 flex justify-center">
              <div className="w-10 h-10 border-4 border-foreground border-t-primary rounded-full animate-spin"></div>
            </CardContent>
          ) : stats && stats.length > 0 ? (
            <CardContent className="flex flex-col gap-4 pt-4">
              <div className="bg-neo-blue border-3 border-foreground shadow-neo p-4">
                <p className="text-xl font-bold text-foreground mb-1 uppercase tracking-wide">Total Clicks</p>
                <p className="text-3xl font-display text-foreground">{stats.length}</p>
              </div>

              <DeviceStats stats={stats} />
              <LocationStats stats={stats} />
            </CardContent>
          ) : (
            <CardContent className="py-12 text-center text-muted-foreground">
              <LinkIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-bold text-foreground uppercase">No clicks recorded yet</p>
              <p className="text-sm text-muted-foreground mt-2 font-medium">
                Share your link to start collecting statistics
              </p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Link;