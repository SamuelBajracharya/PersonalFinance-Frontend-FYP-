import { baseInstance } from "./axiosInstance";

export interface UserProfileImageResponse {
    profile_image_url: string;
}

export const changeProfilePictureAPI = async (
    file: File,
): Promise<UserProfileImageResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await baseInstance.put<UserProfileImageResponse>(
        "/auth/users/me/profile-picture",
        formData,
    );

    return response.data;
};

export const resetProfilePictureAPI = async (): Promise<UserProfileImageResponse> => {
    const response = await baseInstance.delete<UserProfileImageResponse>(
        "/auth/users/me/profile-picture",
    );

    return response.data;
};
