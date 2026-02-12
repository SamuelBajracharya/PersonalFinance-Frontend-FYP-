"use client";

import React from "react";
import { FaTimes } from "react-icons/fa";
import CouponTicket, { TierLevel } from "@/components/gloabalComponents/CouponTicket";
import { useVoucherById } from "@/hooks/useCoupons";
import { useVouchersOverlay } from "@/stores/useVouchersOverlay";

const getBrandFromTitle = (title: string) => {
    const lower = title.toLowerCase();

    if (lower.includes("worldlink")) return "worldlink" as const;
    if (lower.includes("daraz")) return "daraz" as const;
    if (lower.includes("coffee")) return "himalayan_java" as const;
    if (lower.includes("gym")) return "daraz" as const;
    return "foodmandu" as const;
};

const getDiscountText = (type: string, value: number) => {
    return type === "PERCENTAGE" ? `${value}% OFF` : `Rs ${value} OFF`;
};

export default function VoucherCongratsOverlay() {
    const { isVoucherOverlayOpen, voucherId, closeVoucherOverlay } =
        useVouchersOverlay();

    const { data: voucher, isLoading } = useVoucherById(voucherId);

    if (!isVoucherOverlayOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
            <div className="relative w-full max-w-2xl rounded-3xl bg-secondaryBG p-8 text-white">
                <button
                    onClick={closeVoucherOverlay}
                    className="absolute right-6 top-6 text-gray-300 hover:text-white transition cursor-pointer"
                    aria-label="Close"
                >
                    <FaTimes size={22} />
                </button>

                <h2 className="text-3xl font-semibold text-primary mb-3">
                    Congratulations! 🎉
                </h2>
                <p className="text-gray-300 mb-8 text-lg">
                    You just unlocked a new coupon reward.
                </p>

                {isLoading && <p className="text-gray-300">Loading voucher details...</p>}

                {!isLoading && voucher && (
                    <div className="space-y-4">
                        <CouponTicket
                            title={voucher.title}
                            brand={getBrandFromTitle(voucher.title)}
                            tier={voucher.tier_required as TierLevel}
                            discount={getDiscountText(voucher.discount_type, voucher.discount_value)}
                            expiry={new Date(voucher.expires_at).toLocaleDateString()}
                            code={voucher.code}
                        />
                        <p className="text-gray-300">{voucher.description}</p>
                    </div>
                )}

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={closeVoucherOverlay}
                        className="rounded-full bg-primary px-8 py-3 font-medium hover:bg-primary/80 transition cursor-pointer"
                    >
                        Awesome
                    </button>
                </div>
            </div>
        </div>
    );
}
