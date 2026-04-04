"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    changeProfilePictureAPI,
    resetProfilePictureAPI,
    UserProfileImageResponse,
} from "@/api/profilePictureAPI";
import { queryKeys } from "@/lib/queryKeys";

export const useChangeProfilePicture = () => {
    const queryClient = useQueryClient();

    return useMutation<UserProfileImageResponse, Error, File>({
        mutationFn: (file: File) => changeProfilePictureAPI(file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
        },
    });
};

export const useResetProfilePicture = () => {
    const queryClient = useQueryClient();

    return useMutation<UserProfileImageResponse, Error, void>({
        mutationFn: () => resetProfilePictureAPI(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
        },
    });
};
