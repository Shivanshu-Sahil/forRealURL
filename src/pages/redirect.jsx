import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getLongUrl } from "@/db/apiUrls";
import { storeClicks } from "@/db/apiClicks";
import useFetch from "@/hooks/use-fetch";
import { Link2 } from 'lucide-react';

const Redirect = () => {
  const { id } = useParams();
  const hasRecordedClick = useRef(false);

  const { loading: loadingUrl, data, fn: fetchUrl } = useFetch(getLongUrl, null);

  useEffect(() => {
    fetchUrl(id);
  }, [id]);

  useEffect(() => {
    if (!loadingUrl && data && !hasRecordedClick.current) {
      hasRecordedClick.current = true;

      storeClicks({
        id: data?.id,
        originalUrl: data?.org_url
      });
    }
  }, [loadingUrl, data]);

  const isLoading = loadingUrl;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] relative">
        {/* Background shapes */}
        <div className="absolute top-20 right-20 w-24 h-24 bg-neo-yellow border-3 border-foreground rotate-12 opacity-30"></div>
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-neo-pink border-3 border-foreground rounded-full opacity-30"></div>

        {/* Loading animation */}
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-foreground border-t-primary rounded-full animate-spin"></div>
        </div>

        <h2 className="text-3xl font-display mb-2 text-foreground uppercase">Redirecting...</h2>
        <p className="text-muted-foreground font-bold">Taking you to your destination</p>

        <div className="mt-6 bg-neo-blue border-3 border-foreground shadow-neo p-4 flex items-center gap-2">
          <Link2 className="w-5 h-5 text-foreground" />
          <span className="text-sm text-foreground font-bold uppercase">Short URL: {id}</span>
        </div>
      </div>
    );
  }
  // Return null as the storeClicks function handles the actual redirection
  return null;
};

export default Redirect;
