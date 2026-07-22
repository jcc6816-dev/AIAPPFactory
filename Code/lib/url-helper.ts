/**
 * Sanitizes a redirect Location URL to strip ports like :80 or :3000 in production,
 * and upgrades protocol to https if it was downgraded by internal proxies.
 *
 * Next.js 15.2+ standalone binds HOSTNAME=0.0.0.0 and may emit absolute redirects
 * whose host is the bind address (0.0.0.0) instead of the public domain.
 * When requestHost (the request's Host header) is provided, rewrite such
 * unspecified-host Locations back to the real public host.
 */
export function sanitizeRedirectUrl(
  location: string | null,
  requestHost?: string | null
): string | null {
  if (!location) return null;
  
  if (location.startsWith("http://") || location.startsWith("https://")) {
    try {
      const locationUrl = new URL(location);
      const hostname = locationUrl.hostname;
      const isUnspecifiedHost =
        hostname === "0.0.0.0" || hostname === "::" || hostname === "[::]";

      if (isUnspecifiedHost && requestHost) {
        locationUrl.host = requestHost;
        const isLocalRequest =
          requestHost.includes("localhost") || requestHost.startsWith("127.");
        if (!isLocalRequest) {
          // The Host header reconstructed by the standalone server may carry
          // the internal listen port (e.g. genforms.ai:80). Strip it for
          // public hosts and force https, matching the original behavior.
          locationUrl.port = "";
          if (locationUrl.protocol === "http:") {
            locationUrl.protocol = "https:";
          }
        }
        return locationUrl.toString();
      }

      // If the hostname is not localhost or 127.0.0.1, we strip the port
      if (hostname !== "localhost" && hostname !== "127.0.0.1") {
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
