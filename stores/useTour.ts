import { create } from "zustand";

interface TourState {
    isDashboardTour: boolean;
    isBudgetGoalsTour: boolean;
    initialize: () => void;
    setDashboardTour: (value: boolean) => void;
    setBudgetGoalsTour: (value: boolean) => void;
    setToursForNewUser: (value: boolean) => void;
}

const TOUR_STORAGE_KEY = "appTours";

interface TourStorageState {
    dashboard: boolean;
    budgetGoals: boolean;
}

const defaultTourState: TourStorageState = {
    dashboard: false,
    budgetGoals: false,
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

    initialize: () => {
        const saved = readStoredTourState();
        set({
            isDashboardTour: saved.dashboard,
            isBudgetGoalsTour: saved.budgetGoals,
        });
    },

    setDashboardTour: (value: boolean) => {
        set((state) => {
            const next = {
                dashboard: value,
                budgetGoals: state.isBudgetGoalsTour,
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
            };
            persistTourState(next);
            return { isBudgetGoalsTour: value };
        });
    },

    setToursForNewUser: (value: boolean) => {
        const next = {
            dashboard: value,
            budgetGoals: value,
        };
        persistTourState(next);
        set({
            isDashboardTour: value,
            isBudgetGoalsTour: value,
        });
    },
}));
