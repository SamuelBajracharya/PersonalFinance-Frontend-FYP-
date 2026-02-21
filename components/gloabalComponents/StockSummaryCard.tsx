import { ReactNode } from "react";

type SummaryTone = "primary" | "accent" | "income" | "expense";
type ValueFormat = "currency" | "count";

interface StockSummaryCardProps {
    title: string;
    value: number;
    icon: ReactNode;
    tone?: SummaryTone;
    format?: ValueFormat;
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
}: StockSummaryCardProps) {
    const displayValue =
        format === "currency"
            ? `$${value.toFixed(2)}`
            : Math.round(value).toString();

    return (
        <div className="rounded-3xl bg-secondaryBG px-6 py-7">
            <div className="flex items-center gap-3">
                <div className="rounded-xl bg-highlight p-3">{icon}</div>
                <p className="text-2xl font-medium">{title}</p>
            </div>

            <p className={`mt-6 text-4xl font-medium ${toneClass[tone]}`}>
                {displayValue}
            </p>
        </div>
    );
}
