import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Burnrate Audit Results";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to bottom right, #000000, #1a0b02)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          color: "white",
          padding: "40px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px" }}>
          <div style={{ color: "#f97316", fontSize: 48, fontWeight: "bold" }}>Burnrate.</div>
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div style={{ fontSize: 40, color: "#a1a1aa", marginBottom: "20px" }}>
            Free AI Spend Audit for Startups
          </div>
          <div style={{ fontSize: 64, fontWeight: "bold", color: "white" }}>
            Stop burning money on AI tools.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
