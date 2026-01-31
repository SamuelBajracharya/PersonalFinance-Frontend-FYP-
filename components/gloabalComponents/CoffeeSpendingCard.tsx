import React from "react";
import { BsFileText } from "react-icons/bs";

interface CoffeeSpendingCardProps {
  category: string;
  budgetAmount: number;
  startDate: string;
  endDate: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const CoffeeSpendingCard = ({
  category,
  budgetAmount,
  startDate,
  endDate,
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
            ? "bg-secondaryBG border-accent"
            : "bg-secondaryBG border-transparent hover:border-gray-700"
        }
      `}
    >
      <div className="flex items-start gap-4">
        {/* Icon Box */}
        <div className="p-2 bg-accent rounded-lg text-textmain shrink-0">
          <BsFileText size={24} />
        </div>

        {/* Text Content */}
        <div className="flex-1 flex flex-col gap-2">
          {/* Category */}
          <h3 className="text-textmain font-semibold text-xl mb-1">
            {category}
          </h3>

          {/* Budget Amount */}
          <p className="text-gray-300 text-[16px] leading-relaxed">
            Budget:{" "}
            <span className="text-white font-medium">
              Rs {Number(budgetAmount).toFixed(2)}
            </span>
          </p>

          {/* Date Range */}
          <p className="text-gray-400 text-sm">
            {startDate} → {endDate}
          </p>

          <div className="flex justify-end mt-2">
            <button className="text-primary text-sm font-medium border border-primary px-5 py-2 rounded-full hover:bg-[#E69938]/10 transition-colors">
              View More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
