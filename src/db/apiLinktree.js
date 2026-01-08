/**
 * =============================================================================
 * LINKTREE API - Database Functions
 * =============================================================================
 * This file contains ALL the functions to interact with our linktree tables.
 * 
 * PATTERN USED: Each function follows this structure:
 *   1. Call Supabase (the database)
 *   2. Check for errors
 *   3. Return data or throw error
 * 
 * WHY SEPARATE FILE?
 *   - Keeps database logic separate from UI components
 *   - Easy to test and modify
 *   - Components just call these functions, don't worry about SQL
 * =============================================================================
 */

import { UAParser } from "ua-parser-js";
import supabase, { supabaseUrl } from "./supabase";

// =============================================================================
// LINKTREE MANAGEMENT
// =============================================================================

/**
 * Get the current user's linktree
 * Used on the editor page to load existing data
 * 
 * @param {string} user_id - The logged-in user's ID
 * @returns {Object|null} - The linktree data or null if none exists
 */
export async function getLinktree(user_id) {
    const { data, error } = await supabase
        .from("linktrees")
        .select("*")
        .eq("user_id", user_id)
        .single();

    // PGRST116 = "No rows found" - this is okay, user just doesn't have one yet
    if (error && error.code !== "PGRST116") {
        console.error("Error fetching linktree:", error);
        throw new Error("Unable to load linktree");
    }

    return data;
}

/**
 * Get a linktree by its short URL
 * Used on the PUBLIC page when someone visits yoursite.com/shivanshu
 * 
 * @param {string} short_url - The short code (e.g., "shivanshu")
 * @returns {Object|null} - The linktree data or null if not found
 */
export async function getLinktreeByShortUrl(short_url) {
    const { data, error } = await supabase
        .from("linktrees")
        .select("*")
        .eq("short_url", short_url)
        .single();

    if (error) {
        if (error.code === "PGRST116") return null; // Not found
        console.error("Error fetching linktree by short URL:", error);
        return null;
    }

    return data;
}

/**
 * Create a NEW linktree for a user
 * Called when user first sets up their linktree
 * 
 * @param {string} user_id - The user's ID
 * @param {Object} linktreeData - { title, bio, avatar_url, theme_color, bg_color }
 * @param {string} short_url - The short URL code
 */
export async function createLinktree(user_id, linktreeData, short_url) {
    const { data, error } = await supabase
        .from("linktrees")
        .insert({
            user_id,
            short_url,
            ...linktreeData,
        })
        .select()
        .single();

    if (error) {
        // 23505 = unique constraint violation (short_url already taken)
        if (error.code === "23505") {
            throw new Error("This URL is already taken");
        }
        console.error("Error creating linktree:", error);
        throw new Error("Unable to create linktree");
    }

    return data;
}

/**
 * Update an existing linktree
 * Called when user edits their title, bio, colors, etc.
 * 
 * @param {string} id - The linktree's UUID
 * @param {Object} updates - Fields to update
 */
