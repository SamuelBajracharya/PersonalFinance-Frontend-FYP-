import { HiTrendingDown, HiTrendingUp } from "react-icons/hi";

interface StockInstrumentCardProps {
    symbol: string;
    company: string;
    price: number;
    changePercent: number;
    holdingValue: number;
    holdingAmount: number;
    currencySymbol?: string;
    active?: boolean;
    onClick?: () => void;
}

export default function StockInstrumentCard({
    symbol,
    company,
    price,
    changePercent,
    holdingValue,
    holdingAmount,
    currencySymbol = "$",
    active = false,
    onClick,
}: StockInstrumentCardProps) {
    const isPositive = changePercent >= 0;
    const holdingValueText = `${currencySymbol}${holdingValue.toFixed(2)}`;
    const holdingAmountText = Number(holdingAmount).toLocaleString(undefined, {
        maximumFractionDigits: 2,
    });

    const getFitFontSize = (
        textLength: number,
        maxPx: number,
        minPx: number,
        availableWidthPx: number,
    ) => {
        if (textLength <= 0) return maxPx;

        // Approximate average glyph width for this semi-bold numeric text.
        const estimatedCharWidthEm = 0.62;
        const fitPx = availableWidthPx / (textLength * estimatedCharWidthEm);

        return Math.max(minPx, Math.min(maxPx, fitPx));
    };

    const valueFontSizePx = getFitFontSize(holdingValueText.length, 24, 12, 112);
    const amountFontSizePx = getFitFontSize(holdingAmountText.length, 22, 12, 104);

    return (
        <div
            onClick={onClick}
            className={`rounded-2xl bg-secondaryBG p-5 border ${active ? "border-accent" : "border-transparent"} w-full min-w-[250px] max-w-[280px] ${onClick ? "cursor-pointer" : ""}`}
        >
            <div className="flex items-start justify-between">
                <div className="min-w-0 max-w-[180px]">
                    <p className="text-2xl font-medium truncate whitespace-nowrap">{symbol}</p>
                    <p className="text-textsecondary text-sm truncate whitespace-nowrap">{company}</p>
                </div>

                <div
                    className={`rounded-lg p-2 ${isPositive ? "bg-income/20" : "bg-expense/20"}`}
                >
                    {isPositive ? (
                        <HiTrendingUp className="size-5 text-income" />
                    ) : (
                        <HiTrendingDown className="size-5 text-expense" />
                    )}
                </div>
            </div>

            <div className="mt-6 space-y-1">
                <p className="text-4xl font-medium leading-none">{currencySymbol}{price.toFixed(2)}</p>
                <p className={`text-sm font-medium ${isPositive ? "text-income" : "text-expense"}`}>
                    {isPositive ? "+" : ""}
                    {changePercent.toFixed(2)}%
                </p>
            </div>

            <div className="mt-8 rounded-xl bg-highlight px-4 py-3 grid grid-cols-2 gap-4 items-end">
                <div className="min-w-0 h-[52px] flex flex-col">
                    <p className="text-xs text-textsecondary">value</p>
                    <p
                        className="text-primary font-medium leading-none whitespace-nowrap mt-auto"
                        style={{ fontSize: `${valueFontSizePx}px` }}
                    >
                        {holdingValueText}
                    </p>
                </div>
                <div className="min-w-0 h-[52px] flex flex-col text-right">
                    <p className="text-xs text-textsecondary">amount</p>
                    <p
                        className="text-accent font-medium leading-none whitespace-nowrap mt-auto"
                        style={{ fontSize: `${amountFontSizePx}px` }}
                    >
                        {holdingAmountText}
                    </p>
                </div>
            </div>
        </div>
    );
}
