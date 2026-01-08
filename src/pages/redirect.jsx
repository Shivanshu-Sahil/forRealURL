/**
 * =============================================================================
 * REDIRECT PAGE
 * =============================================================================
 * This page handles short URL redirects.
 * 
 * LOGIC:
 *   1. Check if the short URL is a LINKTREE -> redirect to /lt/:id
 *   2. Otherwise, check if it's a regular SHORT URL -> redirect to original URL
 *   3. If neither, show not found
 * =============================================================================
 */

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getLongUrl } from "@/db/apiUrls";
import { storeClicks } from "@/db/apiClicks";
import { getLinktreeByShortUrl } from "@/db/apiLinktree";
import { Link2, AlertCircle } from 'lucide-react';

const Redirect = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const hasRecordedClick = useRef(false);
  const hasChecked = useRef(false);

  const [loading, setLoading] = useState(true);
  const [urlData, setUrlData] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!hasChecked.current) {
      hasChecked.current = true;
      checkAndRedirect();
    }
  }, [id]);

  const checkAndRedirect = async () => {
    try {
      // Step 1: Check if it's a linktree
      const linktree = await getLinktreeByShortUrl(id);
      if (linktree) {
        // Redirect to linktree view page
        navigate(`/lt/${linktree.id}`, { replace: true });
        return;
      }

      // Step 2: Check if it's a regular short URL
      const url = await getLongUrl(id);
      if (url) {
        setUrlData(url);
        setLoading(false);
        return;
      }

      // Step 3: Not found
      setNotFound(true);
      setLoading(false);
    } catch (error) {
      console.error("Error checking redirect:", error);
      setNotFound(true);
      setLoading(false);
    }
  };

  // Handle URL redirect
  useEffect(() => {
    if (!loading && urlData && !hasRecordedClick.current) {
      hasRecordedClick.current = true;
      storeClicks({
        id: urlData.id,
        originalUrl: urlData.org_url
      });
    }
  }, [loading, urlData]);

  // Loading state
  if (loading) {
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

  // Not found state
  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] relative">
        <div className="absolute top-20 right-20 w-24 h-24 bg-neo-pink border-3 border-foreground rotate-12 opacity-30"></div>
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-neo-yellow border-3 border-foreground rounded-full opacity-30"></div>

        <div className="w-24 h-24 bg-destructive border-3 border-foreground mb-8 flex items-center justify-center">
          <AlertCircle className="w-12 h-12 text-white" />
        </div>

        <h2 className="text-3xl font-display mb-2 text-foreground uppercase">Link Not Found</h2>
        <p className="text-muted-foreground font-bold mb-6">This short URL doesn't exist</p>

        <Link
          to="/"
          className="px-6 py-3 bg-neo-green border-3 border-foreground font-bold shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all uppercase"
        >
          Go Home
        </Link>
      </div>
    );
  }

  // Return null as storeClicks handles the actual redirect
  return null;
};

export default Redirect;
