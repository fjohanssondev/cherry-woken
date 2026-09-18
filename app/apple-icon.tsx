import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// On-brand iOS home-screen icon (red lantern), generated at build time.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#b42a1e",
        }}
      >
        <svg width="150" height="150" viewBox="0 0 100 100">
          <rect x="47" y="15" width="6" height="11" rx="3" fill="#e8c169" />
          <rect x="33" y="24" width="34" height="9" rx="3" fill="#e8c169" />
          <ellipse cx="50" cy="55" rx="30" ry="26" fill="#f3e6cf" />
          <rect x="33" y="77" width="34" height="9" rx="3" fill="#e8c169" />
          <rect x="47.5" y="86" width="5" height="9" rx="2.5" fill="#e8c169" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
