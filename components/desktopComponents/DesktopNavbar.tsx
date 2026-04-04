"use client";

import React from "react";
import { Avatar } from "antd";
import { useRouter, usePathname } from "next/navigation";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useThemeStore } from "@/stores/useThemeStore";
import { useCurrentUser } from "@/hooks/useAuth";

const DesktopNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const { data: user } = useCurrentUser();

  const isProfile = pathname === "/profile";

  const getTitle = (path: string) => {
    if (path === "/budgetgoals") return "Budget Goals";
    if (path === "/mystocks") return "My Stocks";

    const words = path.replace(/^\//, "").split(/[-\/]/);

    const capitalized = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    );

    return capitalized.join(" ") || "Dashboard";
  };

  const title = getTitle(pathname);
  const displayName = user?.name || "Profile";
  const avatarSrc = user?.profile_image_url || "https://xsgames.co/randomusers/avatar.php?g=pixel";

  return (
    <div className="flex justify-between items-center h-full px-8 ">
      {/* Dynamic title */}
      <h1 className="text-2xl font-medium tracking-wide">{title}</h1>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggleTheme}
          className="transition-colors duration-200 p-1 rounded-full hover:bg-accent/20 cursor-pointer"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <MdLightMode className="size-7 text-primary" />
          ) : (
            <MdDarkMode className="size-7 text-primary" />
          )}
        </button>

        <div
          className={`flex items-center space-x-4 border-accent border px-4 py-2 rounded-xl cursor-pointer transition-colors duration-200 hover:bg-accent/20
          ${isProfile ? "bg-accent" : ""}`}
          onClick={() => router.push("/profile")}
        >
          <h2 className="text-lg font-normal">{displayName}</h2>
          <Avatar
            size={32}
            src={avatarSrc}
          />
        </div>
      </div>
    </div>
  );
};

export default DesktopNavbar;
