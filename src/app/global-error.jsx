"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", textAlign: "center", fontFamily: "sans-serif" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 600 }}>Something went wrong</h1>
          <p style={{ marginTop: "8px", color: "#666" }}>The application encountered a critical error.</p>
          <button
            onClick={reset}
            style={{ marginTop: "24px", padding: "10px 20px", background: "#C9A227", color: "#0A1424", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}