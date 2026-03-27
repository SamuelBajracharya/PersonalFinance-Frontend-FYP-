"use client";

import React from "react";
import { FaTimes } from "react-icons/fa";

interface SimpleConfirmationOverlayProps {
    title: string;
    message?: string;
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}

const SimpleConfirmationOverlay: React.FC<SimpleConfirmationOverlayProps> = ({
    title,
    message,
    isOpen,
    onConfirm,
    onCancel,
    confirmText = "Confirm",
    cancelText = "Cancel",
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 !z-[2147483645] flex items-center justify-center bg-overlay/70 backdrop-blur-sm">
            <div className="relative w-full max-w-lg rounded-2xl bg-secondaryBG p-8">
                {/* Close */}
                <button
                    onClick={onCancel}
                    className="absolute right-8 top-8 text-textsecondary hover:text-textmain transition cursor-pointer"
                    type="button"
                >
                    <FaTimes size={24} />
                </button>

                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-4xl font-semibold text-primary mb-4">{title}</h2>
                    {message && <p className="text-textsecondary text-lg">{message}</p>}
                </div>

                {/* Actions */}
                <div className="mt-12 flex flex-col gap-4">
                    <button
                        onClick={onConfirm}
                        className="rounded-full bg-primary py-4 text-lg font-medium text-textmain hover:bg-primary/80 transition cursor-pointer"
                        type="button"
                    >
                        {confirmText}
                    </button>

                    <button
                        onClick={onCancel}
                        className="rounded-full bg-accentBG py-4 text-lg text-textmain hover:bg-accentBG/80 transition cursor-pointer"
                        type="button"
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SimpleConfirmationOverlay;
