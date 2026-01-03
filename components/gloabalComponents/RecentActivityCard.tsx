import React from "react";

interface RecentActivityItemProps {
  title: string;
  time: string;
  xp: number;
}

export const RecentActivityItem = ({
  title,
  time,
  xp,
}: RecentActivityItemProps) => {
  return (
    <div className="bg-secondaryBG p-4 rounded-xl flex items-center justify-between group cursor-pointer hover:bg-secondaryBG/80 transition-colors">
      <div className="flex items-center gap-4">
        {/* Blue Icon Box */}
        <div className="size-12 bg-accent rounded-xl shrink-0"></div>

        <div>
          <h4 className="text-white text-[16px] font-medium tracking-wide mb-1">
            {title}
          </h4>
          <p className="text-gray-200 text-sm">{time}</p>
        </div>
      </div>

      <div className="text-[#22c55e] text-lg font-semibold">+{xp}XP</div>
    </div>
  );
};
