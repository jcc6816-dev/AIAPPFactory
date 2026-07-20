export interface BreadcrumbJsonLdItem {
  name: string;
  url: string;
}

export function buildBreadcrumbListJsonLd(items: BreadcrumbJsonLdItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: {
        "@id": item.url,
        name: item.name,
      },
    })),
  };
}
