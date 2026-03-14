export type AnalyticsPeriod = "weekly" | "monthly" | "yearly";

export interface AnalyticsBarPoint {
    label: string;
    value: number;
}

export interface AnalyticsLinePoint {
    x: string | number;
    y: number;
}

export interface AnalyticsLineSeries {
    id: string;
    data: AnalyticsLinePoint[];
}

export interface AnalyticsPiePoint {
    id: string;
    label?: string;
    value: number;
}

export interface AnalyticsGaugeData {
    totalIncome: string;
    totalExpenses: string;
    expenseToIncomeRatioPct: string;
    zone: string;
    advisorInsight: string;
}

export interface AnalyticsMoMGrowthPoint {
    label: string;
    income: string;
    expense: string;
    incomeGrowthPct?: string | null;
    expenseGrowthPct?: string | null;
}

export interface AnalyticsDiscretionarySegment {
    label?: string;
    id?: string;
    name?: string;
    category?: string;
    value?: string | number;
    amount?: string | number;
}

export interface AnalyticsDiscretionarySplit {
    discretionary: string;
    nonDiscretionary: string;
    discretionaryRatioPct: string;
    nonDiscretionaryRatioPct: string;
    advisorInsight: string;
    segments: AnalyticsDiscretionarySegment[];
}

export interface AnalyticsSavingsRatePoint {
    label?: string;
    month?: string;
    x?: string | number;
    savingsRatePct?: string | number;
    savingsRate?: string | number;
    value?: string | number;
}

export interface AnalyticsSavingsRateTrend {
    avgSavingsRatePct: string;
    totalNetSurplus: string;
    trend: string;
    advisorInsight: string;
    points: AnalyticsSavingsRatePoint[];
}

export interface AnalyticsResponse {
    yearlyTransactionData: AnalyticsBarPoint[];
    monthlyTransactionData: AnalyticsBarPoint[];
    weeklyTransactionData: AnalyticsBarPoint[];
    yearlyBalanceData: AnalyticsBarPoint[];
    monthlyBalanceData: AnalyticsBarPoint[];
    weeklyBalanceData: AnalyticsBarPoint[];
    yearlyLineSeries: AnalyticsLineSeries[];
    monthlyLineSeries: AnalyticsLineSeries[];
    weeklyLineSeries: AnalyticsLineSeries[];
    pieExpense: AnalyticsPiePoint[];
    pieIncome: AnalyticsPiePoint[];
    expenseIncomeGauge?: AnalyticsGaugeData;
    momGrowth?: AnalyticsMoMGrowthPoint[];
    discretionarySplit?: AnalyticsDiscretionarySplit;
    savingsRateTrend?: AnalyticsSavingsRateTrend;
    sync_status?: string;
    failure_reason?: string;
    is_data_fresh?: boolean;
    last_attempted_sync?: string;
    last_successful_sync?: string;
}
