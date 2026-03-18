import { AxiosRequestConfig } from "axios";
import { cookies } from "next/headers";

export const getServerAuthConfig = async (): Promise<AxiosRequestConfig | undefined> => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
        return undefined;
    }

    return {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    };
};
