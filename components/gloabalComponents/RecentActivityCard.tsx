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
    <div className="bg-secondaryBG p-4 rounded-xl flex items-center justify-between group cursor-pointer hover:bg-secondaryBG/80 transition-colors h-20">
      <div className="flex items-center gap-4 min-w-0 flex-1 mr-4">
        {/* Blue Icon Box */}
        <div className="size-12 bg-accent rounded-xl shrink-0"></div>

        <div className="min-w-0 flex-1">
          <h4 className="text-textmain text-[16px] font-medium tracking-wide mb-0.5 truncate block line-clamp-1">
            {title}
          </h4>
          <p className="text-textsecondary text-sm truncate block">{time}</p>
        </div>
      </div>

      <div className="text-[#22c55e] text-lg font-semibold shrink-0">+{xp}XP</div>
    </div>
  );
};
