import { ReactNode } from "react";

type SummaryTone = "primary" | "accent" | "income" | "expense";
type ValueFormat = "currency" | "count";

interface StockSummaryCardProps {
    title: string;
    value: number;
    icon: ReactNode;
    tone?: SummaryTone;
    format?: ValueFormat;
    currencySymbol?: string;
}

const toneClass: Record<SummaryTone, string> = {
    primary: "text-primary",
    accent: "text-accent",
    income: "text-income",
    expense: "text-expense",
};

export default function StockSummaryCard({
    title,
    value,
    icon,
    tone = "primary",
    format = "currency",
    currencySymbol = "$",
}: StockSummaryCardProps) {
    const displayValue =
        format === "currency"
            ? `${currencySymbol}${value.toFixed(2)}`
            : Math.round(value).toString();

    return (
        <div className="rounded-3xl bg-secondaryBG px-3 py-4 md:px-6 md:py-7 w-full min-w-0">
            <div className="flex items-center gap-2 md:gap-3">
                <div className="rounded-xl bg-highlight p-2 md:p-3 shrink-0">{icon}</div>
                <p className="text-sm md:text-2xl font-medium truncate">{title}</p>
            </div>

            <p className={`mt-3 md:mt-6 text-2xl md:text-4xl font-medium truncate ${toneClass[tone]}`}>
                {displayValue}
            </p>
        </div>
    );
}
