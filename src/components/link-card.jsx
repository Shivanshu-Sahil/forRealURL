/* eslint-disable react/prop-types */
import {Copy, Download, LinkIcon, Trash} from "lucide-react";
import {Link} from "react-router-dom";
import {Button} from "./ui/button";
import useFetch from "@/hooks/use-fetch";
import {deleteUrl} from "@/db/apiUrls";
import {copyToClipboard} from "@/lib/copyToClipboard";

const LinkCard = ({url = [], fetchUrls}) => {
  const downloadImage = () => {
    const imageUrl = url?.qr;
    const fileName = url?.title;

    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const {loading: loadingDelete, fn: fnDelete} = useFetch(deleteUrl, null);
  
  // Get the base URL (use env var or current origin)
  const baseUrl = import.meta.env.VITE_CUSTOM_URL || window.location.origin;
  const shortUrlPath = url?.custom_url || url?.short_url;
  const fullShortUrl = `${baseUrl}/${shortUrlPath}`;
  const displayUrl = new URL(baseUrl).hostname + "/" + shortUrlPath;

  return (
    <div className="flex flex-col md:flex-row gap-5 border-3 border-foreground bg-card p-6 shadow-neo hover:shadow-neo-xl hover:-translate-x-1 hover:-translate-y-1 transition-all">
      <div className="w-32 h-32 flex-shrink-0 bg-neo-yellow border-3 border-foreground shadow-neo-sm p-2">
        <img
          src={url?.qr}
          className="w-full h-full object-contain"
          alt="qr code"
        />
      </div>
      <Link to={`/link/${url?.id}`} className="flex flex-col flex-1 gap-2 min-w-0">
        <span className="text-2xl font-display text-foreground hover:text-primary transition-colors break-words">
          {url?.title}
        </span>
        <span className="text-lg text-primary font-bold hover:underline underline-offset-4 transition-colors break-words">
          {displayUrl}
        </span>
        <span className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm min-w-0 font-medium">
          <LinkIcon className="w-4 h-4 flex-shrink-0" />
          <span className="break-all overflow-hidden">{url?.org_url}</span>
        </span>
        <span className="flex items-end text-muted-foreground text-xs mt-auto font-bold uppercase">
          {new Date(url?.created_at).toLocaleString()}
        </span>
      </Link>
      <div className="flex md:flex-col gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 border-2 border-foreground bg-neo-green hover:bg-neo-green/80"
          onClick={() =>
            copyToClipboard(
              fullShortUrl,
              '✓ URL copied to clipboard!'
            )
          }
        >
          <Copy className="w-4 h-4 text-foreground" />
        </Button>
        <Button 
          variant="ghost"
          size="icon"
          className="h-10 w-10 border-2 border-foreground bg-neo-blue hover:bg-neo-blue/80"
          onClick={downloadImage}
        >
          <Download className="w-4 h-4 text-foreground" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 border-2 border-foreground bg-destructive hover:bg-destructive/80"
          onClick={async () => {
            try {
              await fnDelete(url.id);
              fetchUrls();
            } catch (error) {
              console.error("Error deleting URL:", error);
            }
          }}
          disabled={loadingDelete}
        >
          {loadingDelete ? (
            <div className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Trash className="w-4 h-4 text-destructive-foreground" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default LinkCard;