export async function updateLinktree(id, updates) {
    const { data, error } = await supabase
        .from("linktrees")
        .update({
            ...updates,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        if (error.code === "23505") {
            throw new Error("This URL is already taken");
        }
        console.error("Error updating linktree:", error);
        throw new Error("Unable to update linktree");
    }

    return data;
}

/**
 * Upload an avatar image for the linktree
 * Returns the public URL to store in the database
 * 
 * @param {string} user_id - For unique filename
 * @param {File} file - The image file
 */
export async function uploadLinktreeAvatar(user_id, file) {
    const fileName = `linktree-avatar-${user_id}-${Date.now()}`;

    const { error: uploadError } = await supabase.storage
        .from("qrs") // Reusing existing bucket - you could create a new one
        .upload(fileName, file, { upsert: true });

    if (uploadError) {
        console.error("Error uploading avatar:", uploadError);
        throw new Error("Unable to upload avatar");
    }

    // Construct the public URL
    const avatarUrl = `${supabaseUrl}/storage/v1/object/public/qrs/${fileName}`;
    return avatarUrl;
}

// =============================================================================
// LINK MANAGEMENT
// =============================================================================

/**
 * Get all links for a linktree
 * Ordered by order_index so drag-and-drop order is preserved
 * 
 * @param {string} linktree_id - The linktree's UUID
 */
export async function getLinktreeLinks(linktree_id) {
    const { data, error } = await supabase
        .from("linktree_links")
        .select("*")
        .eq("linktree_id", linktree_id)
        .order("order_index", { ascending: true });

    if (error) {
        console.error("Error fetching links:", error);
        throw new Error("Unable to load links");
    }

    return data || [];
}

/**
 * Get ACTIVE links for public view
 * Only returns is_active = true links
 * 
 * @param {string} linktree_id - The linktree's UUID
 */
export async function getPublicLinktreeLinks(linktree_id) {
    const { data, error } = await supabase
        .from("linktree_links")
        .select("id, title, url, icon, order_index")
        .eq("linktree_id", linktree_id)
        .eq("is_active", true)
        .order("order_index", { ascending: true });

    if (error) {
        console.error("Error fetching public links:", error);
        return [];
    }

    return data || [];
}

/**
 * Add a new link to a linktree
 * Auto-detects the icon based on URL
 * 
 * @param {string} linktree_id - The linktree's UUID
 * @param {Object} linkData - { title, url }
 */
export async function addLinktreeLink(linktree_id, linkData) {
    // Get the highest order_index to add at the end
    const { data: existingLinks } = await supabase
        .from("linktree_links")
        .select("order_index")
        .eq("linktree_id", linktree_id)
        .order("order_index", { ascending: false })
        .limit(1);

    const nextOrder = (existingLinks?.[0]?.order_index ?? -1) + 1;

    const { data, error } = await supabase
        .from("linktree_links")
        .insert({
            linktree_id,
            title: linkData.title,
            url: linkData.url,
            icon: detectSocialIcon(linkData.url), // Auto-detect!
            order_index: nextOrder,
        })
        .select()
        .single();

    if (error) {
        console.error("Error adding link:", error);
        throw new Error("Unable to add link");
    }

    return data;
}

/**
 * Update an existing link
 * 
 * @param {string} link_id - The link's UUID
 * @param {Object} updates - Fields to update
 */
export async function updateLinktreeLink(link_id, updates) {
    // Re-detect icon if URL changed
    const updateData = { ...updates };
    if (updates.url) {
        updateData.icon = detectSocialIcon(updates.url);
    }

    const { data, error } = await supabase
        .from("linktree_links")
        .update(updateData)
        .eq("id", link_id)
        .select()
        .single();

    if (error) {
        console.error("Error updating link:", error);
        throw new Error("Unable to update link");
    }

    return data;
}

/**
 * Delete a link
 * 
 * @param {string} link_id - The link's UUID
 */
export async function deleteLinktreeLink(link_id) {
    const { error } = await supabase
        .from("linktree_links")
        .delete()
        .eq("id", link_id);

    if (error) {
        console.error("Error deleting link:", error);
        throw new Error("Unable to delete link");
    }

    return true;
}

/**
 * Reorder links after drag-and-drop
 * Updates order_index for each link
 * 
 * @param {string[]} orderedIds - Array of link IDs in new order
 */
export async function reorderLinktreeLinks(orderedIds) {
    // Update each link with its new order_index
    const updates = orderedIds.map((id, index) =>
        supabase
            .from("linktree_links")
            .update({ order_index: index })
            .eq("id", id)
    );

    await Promise.all(updates);
    return true;
}

// =============================================================================
// ANALYTICS
// =============================================================================

/**
 * Record a page view
 * Called every time someone visits the public linktree page
 * 
 * @param {string} linktree_id - The linktree's UUID
 */
export async function recordLinktreeView(linktree_id) {
    try {
        // Parse device/browser info
        const parser = new UAParser();
        const result = parser.getResult();
        const device_type = result.device?.type || "desktop";
        const browser = result.browser?.name || "Unknown";

        // Get location from IP (optional, might fail)
        let city = "Unknown";
        let country = "Unknown";

        try {
            const response = await fetch("https://ipapi.co/json");
            if (response.ok) {
                const locationData = await response.json();
                city = locationData.city || "Unknown";
                country = locationData.country_name || "Unknown";
            }
        } catch {
            // Location lookup failed, continue with Unknown
        }

        // Insert the view record
        await supabase.from("linktree_views").insert({
            linktree_id,
            device_type,
            browser,
            city,
            country,
        });
    } catch (error) {
        // Don't throw - analytics shouldn't break the page
        console.error("Error recording view:", error);
    }
}

/**
 * Get analytics data for a linktree
 * Returns views grouped by day, device, country, etc.
 * 
 * @param {string} linktree_id - The linktree's UUID
 * @param {number} days - How many days back to look (default 30)
 */
export async function getLinktreeAnalytics(linktree_id, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data: views, error } = await supabase
        .from("linktree_views")
        .select("*")
        .eq("linktree_id", linktree_id)
        .gte("viewed_at", startDate.toISOString())
        .order("viewed_at", { ascending: true });

    if (error) {
        console.error("Error fetching analytics:", error);
        throw new Error("Unable to load analytics");
    }

    // Process the raw data into useful stats
    const totalViews = views?.length || 0;

    // Group by date for chart
    const viewsByDate = {};
    views?.forEach((view) => {
        const date = new Date(view.viewed_at).toLocaleDateString();
        viewsByDate[date] = (viewsByDate[date] || 0) + 1;
    });

    // Group by device
    const viewsByDevice = {};
    views?.forEach((view) => {
        viewsByDevice[view.device_type] = (viewsByDevice[view.device_type] || 0) + 1;
    });

    // Group by country
    const viewsByCountry = {};
    views?.forEach((view) => {
        viewsByCountry[view.country] = (viewsByCountry[view.country] || 0) + 1;
    });

    // Group by browser
    const viewsByBrowser = {};
    views?.forEach((view) => {
        viewsByBrowser[view.browser] = (viewsByBrowser[view.browser] || 0) + 1;
    });

    return {
        totalViews,
        viewsByDate,
        viewsByDevice,
        viewsByCountry,
        viewsByBrowser,
    };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Auto-detect social media icon from URL
 * This makes the links look nicer with appropriate icons!
 * 
 * @param {string} url - The link URL
 * @returns {string} - Icon identifier
 */
function detectSocialIcon(url) {
    if (!url) return "link";

    const patterns = {
        twitter: /twitter\.com|x\.com/i,
        github: /github\.com/i,
        linkedin: /linkedin\.com/i,
        instagram: /instagram\.com/i,
        youtube: /youtube\.com|youtu\.be/i,
        tiktok: /tiktok\.com/i,
        facebook: /facebook\.com|fb\.com/i,
        discord: /discord\.gg|discord\.com/i,
        twitch: /twitch\.tv/i,
        spotify: /spotify\.com/i,
        medium: /medium\.com/i,
        dribbble: /dribbble\.com/i,
        behance: /behance\.net/i,
        figma: /figma\.com/i,
        notion: /notion\.so/i,
        mail: /^mailto:/i,
        whatsapp: /whatsapp\.com|wa\.me/i,
        telegram: /t\.me|telegram/i,
        pinterest: /pinterest\.com/i,
        snapchat: /snapchat\.com/i,
        reddit: /reddit\.com/i,
    };

    for (const [icon, pattern] of Object.entries(patterns)) {
        if (pattern.test(url)) return icon;
    }

    return "link"; // Default icon
}

/**
 * Check if a short URL is available
 * Used to validate before creating linktree
 * 
 * @param {string} short_url - The desired short URL
 * @returns {boolean} - True if available
 */
export async function isShortUrlAvailable(short_url) {
    // Check in linktrees table
    const { data: linktree } = await supabase
        .from("linktrees")
        .select("id")
        .eq("short_url", short_url)
        .single();

    if (linktree) return false;

    // Also check in urls table (regular short URLs)
    const { data: url } = await supabase
        .from("urls")
        .select("id")
        .or(`short_url.eq.${short_url},custom_url.eq.${short_url}`)
        .single();

    if (url) return false;

    return true;
}
