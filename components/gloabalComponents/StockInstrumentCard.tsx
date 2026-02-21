import { HiTrendingDown, HiTrendingUp } from "react-icons/hi";

interface StockInstrumentCardProps {
    symbol: string;
    company: string;
    price: number;
    changePercent: number;
    holdingValue: number;
    holdingAmount: number;
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
    active = false,
    onClick,
}: StockInstrumentCardProps) {
    const isPositive = changePercent >= 0;

    return (
        <div
            onClick={onClick}
            className={`rounded-2xl bg-secondaryBG p-5 border ${active ? "border-accent" : "border-transparent"} min-w-[250px] ${onClick ? "cursor-pointer" : ""}`}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-2xl font-medium">{symbol}</p>
                    <p className="text-textsecondary text-sm">{company}</p>
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
                <p className="text-4xl font-medium leading-none">${price.toFixed(2)}</p>
                <p className={`text-sm font-medium ${isPositive ? "text-income" : "text-expense"}`}>
                    {isPositive ? "+" : ""}
                    {changePercent.toFixed(2)}%
                </p>
            </div>

            <div className="mt-8 rounded-xl bg-highlight px-4 py-3 grid grid-cols-2 gap-4">
                <div>
                    <p className="text-xs text-textsecondary">value</p>
                    <p className="text-primary text-2xl font-medium">{holdingValue.toFixed(2)}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-textsecondary">amount</p>
                    <p className="text-accent text-2xl font-medium">{holdingAmount}</p>
                </div>
            </div>
        </div>
    );
}
