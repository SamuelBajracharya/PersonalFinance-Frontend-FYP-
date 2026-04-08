import Cookies from "js-cookie";
import { AxiosInstance } from "axios";
import { clearLogoutStorage } from "@/lib/logoutStorage";

export const performTokenRefresh = async (
    axiosAuthInstance: AxiosInstance
): Promise<string> => {
    const refreshToken = Cookies.get("refreshToken");
    if (!refreshToken) {
        throw new Error("No refresh token available. User must re-authenticate.");
    }

    try {
        const response = await axiosAuthInstance.post("/refresh", {
            refresh_token: refreshToken,
        });

        const { access_token, refresh_token: new_refresh_token } = response.data;

        if (access_token) {
            Cookies.set("accessToken", access_token, {
                expires: 1 / 24,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Lax",
            });
        }

        if (new_refresh_token) {
            Cookies.set("refreshToken", new_refresh_token, {
                expires: 7,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Lax",
            });
        }

        return access_token;
    } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        Cookies.remove("bank_token");
        Cookies.remove("bank_token", { path: "/" });
        Cookies.remove("bank_token", { path: "/", secure: true, sameSite: "strict" });
        clearLogoutStorage();
        throw refreshError;
    }
};
