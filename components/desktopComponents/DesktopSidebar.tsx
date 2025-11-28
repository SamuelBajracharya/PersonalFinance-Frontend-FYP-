"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GoHomeFill } from "react-icons/go";
import { AiFillPieChart } from "react-icons/ai";
import { IoTrophy } from "react-icons/io5";
import { FaPiggyBank } from "react-icons/fa6";
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
    { href: "/dashboard", label: "Home", icon: <GoHomeFill size={20} /> },
    {
      href: "/analytics",
      label: "Analytics",
      icon: <AiFillPieChart size={20} />,
    },
    {
      href: "/transactions",
      label: "Transactions",
      icon: (
        <Image
          src="/transactionHistory.svg"
          alt="Transaction History"
          width={20}
          height={20}
          className="w-5 h-5"
        />
      ),
    },
    {
      href: "/budgetgoals",
      label: "Budget Goals",
      icon: <FaPiggyBank size={20} />,
    },
    {
      href: "/aiadvisor",
      label: "AI Advisor",
      icon: <PiChatCircleTextFill size={22} />,
    },
    { href: "/rewards", label: "Rewards", icon: <IoTrophy size={18} /> },
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
      className="fixed top-4 left-4 bg-secondaryBG rounded-2xl shadow-lg flex flex-col p-4"
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
          const isActive = active === item.href;
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`flex items-center gap-3 w-full p-2 rounded-full transition-colors cursor-pointer
                ${
                  isActive
                    ? "bg-accent font-semibold"
                    : "hover:bg-accent/60 hover:text-textmain"
                }
              `}
            >
              {/* Icon wrapper */}
              <div
                className={`flex items-center justify-center w-8 h-8 ${
                  isActive ? "bg-yellow-400" : ""
                } rounded-full`}
              >
                {item.icon}
              </div>
              <div className="truncate font-normal">{item.label}</div>
            </button>
          );
        })}
      </nav>

      {/* Bottom navigation */}
      <nav className="mt-auto pt-4 border-t border-textmain/20 space-y-2 ">
        {supportNav.map((item) => {
          const isActive = active === item.href;
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`flex items-center gap-3 w-full p-2 rounded-full transition-colors cursor-pointer
                ${
                  isActive
                    ? "bg-accent font-normal"
                    : "hover:bg-accent/60 hover:text-textmain"
                }
              `}
            >
              <div
                className={`flex items-center justify-center size-8 ${
                  isActive ? "bg-yellow-400" : ""
                } rounded-full`}
              >
                {item.icon}
              </div>
              <div className="truncate">{item.label}</div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default DesktopSidebar;
