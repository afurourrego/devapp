import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://devapp.studio", changeFrequency: "monthly", priority: 1 }];
}
