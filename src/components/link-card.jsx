/* eslint-disable react/prop-types */
import {Copy, Download, LinkIcon, Trash} from "lucide-react";
import {Link} from "react-router-dom";
import {Button} from "./ui/button";
import useFetch from "@/hooks/use-fetch";
import {deleteUrl} from "@/db/apiUrls";

const LinkCard = ({url = [], fetchUrls}) => {
  const downloadImage = () => {
    const imageUrl = url?.qr;
    const fileName = url?.title; // Desired file name for the downloaded image

    // Create an anchor element
    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = fileName;

    // Append the anchor to the body
    document.body.appendChild(anchor);

    // Trigger the download by simulating a click event
    anchor.click();

    // Remove the anchor from the document
    document.body.removeChild(anchor);
  };

  const {loading: loadingDelete, fn: fnDelete} = useFetch(deleteUrl, null);

  return (
    <div className="flex flex-col md:flex-row gap-5 border border-gray-800 p-6 bg-gray-900 rounded-lg hover:border-gray-700 transition-colors">
      <img
        src={url?.qr}
        className="h-32 w-32 object-contain ring-2 ring-orange-500/50 self-start rounded-lg bg-white p-2"
        alt="qr code"
      />
      <Link to={`/link/${url?.id}`} className="flex flex-col flex-1 gap-2">
        <span className="text-2xl font-bold hover:text-orange-500 transition-colors">
          {url?.title}
        </span>
        <span className="text-lg text-orange-500 font-medium hover:text-orange-400 transition-colors">
          forReal.URL/{url?.custom_url ? url?.custom_url : url.short_url}
        </span>
        <span className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors text-sm">
          <LinkIcon className="w-4 h-4" />
          <span className="truncate">{url?.org_url}</span>
        </span>
        <span className="flex items-end text-gray-500 text-xs mt-auto">
          {new Date(url?.created_at).toLocaleString()}
        </span>
      </Link>
      <div className="flex md:flex-col gap-2">
        <Button
          variant="ghost"
          className="hover:bg-gray-800 hover:text-orange-500 transition-colors"
          onClick={() =>
            navigator.clipboard.writeText(`https://forReal.URL/${url?.short_url}`)
          }
        >
          <Copy className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost"
          className="hover:bg-gray-800 hover:text-orange-500 transition-colors"
          onClick={downloadImage}
        >
          <Download className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          className="hover:bg-gray-800 hover:text-red-500 transition-colors"
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
            <div className="w-4 h-4 border-2 border-gray-700 border-t-red-500 rounded-full animate-spin"></div>
          ) : (
            <Trash className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default LinkCard;