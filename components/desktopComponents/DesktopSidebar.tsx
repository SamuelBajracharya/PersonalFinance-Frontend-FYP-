"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GoHomeFill } from "react-icons/go";
import { AiFillPieChart } from "react-icons/ai";
import { IoTrophy } from "react-icons/io5";
import { FaPiggyBank } from "react-icons/fa6";
import { FaChartLine } from "react-icons/fa6";
import { IoMdHelpCircle } from "react-icons/io";
import { PiChatCircleTextFill } from "react-icons/pi";
import { useSidebarIconColor } from "./useSidebarIconColor";
// import Image from "next/image"; // Duplicate import removed

import Image from "next/image";
import Logo from "../gloabalComponents/Logo";


const DesktopSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState(pathname);

  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  const mainNav = [
    { href: "/dashboard", label: "Home", icon: (isActive: boolean, color: string) => <GoHomeFill size={20} color={color} /> },
    {
      href: "/analytics",
      label: "Analytics",
      icon: (isActive: boolean, color: string) => <AiFillPieChart size={20} color={color} />,
    },
    {
      href: "/transactions",
      label: "Transactions",
      icon: (isActive: boolean, color: string) => (
        <Image
          src={color === "#0f1724" ? "/transactionHistory.svg" : "/transactionHistoryWhite.svg"}
          alt="Transaction History"
          width={20}
          height={20}
          className="w-5 h-5"
          priority
        />
      ),
    },
    {
      href: "/budgetgoals",
      label: "Budget Goals",
      icon: (isActive: boolean, color: string) => <FaPiggyBank size={20} color={color} />,
    },
    {
      href: "/mystocks",
      label: "My Stocks",
      icon: (isActive: boolean, color: string) => <FaChartLine size={18} color={color} />,
    },
    {
      href: "/ai-assistant",
      label: "AI Assistant",
      icon: (isActive: boolean, color: string) => <PiChatCircleTextFill size={22} color={color} />,
    },
    { href: "/rewards", label: "Rewards", icon: (isActive: boolean, color: string) => <IoTrophy size={18} color={color} /> },
  ];

  const supportNav = [
    {
      href: "/help",
      label: "Help & Support",
      icon: <IoMdHelpCircle size={22} />,
    },
  ];

  return (
    <aside
      className="fixed top-4 left-4 bg-secondaryBG rounded-2xl shadow-lg flex flex-col p-4 z-50"
      style={{
        width: "calc(300px - 16px)",
        height: "calc(100vh - 32px)",
      }}
    >
      {/* Logo */}
      <div className="h-20 flex items-center justify-center text-textmain text-2xl font-semibold">
        <Logo width={180} />
      </div>

      {/* Main navigation */}
      <nav className="flex-1 mt-4 space-y-2">
        {mainNav.map((item) => {
          // Robust active check: exact match or pathname starts with href and next char is / or end
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && (pathname[item.href.length] === "/" || pathname.length === item.href.length));
          const color = useSidebarIconColor(isActive);
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`flex items-center gap-3 w-full p-2 rounded-full transition-colors cursor-pointer
                ${isActive
                  ? "bg-accent font-semibold"
                  : "hover:bg-accent/60"
                }
              `}
            >
              {/* Icon wrapper */}
              <div
                className={`flex items-center justify-center w-8 h-8 ${isActive ? "bg-yellow-400" : ""} rounded-full`}
              >
                {item.icon(isActive, color)}
              </div>
              <div
                className={`truncate font-normal ${isActive ? "text-white" : "text-textmain"}`}
              >
                {item.label}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Bottom navigation */}
      <nav className="mt-auto pt-4 border-t border-textmain/20 space-y-2 ">
        {supportNav.map((item) => {
          // Robust active check for support nav as well
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && (pathname[item.href.length] === "/" || pathname.length === item.href.length));
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`flex items-center gap-3 w-full p-2 rounded-full transition-colors cursor-pointer
                ${isActive
                  ? "bg-accent"
                  : "hover:bg-accent/60"
                }
              `}
            >
              <div
                className={`flex items-center justify-center size-8 ${isActive ? "bg-yellow-400" : ""} rounded-full`}
              >
                {item.icon}
              </div>
              <div className={`truncate ${isActive ? "text-white" : "text-textmain"}`}>{item.label}</div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default DesktopSidebar;
