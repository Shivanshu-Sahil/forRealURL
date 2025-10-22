import {UAParser} from "ua-parser-js";
import supabase from "./supabase";

// export async function getClicks() {
//   let {data, error} = await supabase.from("clicks").select("*");

//   if (error) {
//     console.error(error);
//     throw new Error("Unable to load Stats");
//   }

//   return data;
// }

export async function getClicksForUrls(urlIds) {
  const {data, error} = await supabase
    .from("clicks")
    .select("*")
    .in("url_id", urlIds);

  if (error) {
    console.error("Error fetching clicks:", error);
    return null;
  }

  return data;
}

export async function getClicksForUrl(url_id) {
  const {data, error} = await supabase
    .from("clicks")
    .select("*")
    .eq("url_id", url_id);

  if (error) {
    console.error(error);
    throw new Error("Unable to load Stats");
  }

  return data;
}

// Track recent click recordings to prevent duplicates
const recentClicks = new Map();

export const storeClicks = async ({id, originalUrl}) => {
  try {
    // Create a unique key for this click
    const clickKey = `${id}-${Date.now()}`;
    const now = Date.now();
    
    // Check if this URL was clicked very recently (within 2 seconds)
    if (recentClicks.has(id)) {
      const lastClickTime = recentClicks.get(id);
      if (now - lastClickTime < 2000) {
        console.log("Duplicate click detected, skipping...");
        // Still redirect even if we skip recording
        window.location.href = originalUrl;
        return;
      }
    }
    
    // Mark this URL as recently clicked
    recentClicks.set(id, now);
    
    // Clean up old entries (older than 5 seconds)
    for (const [key, time] of recentClicks.entries()) {
      if (now - time > 5000) {
        recentClicks.delete(key);
      }
    }

    const parser = new UAParser();
    const res = parser.getResult();
    const device_type = res.device?.type || "desktop";
    const browser = res.browser?.name || "Unknown";

    // Fetch location data
    const response = await fetch("https://ipapi.co/json");
    if (!response.ok) {
      throw new Error("Failed to fetch location data");
    }
    const {city, country_name: country, ip} = await response.json();

    // Validate required fields
    if (!id || !originalUrl) {
      throw new Error("Missing required fields: id or originalUrl");
    }

    // Record the click
    const {error} = await supabase.from("clicks").insert({
      url_id: id,
      city: city || "Unknown",
      country: country || "Unknown",
      device_type: device_type,
      browser: browser,
    });

    if (error) {
      throw new Error(`Supabase insertion error: ${error.message}`);
    }

    // Redirect to the original URL
    window.location.href = originalUrl;
  } catch (error) {
    console.error("Error recording click:", error);
    // Still try to redirect even if recording fails
    if (originalUrl) {
      window.location.href = originalUrl;
    }
  }
};