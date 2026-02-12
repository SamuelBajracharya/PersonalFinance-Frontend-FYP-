"use client";

import React, { useEffect } from "react";
import { BsTrophy } from "react-icons/bs";

import { RecentActivityItem } from "@/components/gloabalComponents/RecentActivityCard";
import { WhatIfCard } from "@/components/gloabalComponents/WhatIfCard";
import CouponTicket, {
  TierLevel,
} from "@/components/gloabalComponents/CouponTicket";
import VoucherCongratsOverlay from "@/components/gloabalComponents/VoucherCongratsOverlay";

import { useWhatIfSccenarios } from "@/hooks/useWhatIf";
import { useRecentRewardActivity } from "@/hooks/useRewards";
import { useCurrentUser } from "@/hooks/useAuth";
import { useMyActiveVouchers } from "@/hooks/useCoupons";
import { useVouchersOverlay } from "@/stores/useVouchersOverlay";
import Link from "next/link";

const SEEN_VOUCHERS_KEY = "seen_voucher_ids";

export default function Rewards() {
  const { openVoucherOverlay } = useVouchersOverlay();

  const { data: whatIfScenarios, isLoading, isError } = useWhatIfSccenarios();
  const {
    data: recentActivities,
    isLoading: recentLoading,
    isError: recentError,
  } = useRecentRewardActivity();
  const { data: currentUser } = useCurrentUser();

  const {
    data: myVouchers,
    isLoading: vouchersLoading,
    isError: vouchersError,
    refetch: refetchMyVouchers,
  } = useMyActiveVouchers();

  const totalXp = currentUser?.total_xp ?? 0;
  const rank = currentUser?.rank ?? "Novice";

  const rankThresholds: Record<
    string,
    { min: number; max: number; next: string | null }
  > = {
    "Rookie Rocket": { min: 0, max: 500, next: "Bronze Brawler" },
    "Bronze Brawler": { min: 500, max: 2000, next: "Silver Surfer" },
    "Silver Surfer": { min: 2000, max: 5000, next: "Golden Gladiator" },
    "Golden Gladiator": { min: 5000, max: 8000, next: "Platinum Pirate" },
    "Platinum Pirate": { min: 8000, max: 10000, next: "Diamond Dynamo" },
    "Diamond Dynamo": { min: 10000, max: 15000, next: "Master of Mischief" },
    "Master of Mischief": { min: 15000, max: 15000, next: null },
  };

  const currentRank = rankThresholds[rank];

  const progress =
    currentRank && currentRank.max > currentRank.min
      ? ((totalXp - currentRank.min) / (currentRank.max - currentRank.min)) *
      100
      : 100;

  const xpToNext =
    currentRank?.next && currentRank.max
      ? Math.max(currentRank.max - totalXp, 0)
      : 0;

  const getBrandFromTitle = (title: string) => {
    const lower = title.toLowerCase();

    if (lower.includes("worldlink")) return "worldlink";
    if (lower.includes("daraz")) return "daraz";
    if (lower.includes("coffee")) return "himalayan_java";
    if (lower.includes("gym")) return "daraz"; // fallback style if gym added later
    return "foodmandu"; // default fallback
  };

  const getDiscountText = (type: string, value: number) => {
    return type === "PERCENTAGE" ? `${value}% OFF` : `Rs ${value} OFF`;
  };

  useEffect(() => {
    if (!myVouchers || typeof window === "undefined") return;

    const currentIds = myVouchers.map((voucher) => voucher.id);
    const seenRaw = localStorage.getItem(SEEN_VOUCHERS_KEY);

    if (!seenRaw) {
      localStorage.setItem(SEEN_VOUCHERS_KEY, JSON.stringify(currentIds));
      return;
    }

    const seenIds = new Set<string>(JSON.parse(seenRaw));
    const unseen = myVouchers.filter((voucher) => !seenIds.has(voucher.id));

    if (unseen.length) {
      const newest = unseen.sort(
        (a, b) =>
          new Date(b.issued_at).getTime() - new Date(a.issued_at).getTime(),
      )[0];

      openVoucherOverlay(newest.id);
      localStorage.setItem(SEEN_VOUCHERS_KEY, JSON.stringify(currentIds));
    }
  }, [myVouchers, openVoucherOverlay]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      refetchMyVouchers();
    }, 15000);

    return () => clearInterval(intervalId);
  }, [refetchMyVouchers]);

  return (
    <div className="min-h-screen p-6 font-sans text-gray-200">
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 ">
        {/* LEFT SIDE */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* WHAT IF */}
          <div>
            <h2 className="text-textmain text-2xl font-semibold tracking-wide mb-4">
              What If?
            </h2>

            {isLoading && <p className="text-gray-400">Loading scenarios...</p>}
            {isError && (
              <p className="text-red-400">Failed to load what-if scenarios.</p>
            )}

            {!isLoading && whatIfScenarios && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {whatIfScenarios.map((scenario, index) => (
                  <WhatIfCard
                    key={`${scenario.category}-${index}`}
                    percentage={scenario.reduction_percentage}
                    category={scenario.category}
                    saveAmount={scenario.monthly_savings}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ACTIVE COUPONS */}
          <div>
            <div className="flex justify-between items-center">
              <h2 className="text-textmain text-2xl font-semibold tracking-wide mb-4">
                Active Coupons
              </h2>
              <Link
                href="/coupons"
                className="text-primary text-lg hover:underline"
              >
                view all
              </Link>
            </div>

            {vouchersLoading && (
              <p className="text-gray-400">Loading coupons...</p>
            )}

            {vouchersError && (
              <p className="text-red-400">Failed to load coupons.</p>
            )}

            {!vouchersLoading && myVouchers && (
              <div className="grid grid-cols-2 gap-4">
                {myVouchers.map((voucher) => (
                  <CouponTicket
                    key={voucher.id}
                    title={voucher.title}
                    brand={getBrandFromTitle(voucher.title)}
                    tier={voucher.tier_required as TierLevel}
                    discount={getDiscountText(
                      voucher.discount_type,
                      voucher.discount_value,
                    )}
                    expiry={new Date(voucher.expires_at).toLocaleDateString()}
                    code={voucher.code}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          {/* XP CARD */}
          <div className="bg-secondaryBG p-8 rounded-3xl flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 border border-primary px-6 py-3 rounded-full text-primary text-[16px] font-medium mb-6">
              <BsTrophy size={24} />
              {rank}
            </div>

            <div className="text-5xl font-bold text-primary mb-1">
              {totalXp}
            </div>
            <div className="text-gray-200 text-[16px] mb-8">
              Experience Points
            </div>

            <div className="w-full">
              <div className="h-2 bg-accentBG rounded-full mb-3 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>

              {currentRank?.next ? (
                <p className="text-gray-200 text-[16px]">
                  {xpToNext} XP more to {currentRank.next}
                </p>
              ) : (
                <p className="text-gray-200 text-[16px]">
                  Max rank achieved 🎉
                </p>
              )}
            </div>
          </div>

          {/* RECENT ACTIVITIES */}
          <div>
            <h2 className="text-textmain text-2xl font-semibold tracking-wide mb-4">
              Recent Activities
            </h2>

            <div className="flex flex-col gap-4">
              {recentLoading && (
                <p className="text-gray-400">Loading recent activity...</p>
              )}

              {recentError && (
                <p className="text-red-400">Failed to load recent activity.</p>
              )}

              {!recentLoading &&
                recentActivities?.map((activity, index) => (
                  <RecentActivityItem
                    key={`${activity.reward_id}-${index}`}
                    title={activity.name}
                    time={new Date(activity.unlocked_at).toLocaleString()}
                    xp={activity.xp_gained}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>

      <VoucherCongratsOverlay />
    </div>
  );
}
