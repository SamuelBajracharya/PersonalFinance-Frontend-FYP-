import React from "react";
import { PiReceiptFill } from "react-icons/pi";

interface RecentTransaction {
    id: string;
    date: string;
    type: string;
    amount: string;
    category: string;
    description: string;
    merchant: string;
}

interface DashboardRecentTransactionsProps {
    transactions: RecentTransaction[];
}

const formatCurrency = (value: string | number) => {
    const amount = Number(value || 0);
    return new Intl.NumberFormat("en-NP", {
        style: "currency",
        currency: "NPR",
        maximumFractionDigits: 2,
    }).format(amount);
};

const DashboardRecentTransactions = ({
    transactions,
}: DashboardRecentTransactionsProps) => {
    return (
        <div className="bg-secondaryBG rounded-2xl p-2.5 px-2 h-full min-h-0">
            <div className="space-y-3 h-full overflow-y-auto pr-1">
                {transactions.length === 0 ? (
                    <p className="text-textsecondary text-sm">No recent transactions found.</p>
                ) : (
                    transactions.map((transaction) => {
                        const isExpense = transaction.type?.toUpperCase() === "DEBIT";

                        return (
                            <div
                                key={transaction.id}
                                className="flex items-center justify-between rounded-xl bg-tableBG px-4 py-3"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="size-10 rounded-full bg-accent flex items-center justify-center shrink-0">
                                        <PiReceiptFill className="text-primary size-5" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {transaction.description || transaction.category || "Transaction"}
                                        </p>
                                        <p className="text-xs text-textsecondary truncate">
                                            {transaction.merchant || "Receiver or sender"}
                                        </p>
                                    </div>
                                </div>

                                <p className={`text-sm font-semibold ${isExpense ? "text-expense" : "text-income"}`}>
                                    {isExpense ? "-" : "+"}
                                    {formatCurrency(transaction.amount)}
                                </p>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default DashboardRecentTransactions;
