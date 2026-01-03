"use client";

import Image from "next/image";
import { FiDownload } from "react-icons/fi";
import { PiStarFill } from "react-icons/pi";
import { FaYoutube, FaXTwitter } from "react-icons/fa6";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { PiInstagramLogoFill } from "react-icons/pi";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Checking app status...</div>
      </main>
    );
  }
  return (
    <>
      <nav className="w-full border-b border-accent/80 px-6 py-6 fixed top-0 left-0 bg-mainBG/60 backdrop-blur-sm z-50">
        <div className="mx-auto flex items-center justify-between px-12">
          <div className="flex gap-16">
            <div className="flex items-center">
              <Image src="/logo.png" width={160} height={100} alt="SaveMarga" />
            </div>
            <div className="hidden md:flex items-center space-x-10">
              <a
                href="#home"
                className="text-white cursor-pointer hover:text-blue-400"
              >
                Home
              </a>
              <a
                href="#features"
                className="text-white cursor-pointer hover:text-blue-400"
              >
                Features
              </a>
              <a
                href="#contactus"
                className="text-white cursor-pointer hover:text-blue-400 flex items-center"
              >
                Contact Us
              </a>
            </div>
          </div>
          <Link href="/auth/login">
            <button className="bg-blue-500 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-600 cursor-pointer">
              Log In
            </button>
          </Link>
        </div>
      </nav>
      <main className="min-h-screen flex flex-col items-center justify-center px-24 overflow-hidden">
        {/* SECTION 1 (Hero) */}
        <div
          id="home"
          className="w-full grid grid-cols-1 md:grid-cols-2 items-center pt-48 gap-10"
        >
          {/* LEFT TEXT */}
          <div className="relative z-20">
            <h1 className="text-5xl md:text-7xl font-bold text-[#FFAA2D] leading-tight">
              Think Ahead <br /> With Your Money
            </h1>

            <p className="text-gray-300 mt-8 max-w-2xl text-xl">
              Our AI learns your habits and nudges you before overspending so
              saving feels natural.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <button
                onClick={handleInstallClick}
                className="
              bg-primary px-10 py-8 rounded-full font-medium flex items-center justify-center gap-3 w-[230px] h-16 text-lg
              "
              >
                <FiDownload className="size-6" />
                <span className="leading-none text-white">Download</span>
              </button>

              <span className="text-gray-400 text-sm">
                Works on web, iOS & Android via PWA.
              </span>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="relative mt-20 md:mt-0 flex justify-center md:justify-end">
            {/* PIPE SVG */}
            <div
              className="absolute  top-50 right-[7rem] w-full "
              dangerouslySetInnerHTML={{
                __html: `
              <svg width="1700" height="1100" viewBox="200 0 900 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g filter="url(#filter0_dd_714_5296)">
                  <path d="M105 175C96.2014 175 87.489 176.733 79.3602 180.1C71.2314 183.467 63.8454 188.402 57.6238 194.624C51.4023 200.845 46.4671 208.231 43.1001 216.36C39.733 224.489 38 233.201 38 242H69.9992C69.9992 237.404 70.9045 232.852 72.6635 228.606C74.4224 224.359 77.0006 220.501 80.2507 217.251C83.5008 214.001 87.3593 211.422 91.6058 209.663C95.8523 207.905 100.404 206.999 105 206.999V175Z" fill="#2B74F5"/>
                  <rect x="105" y="175" width="749" height="32" fill="#2B74F5"/>
                  <rect x="38" y="242" width="32" height="237" fill="#2B74F5"/>
                  </g>
                  <g filter="url(#filter1_dd_714_5296)">
                  <path d="M265 15C256.201 15 247.489 16.733 239.36 20.1001C231.231 23.4671 223.845 28.4023 217.624 34.6238C211.402 40.8454 206.467 48.2314 203.1 56.3602C199.733 64.489 198 73.2014 198 82H229.999C229.999 77.4036 230.905 72.8523 232.663 68.6058C234.422 64.3593 237.001 60.5008 240.251 57.2507C243.501 54.0006 247.359 51.4224 251.606 49.6635C255.852 47.9045 260.404 46.9992 265 46.9992V15Z" fill="#2B74F5"/>
                  <rect x="265" y="15" width="589" height="32" fill="#2B74F5"/>
                  <rect x="198" y="82" width="32" height="397" fill="#2B74F5"/>
                  </g>
                  <g filter="url(#filter2_dd_714_5296)">
                  <path d="M185 95C176.201 95 167.489 96.733 159.36 100.1C151.231 103.467 143.845 108.402 137.624 114.624C131.402 120.845 126.467 128.231 123.1 136.36C119.733 144.489 118 153.201 118 162H149.999C149.999 157.404 150.905 152.852 152.663 148.606C154.422 144.359 157.001 140.501 160.251 137.251C163.501 134.001 167.359 131.422 171.606 129.663C175.852 127.905 180.404 126.999 185 126.999V95Z" fill="#FFAA2D"/>
                  <rect x="185" y="95" width="669" height="32" fill="#FFAA2D"/>
                  <rect x="118" y="162" width="32" height="317" fill="#FFAA2D"/>
                  </g>
                  </svg>
                  `,
              }}
            />

            {/* PHONE */}
            <section className="flex items-center justify-center h-150">
              <Image
                src={"/hero.png"}
                alt="hero image"
                width={400}
                height={240}
                className=" z-10 mr-24 mt-16"
              />
            </section>
          </div>
        </div>
        {/* SECTION 2 (Desktop Image) */}
        <div className="w-full items-center pt-40">
          <div className="relative z-20">
            <Image
              src={"/desktopDemo.png"}
              alt="desktop Image"
              width={1200}
              height={80}
              className="z-1 mx-auto"
            />
          </div>
        </div>
        <section
          id="features"
          className="relative w-full pb-24 overflow-hidden"
        >
          {/* ===== Background Pipes SVG ===== */}
          <div
            className="absolute -left-7 top-0 z-2
              w-full pointer-events-none select-none"
            dangerouslySetInnerHTML={{
              __html: `
            <svg width="1700" height="1100" viewBox="200 0 900 800" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#filter0_dd_714_5323)">
                <path d="M749 368C757.799 368 766.511 366.267 774.64 362.9C782.769 359.533 790.155 354.598 796.376 348.376C802.598 342.155 807.533 334.769 810.9 326.64C814.267 318.511 816 309.799 816 301H784.001C784.001 305.596 783.095 310.148 781.337 314.394C779.578 318.641 776.999 322.499 773.749 325.749C770.499 328.999 766.641 331.578 762.394 333.337C758.148 335.095 753.596 336.001 749 336.001V368Z" fill="#2B74F5"/>
                <rect x="749" y="368" width="749" height="32" transform="rotate(180 749 368)" fill="#2B74F5"/>
                <rect x="816" y="301" width="32" height="301" transform="rotate(180 816 301)" fill="#2B74F5"/>
              </g>
              <g filter="url(#filter1_dd_714_5323)">
                <path d="M589 510C597.799 510 606.511 508.267 614.64 504.9C622.769 501.533 630.155 496.598 636.376 490.376C642.598 484.155 647.533 476.769 650.9 468.64C654.267 460.511 656 451.799 656 443H624.001C624.001 447.596 623.095 452.148 621.337 456.394C619.578 460.641 616.999 464.499 613.749 467.749C610.499 470.999 606.641 473.578 602.394 475.337C598.148 477.095 593.596 478.001 589 478.001V510Z" fill="#2B74F5"/>
                <rect x="589" y="510" width="589" height="32" transform="rotate(180 589 510)" fill="#2B74F5"/>
                <rect x="656" y="443" width="32" height="443" transform="rotate(180 656 443)" fill="#2B74F5"/>
              </g>
              <g filter="url(#filter2_dd_714_5323)">
                <path d="M669 443C677.799 443 686.511 441.267 694.64 437.9C702.769 434.533 710.155 429.598 716.376 423.376C722.598 417.155 727.533 409.769 730.9 401.64C734.267 393.511 736 384.799 736 376H704.001C704.001 380.596 703.095 385.148 701.337 389.394C699.578 393.641 696.999 397.499 693.749 400.749C690.499 403.999 686.641 406.578 682.394 408.337C678.148 410.095 673.596 411.001 669 411.001V443Z" fill="#FFAA2D"/>
                <rect x="669" y="443" width="669" height="32" transform="rotate(180 669 443)" fill="#FFAA2D"/>
                <rect x="736" y="376" width="32" height="376" transform="rotate(180 736 376)" fill="#FFAA2D"/>
              </g>
            </svg>
          `,
            }}
          />

          {/* ===== Content Layout ===== */}
          <div className="relative grid md:grid-cols-2 gap-10 items-center z-10 px-6 mt-48">
            <div className="flex justify-center">
              <section className="flex items-center justify-center h-150">
                <Image
                  src={"/feature.png"}
                  alt="feature image"
                  width={400}
                  height={240}
                  className=" z-10 mr-24 mt-16"
                />
              </section>
            </div>

            <div className="text-left md:pl-[220px]">
              <h1 className="text-4xl md:text-5xl font-bold text-primary leading-snug">
                Proactive Budget Alerts
                <br />
                That Keep You on Track
              </h1>

              <p className="text-lg text-gray-300 mt-6">
                Never let unexpected expenses catch you off guard. Receive
                timely alerts when you&apos;re nearing your budget limits, along
                with practical suggestions on how to adjust, save, or reallocate
                funds for the rest of the month.
              </p>
            </div>
          </div>
        </section>
        <section className="my-24">
          <div className="w-full max-w-7xl min-h-40 bg-accent flex flex-col rounded-2xl p-24">
            <p className="text-2xl tracking-wide">
              &quot; This app is a lifesaver! The AI alerts are genius. It
              warned me I was going to overspend on shopping, and I actually
              listened. I&apos;ve never saved this much money in a single month.
              Thank you! &quot;
            </p>
            <div className="flex items-center gap-8 mt-12">
              <div className="text-right size-32 rounded-full overflow-hidden bg-white">
                <Image
                  src={"/user1.jpg"}
                  alt="user image"
                  width={80}
                  height={80}
                />
              </div>
              <div className="mt-6 text-left">
                <h2 className="text-2xl font-semibold">Alex Johnson</h2>
                <div className="flex items-center gap-2 text-primary">
                  <PiStarFill className="size-6" />
                  <PiStarFill className="size-6" />
                  <PiStarFill className="size-6" />
                  <PiStarFill className="size-6" />
                  <PiStarFill className="size-6" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-24" id="contactus">
          <div className="grid lg:grid-cols-2 gap-10 px-6 lg:px-12 items-center">
            {/* LEFT SIDE */}
            <div>
              <h2 className="text-4xl md:text-6xl font-bold text-primary leading-tight tracking-wide">
                Questions? Let’s talk!
              </h2>

              <p className="text-gray-300 mt-4 text-xl">
                Contact us. We’re always happy to help!
              </p>

              {/* Email Input */}
              <div className="mt-12 flex gap-6 items-center">
                <input
                  type="email"
                  placeholder="email here"
                  className="w-full md:w-[450px] h-[60px] bg-secondaryBG text-lg py-4 px-6 rounded-full outline-none placeholder-gray-400"
                />

                <button className=" bg-primary hover:primary/80 h-[60px] transition font-semibold text-lg py-3 px-14 rounded-full">
                  Contact Us
                </button>
              </div>
            </div>

            {/* RIGHT SIDE IMAGE */}
            <div className="flex justify-center w-[300px] h-[600px] mx-auto border-4 border-primary rounded-xl overflow-hidden">
              <Image
                src={"/contactus.png"}
                alt="contact us image"
                width={400}
                height={240}
                className=" z-10"
              />
            </div>
          </div>
        </section>
        <footer className="border-t-1 border-accent text-white py-12 w-full">
          <div className="flex items-center justify-between">
            <p className="mb-2 text-lg">SaveMarga @ 2025</p>
            <div className="mb-2">
              <a href="#" className="mx-4 text-md hover:underline">
                Terms of Service
              </a>
              <a href="#" className="mx-4 text-md hover:underline">
                Privacy Policy
              </a>
              <a href="#" className="mx-4 text-md hover:underline">
                Manage Cookies
              </a>
            </div>
            <div className="mt-2 flex justify-center">
              <a href="#" className="mx-3">
                <FaYoutube className="w-6 h-6" />
              </a>
              <a href="#" className="mx-3">
                <FaFacebook className="w-6 h-6" />
              </a>
              <a href="#" className="mx-3">
                <FaXTwitter className="w-6 h-6" />
              </a>
              <a href="#" className="mx-3">
                <PiInstagramLogoFill className="w-6 h-6" />
              </a>
              <a href="#" className="mx-3">
                <FaLinkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
