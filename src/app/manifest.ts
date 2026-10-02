import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "News Era",
    short_name: "News Era",
    description: "Latest tech, cybersecurity and AI news, summarized with links to the original reporting.",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#1d4ed8",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/favicon.png", sizes: "394x396", type: "image/png" },
    ],
  };
}
