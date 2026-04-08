const PRESERVED_LOCAL_STORAGE_KEYS = new Set([
    "theme-mode",
    "appTours",
    "seen_voucher_ids",
]);

const PRESERVED_KEY_PREFIXES = ["onboarding_"];

export const clearLogoutStorage = (): void => {
    if (typeof window === "undefined") return;

    for (let i = localStorage.length - 1; i >= 0; i -= 1) {
        const key = localStorage.key(i);
        if (!key) continue;

        const isExplicitlyPreserved = PRESERVED_LOCAL_STORAGE_KEYS.has(key);
        const isPrefixPreserved = PRESERVED_KEY_PREFIXES.some((prefix) =>
            key.startsWith(prefix)
        );

        if (!isExplicitlyPreserved && !isPrefixPreserved) {
            localStorage.removeItem(key);
        }
    }
};
