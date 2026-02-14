import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
    Link as LinkIcon,
} from "lucide-react";

import {
    getPublicLinktreeLinks,
    recordLinktreeView,
} from "@/db/apiLinktree";
import { getTheme } from "@/lib/themes";
import supabase from "@/db/supabase";

const ICON_MAP = {
    twitter: Twitter,
    github: Github,
    linkedin: Linkedin,
    instagram: Instagram,
    youtube: Youtube,
    facebook: Facebook,
    tiktok: Music2,
    discord: MessageCircle,
    twitch: Twitch,
    mail: Mail,
    telegram: Send,
    whatsapp: MessageCircle,
    spotify: Music2,
    medium: ExternalLink,
    dribbble: ExternalLink,
    behance: ExternalLink,
    figma: ExternalLink,
    notion: ExternalLink,
    reddit: MessageCircle,
    pinterest: ExternalLink,
    snapchat: ExternalLink,
    link: ExternalLink,
};

const LinktreeView = () => {
    const { id } = useParams();

    const [linktree, setLinktree] = useState(null);
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadLinktree();
    }, [id]);

    const loadLinktree = async () => {
        try {
            setLoading(true);

            const { data: ltData, error: ltError } = await supabase
                .from("linktrees")
                .select("*")
                .eq("id", id)
                .single();

            if (ltError || !ltData) {
                setError("Linktree not found");
                setLoading(false);
                return;
            }

            setLinktree(ltData);

            const linksData = await getPublicLinktreeLinks(ltData.id);
            setLinks(linksData || []);

            // Record view async, don't block render
            recordLinktreeView(ltData.id);

        } catch (err) {
            console.error("Error loading linktree:", err);
            setError("Failed to load linktree");
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (iconName) => {
        const Icon = ICON_MAP[iconName] || ICON_MAP.link;
        return <Icon className="w-5 h-5" />;
    };

    if (loading) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{ backgroundColor: "#0f172a" }}
            >
                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !linktree) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="bg-card border-3 border-foreground shadow-neo p-8 text-center max-w-md">
                    <div className="w-16 h-16 bg-neo-pink border-3 border-foreground mx-auto mb-4 flex items-center justify-center">
                        <LinkIcon className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                        Linktree Not Found
                    </h1>
                    <p className="text-muted-foreground mb-4">
                        This linktree doesn't exist or has been removed.
                    </p>
                    <Link
                        to="/"
                        className="inline-block px-6 py-3 bg-neo-yellow border-3 border-foreground font-bold shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        );
    }

    const theme = getTheme(linktree.theme_preset || "neobrutalist");
    const styles = theme.styles;

    return (
        <div
            className="min-h-screen py-12 px-4"
            style={{
                background: styles.background,
                fontFamily: styles.fontFamily || "inherit",
            }}
        >
            <div className="max-w-md mx-auto">
                {/* Profile */}
                <div className="text-center mb-8">
                    {linktree.avatar_url ? (
                        <div
                            className="w-24 h-24 mx-auto mb-4 overflow-hidden"
                            style={{
                                borderRadius: styles.borderRadius || "50%",
                                border: styles.cardBorder,
                                boxShadow: styles.cardShadow,
                            }}
                        >
                            <img
                                src={linktree.avatar_url}
                                alt={linktree.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div
                            className="w-24 h-24 mx-auto mb-4 flex items-center justify-center text-4xl"
                            style={{
                                backgroundColor: styles.buttonBg,
                                borderRadius: styles.borderRadius || "50%",
                                border: styles.cardBorder,
                            }}
                        >
                            👤
                        </div>
                    )}

                    <h1
                        className="text-2xl mb-2"
                        style={{
                            color: styles.textColor,
                            fontWeight: styles.fontWeight || "700",
                        }}
                    >
                        {linktree.title || "My Links"}
                    </h1>

                    {linktree.bio && (
                        <p
                            className="text-sm opacity-80"
                            style={{ color: styles.textColor }}
                        >
                            {linktree.bio}
                        </p>
                    )}
                </div>

                {/* Links */}
                <div className="space-y-3">
                    {links.map((link) => (
                        <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full p-4 transition-all hover:scale-[1.02]"
                            style={{
                                backgroundColor: styles.buttonBg,
                                color: styles.textColor,
                                border: styles.buttonBorder,
                                borderRadius: styles.borderRadius,
                                boxShadow: styles.cardShadow,
                                backdropFilter: styles.backdropFilter,
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = styles.buttonHover;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = styles.buttonBg;
                            }}
                        >
                            <div className="flex items-center justify-center gap-3">
                                {getIcon(link.icon)}
                                <span style={{ fontWeight: styles.fontWeight || "700" }}>
                                    {link.title}
                                </span>
                            </div>
                        </a>
                    ))}
                </div>

                {links.length === 0 && (
                    <div
                        className="text-center py-8 opacity-60"
                        style={{ color: styles.textColor }}
                    >
                        <p>No links yet</p>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-12 text-center">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-sm opacity-50 hover:opacity-100 transition-opacity"
                        style={{ color: styles.textColor }}
                    >
                        <LinkIcon className="w-4 h-4" />
                        <span>Made with forReal.URL</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LinktreeView;
