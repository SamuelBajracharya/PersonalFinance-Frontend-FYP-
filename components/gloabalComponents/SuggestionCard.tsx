import { TbBulb } from "react-icons/tb";

interface SuggestionProps {
  title: string;
  message: string;
}

export function SuggestionCard({ title, message }: SuggestionProps) {
  return (
    <div className="p-4 flex gap-4 bg-tableBG rounded-2xl">
      <div className="space-y-2">
        <div className="flex gap-2 items-center">
          <TbBulb className="text-primary size-8" />
          <p className="text-primary font-medium text-xl tracking-wide">
            {title}
          </p>
        </div>
        <p className="text-gray-300 text-md leading-snug">{message}</p>
      </div>
    </div>
  );
}
