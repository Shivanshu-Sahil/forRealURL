/**
 * =============================================================================
 * LINKTREE EDITOR PAGE
 * =============================================================================
 * This is where users create and manage their linktree.
 * 
 * Components:
 *   - SidebarProfile: Avatar, title, bio
 *   - ThemeSelector: Theme preset selection
 *   - ShareLink: URL customization and copy
 *   - LinksManager: Link list with CRUD operations
 *   - LivePreview: Real-time preview with theme
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { UrlState } from "@/context";
import useFetch from "@/hooks/use-fetch";
import { copyToClipboard } from "@/lib/copyToClipboard";
import { getAllThemes } from "@/lib/themes";
import { detectIconFromUrl } from "@/lib/iconUtils.jsx";
import toast from "react-hot-toast";

// Sub-components
import SidebarProfile from "@/components/linktree/SidebarProfile";
import ThemeSelector from "@/components/linktree/ThemeSelector";
import ShareLink from "@/components/linktree/ShareLink";
import LinksManager from "@/components/linktree/LinksManager";
import LivePreview from "@/components/linktree/LivePreview";

// API functions
import {
    getLinktree,
    createLinktree,
    updateLinktree,
    uploadLinktreeAvatar,
    getLinktreeLinks,
    addLinktreeLink,
    updateLinktreeLink,
    deleteLinktreeLink,
    isShortUrlAvailable,
} from "@/db/apiLinktree";

const Linktree = () => {
    const navigate = useNavigate();
    const { user, loading: userLoading } = UrlState();

    // ==========================================================================
    // STATE
    // ==========================================================================

    // Linktree data
    const [linktree, setLinktree] = useState(null);
    const [links, setLinks] = useState([]);

    // Form state
    const [title, setTitle] = useState("My Links");
    const [bio, setBio] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [themeColor, setThemeColor] = useState("#3b82f6");
    const [bgColor, setBgColor] = useState("#0f172a");
    const [shortUrl, setShortUrl] = useState("");

    // UI state
    const [copied, setCopied] = useState(false);
    const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
    const [editingLink, setEditingLink] = useState(null);
    const [newLinkTitle, setNewLinkTitle] = useState("");
    const [newLinkUrl, setNewLinkUrl] = useState("");
    const [hasChanges, setHasChanges] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState("neobrutalist");
    const [currentTheme, setCurrentTheme] = useState("neobrutalist");

    // All available themes
    const allThemes = getAllThemes();

    // ==========================================================================
    // API CALLS
    // ==========================================================================

    const { loading: loadingLinktree, fn: fnGetLinktree } = useFetch(getLinktree);
    const { loading: loadingLinks, fn: fnGetLinks } = useFetch(getLinktreeLinks);
    const { loading: saving, fn: fnSave } = useFetch(
        linktree ? updateLinktree : createLinktree
    );
    const { loading: addingLink, fn: fnAddLink } = useFetch(addLinktreeLink);
    const { loading: updatingLink, fn: fnUpdateLink } = useFetch(updateLinktreeLink);
    const { loading: deletingLink, fn: fnDeleteLink } = useFetch(deleteLinktreeLink);

    // ==========================================================================
    // LOAD DATA ON MOUNT
    // ==========================================================================

    useEffect(() => {
        if (user?.id) {
            loadLinktree();
        }
    }, [user?.id]);

    const loadLinktree = async () => {
        try {
            const data = await fnGetLinktree(user.id);
            if (data) {
                setLinktree(data);
                setTitle(data.title || "My Links");
                setBio(data.bio || "");
                setAvatarUrl(data.avatar_url || "");
                setThemeColor(data.theme_color || "#3b82f6");
                setBgColor(data.bg_color || "#0f172a");
                setShortUrl(data.short_url || "");
                setSelectedTheme(data.theme_preset || "neobrutalist");
                setCurrentTheme(data.theme_preset || "neobrutalist");

                const linksData = await fnGetLinks(data.id);
                setLinks(linksData || []);
            } else {
                setShortUrl(generateShortUrl());
            }
        } catch (error) {
            console.error("Error loading linktree:", error);
        }
    };

    // ==========================================================================
    // HANDLERS
    // ==========================================================================

    const generateShortUrl = () => {
        return Math.random().toString(36).substring(2, 8);
    };

    const handleSave = async () => {
        try {
            if (!shortUrl.trim()) {
                toast.error("Please enter a short URL");
                return;
            }

            if (linktree) {
                const updated = await fnSave(linktree.id, {
                    title,
                    bio,
                    avatar_url: avatarUrl,
                    theme_color: themeColor,
                    bg_color: bgColor,
                    short_url: shortUrl,
                    theme_preset: selectedTheme,
                });
                setLinktree(updated);
                toast.success("Linktree saved!");
            } else {
                const available = await isShortUrlAvailable(shortUrl);
                if (!available) {
                    toast.error("This URL is already taken");
                    return;
                }

                const created = await fnSave(
                    user.id,
                    {
                        title,
                        bio,
                        avatar_url: avatarUrl,
                        theme_color: themeColor,
                        bg_color: bgColor,
                        theme_preset: selectedTheme,
                    },
                    shortUrl
                );
                setLinktree(created);
                toast.success("Linktree created!");
            }
            setHasChanges(false);
            setCurrentTheme(selectedTheme);
        } catch (error) {
            toast.error(error.message || "Failed to save");
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const url = await uploadLinktreeAvatar(user.id, file);
            setAvatarUrl(url);
            setHasChanges(true);
            toast.success("Avatar uploaded!");
        } catch (error) {
            toast.error("Failed to upload avatar");
        }
    };

    // Save link with auto-detected icon
    const handleSaveLink = async () => {
        if (!newLinkTitle.trim() || !newLinkUrl.trim()) {
            toast.error("Please enter title and URL");
            return;
        }

        // Ensure URL has protocol
        let url = newLinkUrl.trim();
        if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("mailto:")) {
            url = "https://" + url;
        }

        // Auto-detect icon from URL
        const detectedIcon = detectIconFromUrl(url);

        try {
            if (editingLink) {
                const updated = await fnUpdateLink(editingLink.id, {
                    title: newLinkTitle,
                    url: url,
                    icon: detectedIcon, // Save detected icon
                });
                setLinks(links.map((l) => (l.id === editingLink.id ? updated : l)));
                toast.success("Link updated!");
            } else {
                if (!linktree) {
                    toast.error("Please save your linktree first");
                    return;
                }
                const added = await fnAddLink(linktree.id, {
                    title: newLinkTitle,
                    url: url,
                    icon: detectedIcon, // Save detected icon
                });
                setLinks([...links, added]);
                toast.success("Link added!");
            }

            setIsLinkDialogOpen(false);
            setEditingLink(null);
            setNewLinkTitle("");
            setNewLinkUrl("");
        } catch (error) {
            toast.error(error.message || "Failed to save link");
        }
    };

    const handleDeleteLink = async (linkId) => {
        try {
            await fnDeleteLink(linkId);
            setLinks(links.filter((l) => l.id !== linkId));
            toast.success("Link deleted!");
        } catch (error) {
            toast.error("Failed to delete link");
        }
    };

    const handleCopy = () => {
        const baseUrl = import.meta.env.VITE_CUSTOM_URL || window.location.origin;
        const fullUrl = `${baseUrl}/${shortUrl}`;
        copyToClipboard(fullUrl, "✓ Link copied!");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const openEditDialog = (link) => {
        setEditingLink(link);
        setNewLinkTitle(link.title);
        setNewLinkUrl(link.url);
        setIsLinkDialogOpen(true);
    };

    const openAddDialog = () => {
        setEditingLink(null);
        setNewLinkTitle("");
        setNewLinkUrl("");
        setIsLinkDialogOpen(true);
    };

    // ==========================================================================
    // LOADING STATE
    // ==========================================================================

    if (userLoading || loadingLinktree) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-foreground border-t-primary animate-spin"></div>
            </div>
        );
    }

    // ==========================================================================
    // RENDER
    // ==========================================================================

    const baseUrl = import.meta.env.VITE_CUSTOM_URL || window.location.origin;

    return (
        <div className="min-h-screen relative" style={{ backgroundColor: '#0a0a0a' }}>
            {/* Dotted neobrutalist background */}
            <div
                className="fixed inset-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }}
            />

            {/* Top Navigation Bar */}
            <div className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Button
                        onClick={() => navigate("/dashboard")}
                        className="neo-button bg-white text-black border-black gap-2 shadow-[4px_4px_0px_#ffe500]"
                    >
                        ← Dashboard
                    </Button>

                    <h1 className="text-xl font-display text-white hidden md:block">
                        🔗 <span className="text-black bg-neo-purple px-3 py-1 border-2 border-white">
                            {user?.user_metadata?.name || user?.email?.split('@')[0] || 'Your'}'s Linktree
                        </span>
                    </h1>

                    {linktree && (
                        <Button
                            onClick={() => navigate("/linktree/analytics")}
                            className="neo-button bg-neo-pink text-black border-black gap-2 shadow-[4px_4px_0px_#ffffff]"
                        >
                            <BarChart3 className="w-4 h-4" />
                            Analytics
                        </Button>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 pt-20 pb-8 min-h-screen">
                {/* 3-Column Grid Layout */}
                <div className="grid lg:grid-cols-3 gap-4 h-[calc(100vh-120px)]">
                    {/* Column 1 - Profile & Theme */}
                    <div className="space-y-4 overflow-y-auto">
                        <SidebarProfile
                            avatarUrl={avatarUrl}
                            handleAvatarUpload={handleAvatarUpload}
                            title={title}
                            setTitle={setTitle}
                            setHasChanges={setHasChanges}
                            bio={bio}
                            setBio={setBio}
                        />

                        <ThemeSelector
                            allThemes={allThemes}
                            selectedTheme={selectedTheme}
                            setSelectedTheme={setSelectedTheme}
                            setHasChanges={setHasChanges}
                            currentTheme={currentTheme}
                        />

                        <ShareLink
                            baseUrl={baseUrl}
                            shortUrl={shortUrl}
                            setShortUrl={setShortUrl}
                            setHasChanges={setHasChanges}
                            handleCopy={handleCopy}
                            copied={copied}
                            handleSave={handleSave}
                            saving={saving}
                            hasChanges={hasChanges}
                        />
                    </div>

                    {/* Column 2 - Links Manager */}
                    <LinksManager
                        linktree={linktree}
                        links={links}
                        openAddDialog={openAddDialog}
                        openEditDialog={openEditDialog}
                        handleDeleteLink={handleDeleteLink}
                        deletingLink={deletingLink}
                    />

                    {/* Column 3 - Live Preview */}
                    <LivePreview
                        selectedTheme={selectedTheme}
                        currentTheme={currentTheme}
                        avatarUrl={avatarUrl}
                        title={title}
                        bio={bio}
                        links={links}
                        handleSave={handleSave}
                        saving={saving}
                        linktree={linktree}
                    />
                </div>
            </div>

            {/* Add/Edit Link Dialog */}
            <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
                <DialogContent className="bg-white border-4 border-black !shadow-[8px_8px_0px_#00d4ff] overflow-visible">
                    <DialogHeader>
                        <DialogTitle className="text-black text-xl font-bold">
                            {editingLink ? "Edit Link" : "Add New Link"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div>
                            <label className="text-sm font-bold text-black mb-1 block">Title</label>
                            <Input
                                value={newLinkTitle}
                                onChange={(e) => setNewLinkTitle(e.target.value)}
                                placeholder="e.g. My Portfolio"
                                className="bg-gray-100 border-2 border-black text-black focus:ring-0 focus:border-neo-blue"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-black mb-1 block">URL</label>
                            <Input
                                value={newLinkUrl}
                                onChange={(e) => setNewLinkUrl(e.target.value)}
                                placeholder="e.g. https://myportfolio.com"
                                className="bg-gray-100 border-2 border-black text-black focus:ring-0 focus:border-neo-blue"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                💡 Icon auto-detected from URL (Twitter, GitHub, etc.)
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="ghost"
                            onClick={() => setIsLinkDialogOpen(false)}
                            className="bg-gray-200 text-black border-2 border-black hover:bg-gray-300"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveLink}
                            disabled={addingLink || updatingLink}
                            className="neo-button bg-neo-green text-black border-black"
                        >
                            {addingLink || updatingLink ? "Saving..." : "Save Link"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Linktree;
