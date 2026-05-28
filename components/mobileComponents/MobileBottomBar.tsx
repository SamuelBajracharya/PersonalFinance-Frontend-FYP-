"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { GoHomeFill } from "react-icons/go";
import { AiFillPieChart } from "react-icons/ai";
import { IoTrophy } from "react-icons/io5";
import { FaPiggyBank, FaChartLine, FaRightLeft } from "react-icons/fa6";

const MobileBottomBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState(pathname);

  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  const navItems = [
    { href: "/dashboard", icon: <GoHomeFill size={24} /> },
    { href: "/analytics", icon: <AiFillPieChart size={24} /> },
    { href: "/transactions", icon: <FaRightLeft size={21} /> },
    { href: "/budgetgoals", icon: <FaPiggyBank size={22} /> },
    { href: "/mystocks", icon: <FaChartLine size={21} /> },
    { href: "/rewards", icon: <IoTrophy size={22} /> },
  ];

  return (
    <div className="h-[60px] bg-secondaryBG/70 w-full px-2 flex items-center justify-around backdrop-blur-sm rounded-full shadow-lg border border-accentBG/20 theme-transition">
      {navItems.map((item, idx) => {
        // Active check matches pathname
        const isActive = pathname === item.href || (pathname.startsWith(item.href) && (pathname[item.href.length] === "/" || pathname.length === item.href.length));
        return (
          <button
            key={idx}
            onClick={() => {
              setActive(item.href);
              router.push(item.href);
            }}
            className="flex-1 h-full flex flex-col items-center justify-center relative cursor-pointer"
          >
            <div
              className={`transition-all duration-200 ${
                isActive 
                  ? "text-primary scale-110" 
                  : "text-textsecondary hover:text-textmain"
              }`}
            >
              {item.icon}
            </div>

            {isActive && (
              <span className="absolute bottom-[4px] w-[5px] h-[5px] bg-primary rounded-full animate-pulse" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default MobileBottomBar;
