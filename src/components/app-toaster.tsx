"use client";

import { Toaster } from "react-hot-toast";

export default function AppToaster() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3500,
        style: {
          background: "#1a211d",
          color: "#eeeae0",
          border: "1px solid #2c352f",
          borderRadius: "12px",
          padding: "12px 16px",
          fontSize: "15px",
        },
        success: {
          iconTheme: { primary: "#9ac8a0", secondary: "#101713" },
        },
        error: {
          iconTheme: { primary: "#f08a8a", secondary: "#101713" },
        },
      }}
    />
  );
}