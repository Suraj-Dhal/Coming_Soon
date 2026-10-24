import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://surajdhal.com", changeFrequency: "monthly", priority: 1 }];
}
