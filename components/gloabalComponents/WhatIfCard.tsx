import React from "react";


interface WhatIfCardProps {
  percentage: number;
  category: string;
  saveAmount: number;
  onMakeGoal?: (category: string, percentage: number) => void;
}

export const WhatIfCard = ({
  percentage,
  category,
  saveAmount,
  onMakeGoal,
}: WhatIfCardProps) => {
  return (
    <div className="bg-secondaryBG p-5 rounded-2xl border border-transparent transition-colors">
      <p className="text-textsecondary text-lg leading-relaxed mb-4">
        <span className="text-primary text-2xl font-semibold">If</span> you cut{" "}
        <span className="text-accent text-2xl font-semibold">
          {percentage}%
        </span>{" "}
        from <span className="text-textmain">{category}</span> you could,
      </p>

      <p className="text-primary text-2xl font-bold mb-6">
        Save Rs. {saveAmount}
        <span className="text-textsecondary font-normal text-base">/month!!</span>
      </p>

      <button
        className="w-full py-3 rounded-full border border-primary !text-primary text-[16px] font-medium hover:bg-primary/10 transition-colors cursor-pointer"
        onClick={() => onMakeGoal?.(category, percentage)}
      >
        Make this a goal?
      </button>
    </div>
  );
};
