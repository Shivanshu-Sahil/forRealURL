/**
 * =============================================================================
 * LINKTREE THEME PRESETS
 * =============================================================================
 * Predefined themes for linktree pages.
 * Each theme includes colors, styles, and CSS properties.
 * =============================================================================
 */

export const themePresets = {
    // =========================================================================
    // NEOBRUTALIST - Bold and chunky (DEFAULT - matches your app style!)
    // =========================================================================
    neobrutalist: {
        id: "neobrutalist",
        name: "Neobrutalist",
        emoji: "🟨",
        description: "Bold and chunky",
        styles: {
            background: "#ffe500",
            cardBg: "#ffffff",
            cardBorder: "4px solid #000000",
            cardShadow: "8px 8px 0px #000000",
            backdropFilter: "none",
            textColor: "#000000",
            buttonBg: "#ffffff",
            buttonHover: "#f0f0f0",
            buttonBorder: "4px solid #000000",
            borderRadius: "0px",
            fontWeight: "800",
        },
    },

    // =========================================================================
    // GLASSMORPHIC - Frosted glass effect with blur
    // =========================================================================
    glassmorphic: {
        id: "glassmorphic",
        name: "Glassmorphic",
        emoji: "🪟",
        description: "Frosted glass with blur effects",
        styles: {
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            cardBg: "rgba(255, 255, 255, 0.15)",
            cardBorder: "1px solid rgba(255, 255, 255, 0.3)",
            cardShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            backdropFilter: "blur(10px)",
            textColor: "#ffffff",
            buttonBg: "rgba(255, 255, 255, 0.2)",
            buttonHover: "rgba(255, 255, 255, 0.35)",
            buttonBorder: "1px solid rgba(255, 255, 255, 0.4)",
            borderRadius: "16px",
        },
    },

    // =========================================================================
    // VINTAGE - Warm retro colors with serif fonts
    // =========================================================================
    vintage: {
        id: "vintage",
        name: "Vintage",
        emoji: "📜",
        description: "Warm retro aesthetic",
        styles: {
            background: "linear-gradient(180deg, #f5e6d3 0%, #e8d5b7 100%)",
            cardBg: "#fffef9",
            cardBorder: "3px solid #8b7355",
            cardShadow: "4px 4px 0px #8b7355",
            backdropFilter: "none",
            textColor: "#4a3728",
            buttonBg: "#d4a574",
            buttonHover: "#c49464",
            buttonBorder: "3px solid #8b7355",
            borderRadius: "0px",
            fontFamily: "'Georgia', serif",
        },
    },

    // =========================================================================
    // NEON - Cyberpunk glowing effects
    // =========================================================================
    neon: {
        id: "neon",
        name: "Neon",
        emoji: "🌃",
        description: "Cyberpunk glow effects",
        styles: {
            background: "linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 100%)",
            cardBg: "#16213e",
            cardBorder: "2px solid #0ff",
            cardShadow: "0 0 20px rgba(0, 255, 255, 0.5), 0 0 40px rgba(0, 255, 255, 0.2)",
            backdropFilter: "none",
            textColor: "#ffffff",
            buttonBg: "transparent",
            buttonHover: "rgba(0, 255, 255, 0.1)",
            buttonBorder: "2px solid #0ff",
            borderRadius: "4px",
            glowColor: "#0ff",
        },
    },

    // =========================================================================
    // MINIMAL - Clean and simple
    // =========================================================================
    minimal: {
        id: "minimal",
        name: "Minimal",
        emoji: "⬜",
        description: "Clean and simple",
        styles: {
            background: "#ffffff",
            cardBg: "#ffffff",
            cardBorder: "none",
            cardShadow: "none",
            backdropFilter: "none",
            textColor: "#1a1a1a",
            buttonBg: "#f5f5f5",
            buttonHover: "#e5e5e5",
            buttonBorder: "1px solid #e0e0e0",
            borderRadius: "8px",
        },
    },

    // =========================================================================
    // DARK MINIMAL - Dark mode minimal
    // =========================================================================
    darkMinimal: {
        id: "darkMinimal",
        name: "Dark Minimal",
        emoji: "⬛",
        description: "Dark and clean",
        styles: {
            background: "#0f0f0f",
            cardBg: "#0f0f0f",
            cardBorder: "none",
            cardShadow: "none",
            backdropFilter: "none",
            textColor: "#ffffff",
            buttonBg: "#1a1a1a",
            buttonHover: "#2a2a2a",
            buttonBorder: "1px solid #333",
            borderRadius: "8px",
        },
    },

    // =========================================================================
    // GRADIENT SUNSET - Warm sunset gradient
    // =========================================================================
    sunset: {
        id: "sunset",
        name: "Sunset",
        emoji: "🌅",
        description: "Warm sunset vibes",
        styles: {
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #f093fb 100%)",
            cardBg: "rgba(255, 255, 255, 0.2)",
            cardBorder: "1px solid rgba(255, 255, 255, 0.3)",
            cardShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            backdropFilter: "blur(8px)",
            textColor: "#ffffff",
            buttonBg: "rgba(255, 255, 255, 0.25)",
            buttonHover: "rgba(255, 255, 255, 0.4)",
            buttonBorder: "1px solid rgba(255, 255, 255, 0.4)",
            borderRadius: "50px",
        },
    },

    // =========================================================================
    // OCEAN - Cool ocean blues
    // =========================================================================
    ocean: {
        id: "ocean",
        name: "Ocean",
        emoji: "🌊",
        description: "Cool ocean blues",
        styles: {
            background: "linear-gradient(180deg, #0077b6 0%, #023e8a 100%)",
            cardBg: "rgba(255, 255, 255, 0.1)",
            cardBorder: "1px solid rgba(255, 255, 255, 0.2)",
            cardShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(10px)",
            textColor: "#ffffff",
            buttonBg: "rgba(255, 255, 255, 0.15)",
            buttonHover: "rgba(255, 255, 255, 0.3)",
            buttonBorder: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "12px",
        },
    },

    // =========================================================================
    // FOREST - Natural green tones
    // =========================================================================
    forest: {
        id: "forest",
        name: "Forest",
        emoji: "🌲",
        description: "Natural green tones",
        styles: {
            background: "linear-gradient(180deg, #2d5016 0%, #1a3009 100%)",
            cardBg: "rgba(255, 255, 255, 0.08)",
            cardBorder: "1px solid rgba(255, 255, 255, 0.15)",
            cardShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(8px)",
            textColor: "#e8f5e9",
            buttonBg: "rgba(76, 175, 80, 0.3)",
            buttonHover: "rgba(76, 175, 80, 0.5)",
            buttonBorder: "1px solid rgba(76, 175, 80, 0.5)",
            borderRadius: "8px",
        },
    },

    // =========================================================================
    // LAVENDER DREAM - Soft purple tones
    // =========================================================================
    lavender: {
        id: "lavender",
        name: "Lavender Dream",
        emoji: "💜",
        description: "Soft purple tones",
        styles: {
            background: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
            cardBg: "rgba(255, 255, 255, 0.5)",
            cardBorder: "1px solid rgba(255, 255, 255, 0.6)",
            cardShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(10px)",
            textColor: "#4a4a6a",
            buttonBg: "rgba(255, 255, 255, 0.6)",
            buttonHover: "rgba(255, 255, 255, 0.8)",
            buttonBorder: "1px solid rgba(255, 255, 255, 0.7)",
            borderRadius: "20px",
        },
    },
};

// Get theme by ID (default to neobrutalist)
export const getTheme = (themeId) => {
    return themePresets[themeId] || themePresets.neobrutalist;
};

// Get all themes as array
export const getAllThemes = () => {
    return Object.values(themePresets);
};
