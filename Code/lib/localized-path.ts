export function localizePath(locale: string, path: string) {
  if (!path || path.startsWith("http") || path.startsWith("#")) {
    return path;
  }

  const isZh = locale.toLowerCase().startsWith("zh");

  if (path === "/") {
    return isZh ? `/${locale}` : "/";
  }

  if (path.startsWith("/en/") || path === "/en") {
    const stripped = path.replace(/^\/en(?=\/|$)/, "") || "/";
    return isZh ? `/${locale}${stripped}` : stripped;
  }

  if (path.startsWith("/zh/") || path === "/zh") {
    return isZh ? path : path.replace(/^\/zh(?=\/|$)/, "") || "/";
  }

  return isZh
    ? `${path.startsWith("/") ? `/${locale}${path}` : `/${locale}/${path}`}`
    : path;
}
