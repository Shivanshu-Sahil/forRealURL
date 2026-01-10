/**
 * =============================================================================
 * ICON UTILITIES
 * =============================================================================
 * Centralized icon management for link detection and display.
 * Auto-detects social media platforms from URLs and returns appropriate icons.
 */

import {
    Twitter,
    Github,
    Linkedin,
    Instagram,
    Youtube,
    Facebook,
    Music2,
    MessageCircle,
    Twitch,
    ExternalLink,
    Mail,
    Send,
    Globe,
    Coffee,
    ShoppingBag,
    Gamepad2,
    BookOpen,
    Camera,
    Podcast,
    Triangle,
    Zap,
    FileText,
    FolderOpen,
    Notebook,
    Cloud,
    Phone,
} from "lucide-react";

// =============================================================================
// ICON MAP
// =============================================================================
// Maps icon identifiers to their Lucide React components

export const ICON_MAP = {
    twitter: Twitter,
    x: Twitter,
    github: Github,
    linkedin: Linkedin,
    instagram: Instagram,
    youtube: Youtube,
    facebook: Facebook,
    tiktok: Music2,
    discord: MessageCircle,
    twitch: Twitch,
    mail: Mail,
    email: Mail,
    telegram: Send,
    website: Globe,
    portfolio: Globe,
    coffee: Coffee,
    buymeacoffee: Coffee,
    kofi: Coffee,
    shop: ShoppingBag,
    store: ShoppingBag,
    gaming: Gamepad2,
    steam: Gamepad2,
    whatsapp: Phone,
    pinterest: Camera,
    snapchat: Camera,
    reddit: MessageCircle,
    medium: BookOpen,
    blog: BookOpen,
    substack: BookOpen,
    behance: Camera,
    dribbble: Camera,
    unsplash: Camera,
    spotify: Podcast,
    podcast: Podcast,
    // Developer & Cloud Platforms
    vercel: Triangle,
    supabase: Zap,
    netlify: Cloud,
    railway: Cloud,
    render: Cloud,
    // Documents & Files
    resume: FileText,
    cv: FileText,
    document: FileText,
    drive: FolderOpen,
    gdrive: FolderOpen,
    notion: Notebook,
    // Default
    link: ExternalLink,
};

// =============================================================================
// URL PATTERNS FOR AUTO-DETECTION
// =============================================================================
// Regex patterns to match common platforms from URLs

