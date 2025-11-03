"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Register Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(() => {
        console.log("✅ SW registered");
      });
    }

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      console.log("🔥 beforeinstallprompt fired!");
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      console.log("🎉 App installed!");
      // Add a small delay so router navigation works correctly
      setTimeout(() => {
        router.push("/auth/register");
      }, 500);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [router]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log("❌ PWA install not available yet.");
      alert("PWA install not available yet.");
      return;
    }

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    console.log("User choice:", choice.outcome);
    setDeferredPrompt(null);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <button
        onClick={handleInstallClick}
        className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full text-lg font-semibold transition"
      >
        Install PWA
      </button>
    </main>
  );
}
