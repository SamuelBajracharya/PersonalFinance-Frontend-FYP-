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
    { href: "/dashboard", label: "Home", icon: (isActive: boolean) => <GoHomeFill size={20} className={isActive ? "text-white" : "text-textmain]"} /> },
    {
      href: "/analytics",
      label: "Analytics",
      icon: (isActive: boolean) => <AiFillPieChart size={20} className={isActive ? "text-white" : "text-textmain]"} />,
    },
    {
      href: "/transactions",
      label: "Transactions",
      icon: (isActive: boolean) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 17V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10" stroke={isActive ? "#fff" : "#0f1724"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 21v-4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v4" stroke={isActive ? "#fff" : "#0f1724"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="18" cy="18" r="3" fill={isActive ? "#fff" : "#0f1724"} />
        </svg>
      ),
    },
    {
      href: "/budgetgoals",
      label: "Budget Goals",
      icon: (isActive: boolean) => <FaPiggyBank size={20} className={isActive ? "text-white" : "text-textmain]"} />,
    },
    {
      href: "/mystocks",
      label: "My Stocks",
      icon: (isActive: boolean) => <FaChartLine size={18} className={isActive ? "text-white" : "text-textmain]"} />,
    },
    {
      href: "/ai-assistant",
      label: "AI Assistant",
      icon: (isActive: boolean) => <PiChatCircleTextFill size={22} className={isActive ? "text-white" : "text-textmain]"} />,
    },
    { href: "/rewards", label: "Rewards", icon: (isActive: boolean) => <IoTrophy size={18} className={isActive ? "text-white" : "text-textmain]"} /> },
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
                {item.icon(isActive)}
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
