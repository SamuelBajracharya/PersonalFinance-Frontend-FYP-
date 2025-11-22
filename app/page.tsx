"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function Home() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  function isPWAInstalled() {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    );
  }

  useEffect(() => {
    // 1️⃣ Check if app is installed ON THIS DEVICE
    if (isPWAInstalled()) {
      router.replace("/auth/register");
      return;
    }

    // If not installed → show UI
    setLoading(false);

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }

    // Capture install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, [router]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert("PWA install not available yet.");
      return;
    }

    // Show native install popup
    await deferredPrompt.prompt();

    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      router.push("/auth/register");
    }

    setDeferredPrompt(null);
  };

  // 2️⃣ Loading while detecting PWA installation
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="animate-pulse text-lg">Checking app status...</div>
      </main>
    );
  }

  // 3️⃣ If not installed → show installer
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
