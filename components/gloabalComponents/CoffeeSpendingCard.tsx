import React from "react";
// Changed to react-icons
import { BsFileText } from "react-icons/bs";

interface CoffeeSpendingCardProps {
  isActive?: boolean;
  onClick?: () => void;
}

export const CoffeeSpendingCard = ({
  isActive = false,
  onClick,
}: CoffeeSpendingCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`
        p-5 rounded-2xl border transition-all cursor-pointer mb-4
        ${
          isActive
            ? "bg-secondaryBG border-accent" // Active: Dark bg, Blue border
            : "bg-secondaryBG border-transparent hover:border-gray-700"
        }
      `}
    >
      <div className="flex items-start gap-4">
        {/* Icon Box */}
        <div className="p-2 bg-accent rounded-lg text-textmain shrink-0">
          {/* React Icon */}
          <BsFileText size={24} />
        </div>

        {/* Text Content */}
        <div className="flex-1 flex flex-col gap-2">
          <h3 className="text-textmain font-semibold text-xl mb-1">
            Coffee Spending
          </h3>
          <p className="text-gray-300 text-[16px] leading-relaxed mb-4">
            If you continue spending on shopping like last week, you could
            overshoot your budget...
          </p>

          <div className="flex justify-end">
            <button className="text-primary text-sm font-medium border border-primary px-5 py-2 rounded-full hover:bg-[#E69938]/10 transition-colors">
              View More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
