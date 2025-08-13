import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/tailwind.css";
import "./styles/index.css";

// Error handling for production
const handleError = (error) => {
  console.error('Application Error:', error);
  // In production, you might want to send this to an error reporting service
};

// Global error handler
window.addEventListener('error', (event) => {
  handleError(event?.error);
});

window.addEventListener('unhandledrejection', (event) => {
  handleError(event?.reason);
});

try {
  const container = document.getElementById("root");
  
  if (!container) {
    throw new Error('Root container not found');
  }
  
  const root = createRoot(container);
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  handleError(error);
  
  // Fallback rendering for critical errors
  const container = document.getElementById("root");
  if (container) {
    container.innerHTML = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        font-family: system-ui, -apple-system, sans-serif;
        background-color: #f8fafc;
        color: #334155;
        text-align: center;
        padding: 20px;
      ">
        <div>
          <h1 style="font-size: 24px; margin-bottom: 16px; color: #dc2626;">
            Application Failed to Start
          </h1>
          <p style="font-size: 16px; margin-bottom: 16px;">
            There was an error loading the application. Please refresh the page or contact support.
          </p>
          <button 
            onClick="window.location.reload()" 
            style="
              background-color: #3b82f6;
              color: white;
              padding: 12px 24px;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-size: 14px;
              font-weight: 500;
            "
          >
            Refresh Page
          </button>
        </div>
      </div>
    `;
  }
}