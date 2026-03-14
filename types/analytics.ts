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
}
