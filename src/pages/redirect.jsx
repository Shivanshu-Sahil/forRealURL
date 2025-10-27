import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getLongUrl } from "@/db/apiUrls";
import { storeClicks } from "@/db/apiClicks";
import useFetch from "@/hooks/use-fetch";

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
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        {/* Professional minimal loading animation using only Tailwind */}
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-700 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
        
        <h2 className="text-3xl font-bold mb-2 text-white">Redirecting...</h2>
        <p className="text-gray-400">Taking you to your destination</p>
        <p className="mt-6 text-sm text-gray-500">Short URL: {id}</p>
      </div>
    );
  }
  // Return null as the storeClicks function handles the actual redirection
  return null;
};

export default Redirect;