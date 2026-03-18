export const queryKeys = {
    analytics: (
        accountId?: string | null,
        startDate?: string,
        endDate?: string,
    ) => ["analytics", accountId ?? null, startDate ?? null, endDate ?? null] as const,
    stockPredictions: (params: {
        instrument?: string;
        horizon_days?: number;
        confidence_level?: number;
        force_source?: string;
    } = {}) =>
        [
            "stock-predictions",
            params.instrument ?? null,
            params.horizon_days ?? 30,
            params.confidence_level ?? 0.95,
            params.force_source ?? "auto",
        ] as const,
    budgets: {
        my: ["budgets", "me"] as const,
        goalStatuses: ["budget-goal-statuses"] as const,
        goalStatus: (budgetId: string) => ["budget-goal-status", budgetId] as const,
        predictionExplanation: (budgetId: string) =>
            ["budget-prediction-explanation", budgetId] as const,
        suggestions: (budgetId: string) =>
            ["budget-goal-suggestions", budgetId] as const,
        adaptiveAdjustment: (budgetId: string) =>
            ["budget-goal-adaptive-adjustment", budgetId] as const,
        periodReview: (budgetId: string) =>
            ["budget-goal-period-review", budgetId] as const,
    },
    vouchers: {
        templates: ["voucher-templates"] as const,
        mine: ["my-vouchers"] as const,
        history: ["voucher-history"] as const,
        byId: (voucherId: string) => ["voucher", voucherId] as const,
    },
    rewards: {
        all: ["rewards", "all"] as const,
        mine: ["rewards", "me"] as const,
        recentActivity: ["rewards", "recent-activity"] as const,
    },
    whatIfScenarios: ["what-if-scenarios"] as const,
    bank: {
        accounts: ["bank-accounts"] as const,
        nabilAccount: ["nabil-bank-account"] as const,
        nabilTransactions: ["nabil-bank-transactions"] as const,
    },
    dashboard: ["dashboard"] as const,
    currentUser: ["currentUser"] as const,
};
