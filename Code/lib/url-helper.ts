/**
 * Sanitizes a redirect Location URL to strip ports like :80 or :3000 in production,
 * and upgrades protocol to https if it was downgraded by internal proxies.
 */
export function sanitizeRedirectUrl(location: string | null): string | null {
  if (!location) return null;
  
  if (location.startsWith("http://") || location.startsWith("https://")) {
    try {
      const locationUrl = new URL(location);
      // If the hostname is not localhost or 127.0.0.1, we strip the port
      if (locationUrl.hostname !== "localhost" && locationUrl.hostname !== "127.0.0.1") {
        locationUrl.port = "";
        // If protocol was downgraded to http by internal proxies, upgrade it to https in production
        if (locationUrl.protocol === "http:") {
          locationUrl.protocol = "https:";
        }
        return locationUrl.toString();
      }
    } catch (e) {
      // Ignore URL parsing errors
    }
  }
  
  return location;
}
