import { UAParser } from "ua-parser-js";
import supabase, { supabaseUrl } from "./supabase";
import { detectIconFromUrl } from "../lib/iconUtils.jsx";

export async function getLinktree(user_id) {
    const { data, error } = await supabase
        .from("linktrees")
        .select("*")
        .eq("user_id", user_id)
        .single();

    // PGRST116 = no rows found (user hasn't created one yet)
    if (error && error.code !== "PGRST116") {
        console.error("Error fetching linktree:", error);
        throw new Error("Unable to load linktree");
    }

    return data;
}

export async function getLinktreeByShortUrl(short_url) {
    const { data, error } = await supabase
        .from("linktrees")
        .select("*")
        .eq("short_url", short_url)
        .single();

    if (error) {
        if (error.code === "PGRST116") return null;
        console.error("Error fetching linktree by short URL:", error);
        return null;
    }

    return data;
}

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
        // 23505 = unique constraint violation
        if (error.code === "23505") {
            throw new Error("This URL is already taken");
        }
        console.error("Error creating linktree:", error);
        throw new Error("Unable to create linktree");
    }

    return data;
}

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

export async function uploadLinktreeAvatar(user_id, file) {
    const fileName = `linktree-avatar-${user_id}-${Date.now()}`;

    const { error: uploadError } = await supabase.storage
        .from("qrs")
        .upload(fileName, file, { upsert: true });

    if (uploadError) {
        console.error("Error uploading avatar:", uploadError);
        throw new Error("Unable to upload avatar");
    }

    const avatarUrl = `${supabaseUrl}/storage/v1/object/public/qrs/${fileName}`;
    return avatarUrl;
}

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

export async function addLinktreeLink(linktree_id, linkData) {
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
            icon: detectIconFromUrl(linkData.url),
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

export async function updateLinktreeLink(link_id, updates) {
    const updateData = { ...updates };
    if (updates.url) {
        updateData.icon = detectIconFromUrl(updates.url);
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

export async function reorderLinktreeLinks(orderedIds) {
    const updates = orderedIds.map((id, index) =>
        supabase
            .from("linktree_links")
            .update({ order_index: index })
            .eq("id", id)
    );

    await Promise.all(updates);
    return true;
}

export async function recordLinktreeView(linktree_id) {
    try {
        const parser = new UAParser();
        const result = parser.getResult();
        const device_type = result.device?.type || "desktop";
        const browser = result.browser?.name || "Unknown";

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
            // Location lookup failed, continue with defaults
        }

        await supabase.from("linktree_views").insert({
            linktree_id,
            device_type,
            browser,
            city,
            country,
        });
    } catch (error) {
        console.error("Error recording view:", error);
    }
}

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

    const totalViews = views?.length || 0;

    const viewsByDate = {};
    views?.forEach((view) => {
        const date = new Date(view.viewed_at).toLocaleDateString();
        viewsByDate[date] = (viewsByDate[date] || 0) + 1;
    });

    const viewsByDevice = {};
    views?.forEach((view) => {
        viewsByDevice[view.device_type] = (viewsByDevice[view.device_type] || 0) + 1;
    });

    const viewsByCountry = {};
    views?.forEach((view) => {
        viewsByCountry[view.country] = (viewsByCountry[view.country] || 0) + 1;
    });

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

export async function isShortUrlAvailable(short_url) {
    const { data: linktree } = await supabase
        .from("linktrees")
        .select("id")
        .eq("short_url", short_url)
        .single();

    if (linktree) return false;

    const { data: url } = await supabase
        .from("urls")
        .select("id")
        .or(`short_url.eq.${short_url},custom_url.eq.${short_url}`)
        .single();

    if (url) return false;

    return true;
}
