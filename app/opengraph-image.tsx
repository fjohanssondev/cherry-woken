import { ImageResponse } from "next/og";

import { site } from "@/data/menu";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} – ${site.kicker}`;

// Link-preview image (Open Graph / Twitter), generated at build time.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#1b1410",
          color: "#f3e6cf",
          padding: "80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <svg width="72" height="72" viewBox="0 0 100 100">
            <rect x="47" y="15" width="6" height="11" rx="3" fill="#e8c169" />
            <rect x="33" y="24" width="34" height="9" rx="3" fill="#e8c169" />
            <ellipse cx="50" cy="55" rx="30" ry="26" fill="#e0492f" />
            <rect x="33" y="77" width="34" height="9" rx="3" fill="#e8c169" />
            <rect x="47.5" y="86" width="5" height="9" rx="2.5" fill="#e8c169" />
          </svg>
          <div
            style={{
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#d98b7a",
            }}
          >
            {site.kicker}
          </div>
        </div>

        <div style={{ fontSize: 128, fontWeight: 700, marginTop: 24 }}>
          {site.name}
        </div>

        <div style={{ fontSize: 34, marginTop: 24, color: "#c9bda8", maxWidth: 920 }}>
          Thailändskt och kinesiskt kök. Allt wokas när ni beställer.
        </div>
      </div>
    ),
    { ...size }
  );
}
