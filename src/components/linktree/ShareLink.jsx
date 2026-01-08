
import React from 'react';
import { Link as LinkIcon, Check, Copy, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ShareLink = ({
    baseUrl,
    shortUrl,
    setShortUrl,
    setHasChanges,
    handleCopy,
    copied,
    handleSave,
    saving,
    hasChanges
}) => {
    return (
        <div className="bg-neo-yellow border-3 border-black shadow-[6px_6px_0px_#000000] p-3 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-black mb-3 sm:mb-4 flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white border-2 border-black flex items-center justify-center">
                    <LinkIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                Your Link
            </h2>

            <div className="flex flex-col gap-2 mb-3 sm:mb-4">
                <div className="flex items-center bg-white border-3 border-black">
                    <span className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 border-r-3 border-black whitespace-nowrap">
                        {new URL(baseUrl).hostname}/
                    </span>
                    <input
                        type="text"
                        value={shortUrl}
                        onChange={(e) => {
                            setShortUrl(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
                            setHasChanges(true);
                        }}
                        className="flex-1 px-2 sm:px-3 py-2 bg-transparent outline-none font-bold text-black min-w-0 text-sm sm:text-base"
                        placeholder="yourname"
                    />
                    <Button
                        onClick={handleCopy}
                        className="neo-button bg-neo-green text-black border-l-3 border-black h-full rounded-none px-2 sm:px-4"
                        disabled={!shortUrl}
                    >
                        {copied ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : <Copy className="w-3 h-3 sm:w-4 sm:h-4" />}
                    </Button>
                </div>
            </div>

            <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full neo-button bg-neo-green text-black border-black gap-1 sm:gap-2 text-xs sm:text-sm"
            >
                <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                {saving ? "Saving..." : hasChanges ? "Save Changes" : "Saved!"}
            </Button>
        </div>
    );
};

export default ShareLink;
