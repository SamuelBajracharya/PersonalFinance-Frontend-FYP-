import { create } from "zustand";

interface TourState {
    isDashboardTour: boolean;
    isBudgetGoalsTour: boolean;
    isTransactionsLinkTour: boolean;
    isTransactionsFeatureTour: boolean;
    isAnalyticsTour: boolean;
    isMyStocksTour: boolean;
    initialize: () => void;
    setDashboardTour: (value: boolean) => void;
    setBudgetGoalsTour: (value: boolean) => void;
    setTransactionsLinkTour: (value: boolean) => void;
    setTransactionsFeatureTour: (value: boolean) => void;
    setAnalyticsTour: (value: boolean) => void;
    setMyStocksTour: (value: boolean) => void;
    setToursForNewUser: (value: boolean) => void;
}

const TOUR_STORAGE_KEY = "appTours";

interface TourStorageState {
    dashboard: boolean;
    budgetGoals: boolean;
    transactionsLink: boolean;
    transactionsFeature: boolean;
    analytics: boolean;
    myStocks: boolean;
}

const defaultTourState: TourStorageState = {
    dashboard: false,
    budgetGoals: false,
    transactionsLink: false,
    transactionsFeature: false,
    analytics: false,
    myStocks: false,
};

const readStoredTourState = (): TourStorageState => {
    if (typeof window === "undefined") return defaultTourState;

    const saved = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!saved) return defaultTourState;

    try {
        const parsed = JSON.parse(saved) as Partial<TourStorageState>;
        return {
            dashboard: Boolean(parsed.dashboard),
            budgetGoals: Boolean(parsed.budgetGoals),
            transactionsLink: Boolean(parsed.transactionsLink),
            transactionsFeature: Boolean(parsed.transactionsFeature),
            analytics: Boolean(parsed.analytics),
            myStocks: Boolean(parsed.myStocks),
        };
    } catch {
        return defaultTourState;
    }
};

const persistTourState = (state: TourStorageState) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(state));
};

export const useTourStore = create<TourState>((set) => ({
    isDashboardTour: false,
    isBudgetGoalsTour: false,
    isTransactionsLinkTour: false,
    isTransactionsFeatureTour: false,
    isAnalyticsTour: false,
    isMyStocksTour: false,

    initialize: () => {
        const saved = readStoredTourState();
        set({
            isDashboardTour: saved.dashboard,
            isBudgetGoalsTour: saved.budgetGoals,
            isTransactionsLinkTour: saved.transactionsLink,
            isTransactionsFeatureTour: saved.transactionsFeature,
            isAnalyticsTour: saved.analytics,
            isMyStocksTour: saved.myStocks,
        });
    },

    setDashboardTour: (value: boolean) => {
        set((state) => {
            const next = {
                dashboard: value,
                budgetGoals: state.isBudgetGoalsTour,
                transactionsLink: state.isTransactionsLinkTour,
                transactionsFeature: state.isTransactionsFeatureTour,
                analytics: state.isAnalyticsTour,
                myStocks: state.isMyStocksTour,
            };
            persistTourState(next);
            return { isDashboardTour: value };
        });
    },

    setBudgetGoalsTour: (value: boolean) => {
        set((state) => {
            const next = {
                dashboard: state.isDashboardTour,
                budgetGoals: value,
                transactionsLink: state.isTransactionsLinkTour,
                transactionsFeature: state.isTransactionsFeatureTour,
                analytics: state.isAnalyticsTour,
                myStocks: state.isMyStocksTour,
            };
            persistTourState(next);
            return { isBudgetGoalsTour: value };
        });
    },

    setTransactionsLinkTour: (value: boolean) => {
        set((state) => {
            const next = {
                dashboard: state.isDashboardTour,
                budgetGoals: state.isBudgetGoalsTour,
                transactionsLink: value,
                transactionsFeature: state.isTransactionsFeatureTour,
                analytics: state.isAnalyticsTour,
                myStocks: state.isMyStocksTour,
            };
            persistTourState(next);
            return { isTransactionsLinkTour: value };
        });
    },

    setTransactionsFeatureTour: (value: boolean) => {
        set((state) => {
            const next = {
                dashboard: state.isDashboardTour,
                budgetGoals: state.isBudgetGoalsTour,
                transactionsLink: state.isTransactionsLinkTour,
                transactionsFeature: value,
                analytics: state.isAnalyticsTour,
                myStocks: state.isMyStocksTour,
            };
            persistTourState(next);
            return { isTransactionsFeatureTour: value };
        });
    },

    setAnalyticsTour: (value: boolean) => {
        set((state) => {
            const next = {
                dashboard: state.isDashboardTour,
                budgetGoals: state.isBudgetGoalsTour,
                transactionsLink: state.isTransactionsLinkTour,
                transactionsFeature: state.isTransactionsFeatureTour,
                analytics: value,
                myStocks: state.isMyStocksTour,
            };
            persistTourState(next);
            return { isAnalyticsTour: value };
        });
    },

    setMyStocksTour: (value: boolean) => {
        set((state) => {
            const next = {
                dashboard: state.isDashboardTour,
                budgetGoals: state.isBudgetGoalsTour,
                transactionsLink: state.isTransactionsLinkTour,
                transactionsFeature: state.isTransactionsFeatureTour,
                analytics: state.isAnalyticsTour,
                myStocks: value,
            };
            persistTourState(next);
            return { isMyStocksTour: value };
        });
    },

    setToursForNewUser: (value: boolean) => {
        const next = {
            dashboard: value,
            budgetGoals: value,
            transactionsLink: value,
            transactionsFeature: value,
            analytics: value,
            myStocks: value,
        };
        persistTourState(next);
        set({
            isDashboardTour: value,
            isBudgetGoalsTour: value,
            isTransactionsLinkTour: value,
            isTransactionsFeatureTour: value,
            isAnalyticsTour: value,
            isMyStocksTour: value,
        });
    },
}));
