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
        <div className="w-full h-1 mb-4">
          <div className="h-full bg-orange-500 animate-pulse rounded"></div>
        </div>
      )}

      {/* Rest of the component remains the same */}
      <div className="flex flex-col gap-8 lg:flex-row justify-between">
        {/* URL Details Section */}
        <div className="flex flex-col items-start gap-6 lg:w-2/5">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            {url?.title || "Loading..."}
          </h1>
          
          {url && (
            <>
              <a
                href={fullShortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl sm:text-3xl text-orange-400 font-bold hover:underline flex items-center gap-2"
              >
                {fullShortUrl}
                <ExternalLink className="h-5 w-5" />
              </a>
              
              <a
                href={url.org_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-300 hover:text-gray-100"
              >
                <LinkIcon className="h-4 w-4" />
                <span className="truncate max-w-full">{url.org_url}</span>
              </a>
              
              <span className="text-gray-500 text-sm">
                Created on {new Date(url.created_at).toLocaleDateString()}
              </span>
              
              <div className="flex gap-3 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-orange-400"
                  onClick={() => navigator.clipboard.writeText(fullShortUrl)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                
                {url.qr && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-orange-400"
                    onClick={downloadImage}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download QR
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-700 text-gray-300 hover:bg-red-900 hover:text-red-400 hover:border-red-700"
                  onClick={handleDelete}
                  disabled={loadingDelete}
                >
                  {loadingDelete ? (
                    <div className="w-4 h-4 border-2 border-gray-700 border-t-red-400 rounded-full animate-spin mr-2"></div>
                  ) : (
                    <Trash className="h-4 w-4 mr-2" />
                  )}
                  Delete
                </Button>
              </div>
              
              {url.qr && (
                <div className="mt-4 w-full max-w-xs">
                  <div className="bg-white p-4 rounded-lg">
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
        <Card className="lg:w-3/5 bg-gray-900 border-gray-800">
          <CardHeader className="border-b border-gray-800">
            <CardTitle className="text-xl font-bold text-white">
              Analytics & Statistics
            </CardTitle>
          </CardHeader>

          {loadingStats ? (
            <CardContent className="py-12 flex justify-center">
              <div className="w-10 h-10 border-4 border-gray-700 border-t-orange-500 rounded-full animate-spin"></div>
            </CardContent>
          ) : stats && stats.length > 0 ? (
            <CardContent className="flex flex-col gap-4 pt-4">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <p className="text-xs font-medium text-gray-400 mb-1">Total Clicks</p>
                <p className="text-3xl font-bold text-orange-400">{stats.length}</p>
              </div>

              <DeviceStats stats={stats} />
              <LocationStats stats={stats} />
            </CardContent>
          ) : (
            <CardContent className="py-12 text-center text-gray-400">
              <LinkIcon className="h-12 w-12 mx-auto mb-4 text-gray-600" />
              <p className="text-lg font-medium">No clicks recorded yet</p>
              <p className="text-sm text-gray-500 mt-2">
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