const URL_PATTERNS = [
    // Social Media
    { pattern: /twitter\.com|x\.com/i, icon: "twitter" },
    { pattern: /github\.com/i, icon: "github" },
    { pattern: /linkedin\.com/i, icon: "linkedin" },
    { pattern: /instagram\.com/i, icon: "instagram" },
    { pattern: /youtube\.com|youtu\.be/i, icon: "youtube" },
    { pattern: /facebook\.com|fb\.com/i, icon: "facebook" },
    { pattern: /tiktok\.com/i, icon: "tiktok" },
    { pattern: /discord\.gg|discord\.com/i, icon: "discord" },
    { pattern: /twitch\.tv/i, icon: "twitch" },
    { pattern: /t\.me|telegram\./i, icon: "telegram" },
    { pattern: /mailto:/i, icon: "mail" },
    // Support & Coffee
    { pattern: /buymeacoffee\.com/i, icon: "buymeacoffee" },
    { pattern: /ko-fi\.com/i, icon: "kofi" },
    // Blogs & Content
    { pattern: /medium\.com/i, icon: "medium" },
    { pattern: /substack\.com/i, icon: "substack" },
    { pattern: /hashnode\.dev/i, icon: "blog" },
    { pattern: /dev\.to/i, icon: "blog" },
    // Design
    { pattern: /behance\.net/i, icon: "behance" },
    { pattern: /dribbble\.com/i, icon: "dribbble" },
    { pattern: /unsplash\.com/i, icon: "unsplash" },
    { pattern: /figma\.com/i, icon: "behance" },
    // Music & Entertainment
    { pattern: /spotify\.com/i, icon: "spotify" },
    { pattern: /steam(community)?\.com/i, icon: "steam" },
    { pattern: /whatsapp\.com|wa\.me/i, icon: "whatsapp" },
    { pattern: /pinterest\.com/i, icon: "pinterest" },
    { pattern: /snapchat\.com/i, icon: "snapchat" },
    { pattern: /reddit\.com/i, icon: "reddit" },
    // Developer & Cloud Platforms
    { pattern: /vercel\.app|vercel\.com/i, icon: "vercel" },
    { pattern: /supabase\.co|supabase\.com/i, icon: "supabase" },
    { pattern: /netlify\.app|netlify\.com/i, icon: "netlify" },
    { pattern: /railway\.app/i, icon: "railway" },
    { pattern: /render\.com/i, icon: "render" },
    // Documents & Resume (check resume/cv patterns BEFORE general drive patterns)
    // Priority: Resume links on any platform should show resume icon
    { pattern: /resume|cv|curriculum[_-]?vitae/i, icon: "resume" },
    { pattern: /\.pdf(\?|$)/i, icon: "document" },
    // General drive/docs patterns
    { pattern: /drive\.google\.com/i, icon: "drive" },
    { pattern: /docs\.google\.com/i, icon: "document" },
    { pattern: /notion\.so|notion\.site/i, icon: "notion" },
    { pattern: /dropbox\.com/i, icon: "drive" },
];

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Detects the appropriate icon identifier from a URL
 * @param {string} url - The URL to analyze
 * @returns {string} - Icon identifier (e.g., "twitter", "github", "link")
 */
export const detectIconFromUrl = (url) => {
    if (!url) return "link";

    const lowerUrl = url.toLowerCase();

    for (const { pattern, icon } of URL_PATTERNS) {
        if (pattern.test(lowerUrl)) {
            return icon;
        }
    }

    return "link"; // Default fallback
};

/**
 * Gets the icon component for a given identifier
 * @param {string} iconName - The icon identifier
 * @returns {React.Component} - The Lucide icon component
 */
export const getIconComponent = (iconName) => {
    return ICON_MAP[iconName] || ICON_MAP.link;
};

/**
 * Renders an icon with specified className
 * @param {string} iconName - The icon identifier
 * @param {string} className - CSS classes for the icon
 * @returns {JSX.Element} - The rendered icon
 */
export const renderIcon = (iconName, className = "w-5 h-5") => {
    const IconComponent = getIconComponent(iconName);
    return <IconComponent className={className} />;
};

/**
 * Gets icon info including component and display name
 * @param {string} iconName - The icon identifier
 * @returns {Object} - { component, displayName }
 */
export const getIconInfo = (iconName) => {
    const names = {
        twitter: "Twitter/X",
        github: "GitHub",
        linkedin: "LinkedIn",
        instagram: "Instagram",
        youtube: "YouTube",
        facebook: "Facebook",
        tiktok: "TikTok",
        discord: "Discord",
        twitch: "Twitch",
        mail: "Email",
        telegram: "Telegram",
        buymeacoffee: "Buy Me a Coffee",
        kofi: "Ko-fi",
        medium: "Medium",
        substack: "Substack",
        behance: "Behance",
        dribbble: "Dribbble",
        spotify: "Spotify",
        steam: "Steam",
        whatsapp: "WhatsApp",
        pinterest: "Pinterest",
        snapchat: "Snapchat",
        reddit: "Reddit",
        vercel: "Vercel",
        supabase: "Supabase",
        netlify: "Netlify",
        railway: "Railway",
        render: "Render",
        resume: "Resume/CV",
        cv: "CV",
        document: "Document",
        drive: "Google Drive",
        gdrive: "Google Drive",
        notion: "Notion",
        link: "Website",
    };

    return {
        component: getIconComponent(iconName),
        displayName: names[iconName] || "Link",
    };
};
