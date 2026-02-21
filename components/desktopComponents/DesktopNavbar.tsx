"use client";

import React from "react";
import { Avatar } from "antd";
import { useRouter, usePathname } from "next/navigation";

const DesktopNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();

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

  return (
    <div className="flex justify-between items-center h-full px-8 ">
      {/* Dynamic title */}
      <h1 className="text-2xl font-medium tracking-wide">{title}</h1>

      <div
        className={`flex items-center space-x-4 border-accent border px-4 py-2 rounded-xl cursor-pointer transition-colors duration-200 hover:bg-accent/20
          ${isProfile ? "bg-accent" : ""}`}
        onClick={() => router.push("/profile")}
      >
        <h2 className="text-lg font-normal">Samuel Bajracharya</h2>
        <Avatar
          size={32}
          src="https://xsgames.co/randomusers/avatar.php?g=pixel"
        />
      </div>
    </div>
  );
};

export default DesktopNavbar;
