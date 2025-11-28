import { RxCross2 } from "react-icons/rx";

interface ActiveGoalProps {
  title: string;
  saved: number;
  target: number;
}

export function ActiveGoal({ title, saved, target }: ActiveGoalProps) {
  const percentage = (saved / target) * 100;

  return (
    <div className="bg-secondaryBG rounded-2xl p-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="font-medium text-2xl tracking-wide">{title}</p>
          <p className="text-xl">
            You&apos;re on track to save{" "}
            <span className="text-accent text-2xl">${target}</span> weekly for
            the next month.
          </p>
        </div>
        <div className="rounded-full size-10 flex items-center justify-center border-1 border-white hover:bg-textsecondary/40 cursor-pointer">
          <RxCross2 className="size-8" />
        </div>
      </div>

      {/* Percentage above bar right */}
      <div className="flex justify-end mt-4">
        <p className="font-medium text-lg mb-1">{percentage.toFixed(0)}%</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-accentBG h-2 rounded-full overflow-hidden">
        <div
          className="bg-primary h-full transition-all duration-500 rounded-r-full"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="text-lg mt-3">
        <span className="text-accent font-semibold">${saved}</span>
        <span className="text-white"> saved so far</span>
      </p>
    </div>
  );
}
