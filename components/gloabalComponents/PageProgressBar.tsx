"use client";

import React from "react";

interface PageProgressBarProps {
  currentStep: number;
  totalSteps?: number; // default = 3
}

const PageProgressBar: React.FC<PageProgressBarProps> = ({
  currentStep,
  totalSteps = 3,
}) => {
  return (
    <div className="flex justify-center items-center gap-4 mt-10">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const step = index + 1;
        const isActive = step <= currentStep;

        return (
          <div
            key={step}
            className={`h-[8px] w-36 rounded-full transition-all duration-300 ${
              isActive ? "bg-[#fca311]" : "bg-[#bfb8b0]"
            }`}
          />
        );
      })}
    </div>
  );
};

export default PageProgressBar;
