import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rabituza",
    short_name: "Rabituza",
    description: "Track & Train",
    start_url: "/",
    display: "standalone",
    background_color: "#1a2e05",
    theme_color: "#a3e635",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}