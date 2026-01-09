/**
 * =============================================================================
 * LIVE PREVIEW COMPONENT
 * =============================================================================
 * Real-time preview of the linktree with selected theme applied.
 * Shows how the linktree will look to visitors.
 */

import React from 'react';
import { Eye, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getTheme } from '@/lib/themes';
import { renderIcon, detectIconFromUrl } from '@/lib/iconUtils.jsx';

const LivePreview = ({
    selectedTheme,
    currentTheme,
    avatarUrl,
    title,
    bio,
    links,
    handleSave,
    saving,
    linktree
}) => {
    const theme = getTheme(selectedTheme);

    return (
        <div className="bg-[#1a1a1a] border-3 border-white shadow-[6px_6px_0px_#ff6b9d] p-3 sm:p-4 overflow-hidden relative z-10">
            <h2 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-neo-blue border-2 border-white flex items-center justify-center">
                        <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-black" />
                    </div>
                    <span className="text-sm sm:text-base">Live Preview</span>
                </div>
                <span className="text-[10px] sm:text-xs font-normal text-gray-400">
                    {theme.emoji} {theme.name}
                </span>
            </h2>

            {/* Phone Mockup Preview */}
            <div className="flex justify-center">
                <div
                    className="w-full max-w-[280px] sm:max-w-none rounded-2xl border-3 border-gray-600 overflow-hidden"
                    style={{
                        background: theme.styles.background,
                        minHeight: '320px',
                    }}
                >
                    <div className="p-3 sm:p-4">
                        {/* Preview Profile */}
                        <div className="text-center mb-4 sm:mb-6">
                            {avatarUrl ? (
                                <div
                                    className="w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-2 sm:mb-3 overflow-hidden"
                                    style={{
                                        borderRadius: theme.styles.borderRadius || '50%',
                                        border: theme.styles.cardBorder,
                                    }}
                                >
                                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div
                                    className="w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-2 sm:mb-3 flex items-center justify-center text-2xl sm:text-3xl"
                                    style={{
                                        backgroundColor: theme.styles.buttonBg,
                                        borderRadius: theme.styles.borderRadius || '50%',
                                        border: theme.styles.cardBorder,
                                    }}
                                >
                                    👤
                                </div>
                            )}
                            <h3
                                className="text-base sm:text-xl font-bold mb-1"
                                style={{ color: theme.styles.textColor }}
                            >
                                {title || "My Links"}
                            </h3>
                            {bio && (
                                <p
                                    className="text-xs sm:text-sm opacity-80 line-clamp-2"
                                    style={{ color: theme.styles.textColor }}
                                >
                                    {bio}
                                </p>
                            )}
                        </div>

                        {/* Preview Links - Now with Icons! */}
                        <div className="space-y-2 sm:space-y-3">
                            {links.length > 0 ? (
                                links.slice(0, 4).map((link) => (
                                    <div
                                        key={link.id}
                                        className="w-full p-2 sm:p-3 flex items-center justify-center gap-2 transition-all"
                                        style={{
                                            backgroundColor: theme.styles.buttonBg,
                                            color: theme.styles.textColor,
                                            border: theme.styles.buttonBorder,
                                            borderRadius: theme.styles.borderRadius,
                                            backdropFilter: theme.styles.backdropFilter,
                                        }}
                                    >
                                        {/* Always re-detect icon from URL if saved icon is default "link" */}
                                        {renderIcon(
                                            (link.icon && link.icon !== "link") ? link.icon : detectIconFromUrl(link.url),
                                            "w-3 h-3 sm:w-4 sm:h-4"
                                        )}
                                        <span className="font-bold text-xs sm:text-sm">{link.title}</span>
                                    </div>
                                ))
                            ) : (
                                <>
                                    {/* Sample links for preview */}
                                    {[
                                        { name: 'Portfolio', icon: 'website' },
                                        { name: 'Twitter', icon: 'twitter' },
                                        { name: 'GitHub', icon: 'github' }
                                    ].map((sample, i) => (
                                        <div
                                            key={i}
                                            className="w-full p-2 sm:p-3 flex items-center justify-center gap-2"
                                            style={{
                                                backgroundColor: theme.styles.buttonBg,
                                                color: theme.styles.textColor,
                                                border: theme.styles.buttonBorder,
                                                borderRadius: theme.styles.borderRadius,
                                                backdropFilter: theme.styles.backdropFilter,
                                            }}
                                        >
                                            {renderIcon(sample.icon, "w-3 h-3 sm:w-4 sm:h-4")}
                                            <span className="font-bold text-xs sm:text-sm">{sample.name}</span>
                                        </div>
                                    ))}
                                </>
                            )}
                            {links.length > 4 && (
                                <p
                                    className="text-center text-[10px] sm:text-xs opacity-60"
                                    style={{ color: theme.styles.textColor }}
                                >
                                    +{links.length - 4} more links
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Theme Button */}
            <div className="mt-4 sm:mt-6 flex justify-center">
                <Button
                    onClick={handleSave}
                    disabled={saving || !linktree}
                    className={`neo-button text-black gap-1 sm:gap-2 px-4 sm:px-8 text-xs sm:text-sm ${selectedTheme !== currentTheme
                        ? 'bg-neo-yellow border-white animate-pulse'
                        : 'bg-neo-green border-white'
                        }`}
                >
                    <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                    {saving ? "Saving..." : selectedTheme !== currentTheme ? "Save Theme" : "Saved ✓"}
                </Button>
            </div>
        </div>
    );
};

export default LivePreview;
