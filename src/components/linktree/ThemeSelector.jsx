
import React from 'react';
import { Palette } from 'lucide-react';
import { getTheme } from '@/lib/themes';

const ThemeSelector = ({
    allThemes,
    selectedTheme,
    setSelectedTheme,
    setHasChanges,
    currentTheme
}) => {
    return (
        <div className="bg-[#1a1a1a] border-3 border-white shadow-[6px_6px_0px_#ff6b9d] p-3 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-neo-purple border-2 border-white flex items-center justify-center">
                    <Palette className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                Theme Presets
            </h2>

            {/* Theme Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                {allThemes.map((theme) => (
                    <button
                        key={theme.id}
                        onClick={() => {
                            setSelectedTheme(theme.id);
                            setHasChanges(true);
                        }}
                        className={`p-2 sm:p-3 border-3 transition-all text-left ${selectedTheme === theme.id
                            ? "border-primary shadow-neo-lg -translate-x-1 -translate-y-1"
                            : "border-foreground hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5"
                            }`}
                        style={{
                            background: theme.styles.background.includes("gradient")
                                ? theme.styles.background
                                : theme.styles.background,
                        }}
                    >
                        <div className="flex items-center gap-1 sm:gap-2">
                            <span className="text-base sm:text-lg">{theme.emoji}</span>
                            <span
                                className="font-bold text-xs sm:text-sm truncate"
                                style={{ color: theme.styles.textColor }}
                            >
                                {theme.name}
                            </span>
                        </div>
                        <p
                            className="text-[10px] sm:text-xs mt-1 opacity-70 truncate"
                            style={{ color: theme.styles.textColor }}
                        >
                            {theme.description}
                        </p>
                    </button>
                ))}
            </div>

            {/* Current & Selected theme */}
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/20 space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between">
                    <div className="text-xs sm:text-sm">
                        <span className="text-gray-500">Current: </span>
                        <span className="font-bold text-neo-green">{getTheme(currentTheme).emoji} {getTheme(currentTheme).name}</span>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="text-xs sm:text-sm">
                        <span className="text-gray-400">Selected: </span>
                        <span className={`font-bold ${selectedTheme !== currentTheme ? 'text-neo-yellow' : 'text-white'}`}>
                            {getTheme(selectedTheme).emoji} {getTheme(selectedTheme).name}
                            {selectedTheme !== currentTheme && <span className="ml-1 sm:ml-2 text-[10px] sm:text-xs">(unsaved)</span>}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThemeSelector;
