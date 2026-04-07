
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  // Register Service Worker for PWA
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('✓ Booqlly PWA Service Worker registered:', registration.scope);
      } catch (error) {
        console.log('⚠️ Service Worker registration failed:', error);
      }
    });
  }

  createRoot(document.getElementById("root")!).render(<App />);
  