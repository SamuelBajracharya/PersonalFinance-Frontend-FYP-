import React from "react";

interface TopBudgetGoal {
    id: string;
    category: string;
    budgetAmount: string;
    spentAmount: string;
    remainingBudget: string;
    usagePct: string;
    status: string;
}

interface DashboardBudgetGoalsProps {
    goals: TopBudgetGoal[];
}

const statusColor = (status: string) => {
    const normalized = status.toLowerCase();
    if (normalized.includes("risk")) return "text-expense";
    if (normalized.includes("track") || normalized.includes("good")) return "text-income";
    return "text-primary";
};

const progressColor = (usagePct: number) => {
    if (usagePct >= 100) return "bg-expense";
    if (usagePct >= 75) return "bg-primary";
    return "bg-income";
};

const DashboardBudgetGoals = ({ goals }: DashboardBudgetGoalsProps) => {
    return (
        <div className="bg-secondaryBG rounded-2xl p-2.5 h-full">
            <div className="space-y-3">
                {goals.length === 0 ? (
                    <p className="text-textsecondary text-sm">No budget goals found.</p>
                ) : (
                    goals.map((goal) => {
                        const usage = Number(goal.usagePct || 0);
                        const widthPct = Math.min(100, Math.max(0, usage));

                        return (
                            <div key={goal.id} className="space-y-1.5">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold truncate">{goal.category}</p>
                                        <p className={`text-xs ${statusColor(goal.status)}`}>{goal.status}</p>
                                    </div>
                                    <p className="text-[12px] text-textsecondary shrink-0">
                                        Rs. {Number(goal.spentAmount || 0).toFixed(0)} / Rs. {Number(goal.budgetAmount || 0).toFixed(0)}
                                    </p>
                                </div>

                                <div className="h-2 bg-accentBG rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${progressColor(usage)}`}
                                        style={{ width: `${widthPct}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default DashboardBudgetGoals;
