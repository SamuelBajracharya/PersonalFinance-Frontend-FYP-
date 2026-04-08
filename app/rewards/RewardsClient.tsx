"use client";

import React, { useEffect, useRef } from "react";
import { Tour } from "antd";
import { BsTrophy } from "react-icons/bs";

import { RecentActivityItem } from "@/components/gloabalComponents/RecentActivityCard";
import { WhatIfCard } from "@/components/gloabalComponents/WhatIfCard";
import CouponTicket, {
  TierLevel,
} from "@/components/gloabalComponents/CouponTicket";
import VoucherCongratsOverlay from "@/components/gloabalComponents/VoucherCongratsOverlay";
import LoadingOverlay from "@/components/gloabalComponents/LoadingOverlay";
import SkeletonBlock from "@/components/gloabalComponents/SkeletonBlock";


import { useWhatIfSccenarios } from "@/hooks/useWhatIf";
import { useRecentRewardActivity } from "@/hooks/useRewards";
import { useCurrentUser } from "@/hooks/useAuth";
import { useMyActiveVouchers } from "@/hooks/useCoupons";
import { useVouchersOverlay } from "@/stores/useVouchersOverlay";
import { useNabilBankTransactions } from "@/hooks/useBankTransaction";
import { useCreateBudget } from "@/hooks/useBudgetGoals";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useAntdMessage } from "@/components/gloabalComponents/AntdMessageContext";
import dayjs from "dayjs";
import Link from "next/link";
import { useTourStore } from "@/stores/useTour";

const SEEN_VOUCHERS_KEY = "seen_voucher_ids";

const formatRecentActivityTime = (rawDate?: string) => {
  if (!rawDate) return "-";

  // Try native Date parse first (covers ISO strings with timezone).
  let parsed = new Date(rawDate);

  // Fallback to dayjs for non-ISO backend formats.
  if (Number.isNaN(parsed.getTime())) {
    const dayjsDate = dayjs(rawDate);
    if (dayjsDate.isValid()) {
      parsed = dayjsDate.toDate();
    }
  }

  if (Number.isNaN(parsed.getTime())) return rawDate;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsed);
};

export default function Rewards() {
  const messageApi = useAntdMessage();
  const { openVoucherOverlay } = useVouchersOverlay();
  const {
    isRewardsTour,
    initialize: initializeTour,
    setRewardsTour,
  } = useTourStore();
  const router = useRouter();
  const whatIfRef = useRef<HTMLDivElement | null>(null);
  const activeCouponsRef = useRef<HTMLDivElement | null>(null);
  const xpCardRef = useRef<HTMLDivElement | null>(null);
  const recentActivitiesRef = useRef<HTMLDivElement | null>(null);
  // Get all Nabil Bank transactions
  const { data: transactions } = useNabilBankTransactions(true);
  const { mutateAsync: createBudget } = useCreateBudget();

  const { data: whatIfScenarios, isLoading, isError } = useWhatIfSccenarios();
  const {
    data: recentActivities,
    isLoading: recentLoading,
    isError: recentError,
  } = useRecentRewardActivity();
  const { data: currentUser, isLoading: currentUserLoading } = useCurrentUser();

  const {
    data: myVouchers,
    isLoading: vouchersLoading,
    isError: vouchersError,
    refetch: refetchMyVouchers,
  } = useMyActiveVouchers();

  const totalXp = currentUser?.total_xp ?? 0;
  const rank = currentUser?.rank ?? "Novice";

  const showWhatIfSkeleton = isLoading && !whatIfScenarios;
  const showCouponsSkeleton = vouchersLoading && !myVouchers;
  const showXpSkeleton = currentUserLoading && !currentUser;
  const showRecentSkeleton = recentLoading && !recentActivities;
  const showLoadingOverlay =
    showWhatIfSkeleton ||
    showCouponsSkeleton ||
    showXpSkeleton ||
    showRecentSkeleton;

  const shouldOpenRewardsTour = isRewardsTour && !showLoadingOverlay;

  const resolveTarget = (element: HTMLElement | null): HTMLElement =>
    element ?? document.body;

  const rewardsTourSteps = [
    {
      title: "What If Suggestions",
      description:
        "Explore AI what-if cards and quickly convert useful suggestions into budget goals.",
      target: () => resolveTarget(whatIfRef.current),
    },
    {
      title: "Active Coupons",
      description:
        "View your unlocked vouchers and available discount codes in this section.",
      target: () => resolveTarget(activeCouponsRef.current),
    },
    {
      title: "XP & Rank",
      description:
        "Track your current rank, total XP, and progress toward the next tier.",
      target: () => resolveTarget(xpCardRef.current),
    },
    {
      title: "Recent Activities",
      description:
        "See your latest reward-related actions and XP gains.",
      target: () => resolveTarget(recentActivitiesRef.current),
    },
  ];

  useEffect(() => {
    initializeTour();
  }, [initializeTour]);

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

  // Handler for "Make this a goal" (now uses scenario data directly)
  const handleMakeGoal = useCallback(
    async (category: string, _percentage: number, newBudget?: number) => {
      // Validate payload
      if (!category || typeof category !== "string" || !newBudget || isNaN(Number(newBudget)) || Number(newBudget) <= 0) {
        messageApi.error("Invalid budget data. Please try again or contact support.");
        return;
      }
      const payload = {
        category,
        budget_amount: Number(newBudget),
      };
      try {
        await createBudget(payload);
        messageApi.success("Budget goal created successfully!");
        router.push("/budgetgoals");
      } catch (e: any) {
        let msg = "Failed to create budget goal. Please try again.";
        if (e?.response?.data) {
          // If backend sends { detail: "..." } or similar, show only the message
          const data = e.response.data;
          if (typeof data === "object" && data !== null) {
            if (typeof data.detail === "string") {
              msg = data.detail;
            } else if (typeof data.message === "string") {
              msg = data.message;
            } else {
              // fallback: join all string values
              msg = Object.values(data).filter(v => typeof v === "string").join(" ") || msg;
            }
          } else if (typeof data === "string") {
            msg = data;
          }
        } else if (e?.message) {
          msg = e.message;
        }
        // eslint-disable-next-line no-console
        console.error("Budget goal creation error:", e, payload);
        messageApi.error(msg);
      }
    },
    [createBudget, router, messageApi]
  );

  return (
    <div className="min-h-screen p-6 font-sans text-gray-200">
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 ">
        {/* LEFT SIDE */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* WHAT IF */}
          <div ref={whatIfRef}>
            <h2 className="text-textmain text-2xl font-semibold tracking-wide mb-4">
              What If?
            </h2>

            {showWhatIfSkeleton && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="bg-secondaryBG p-5 rounded-2xl">
                    <SkeletonBlock className="h-7 w-full" />
                    <SkeletonBlock className="h-7 w-4/5 mt-2" />
                    <SkeletonBlock className="h-8 w-3/5 mt-6" />
                    <SkeletonBlock className="h-11 w-full mt-6 rounded-full" />
                  </div>
                ))}
              </div>
            )}

            {isError && (
              <p className="text-red-400">Failed to load what-if scenarios.</p>
            )}

            {!showWhatIfSkeleton && whatIfScenarios && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {whatIfScenarios.map((scenario, index) => (
                  <WhatIfCard
                    key={`${scenario.category}-${index}`}
                    percentage={scenario.reduction_percentage}
                    category={scenario.category}
                    saveAmount={scenario.monthly_savings}
                    onMakeGoal={async () => {
                      await handleMakeGoal(
                        scenario.category,
                        scenario.reduction_percentage,
                        scenario.new_budget
                      );
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ACTIVE COUPONS */}
          <div ref={activeCouponsRef}>
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

            {showCouponsSkeleton && (
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonBlock
                    key={index}
                    className="h-[220px] rounded-3xl"
                  />
                ))}
              </div>
            )}

            {vouchersError && (
              <p className="text-red-400">Failed to load coupons.</p>
            )}

            {!showCouponsSkeleton && myVouchers && (
              <div className="grid grid-cols-2 gap-4">
                {myVouchers.slice(0, 6).map((voucher) => (
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
          {showXpSkeleton ? (
            <div ref={xpCardRef} className="bg-secondaryBG p-8 rounded-3xl flex flex-col items-center text-center">
              <SkeletonBlock className="h-12 w-52 rounded-full mb-6" />
              <SkeletonBlock className="h-14 w-28" />
              <SkeletonBlock className="h-5 w-40 mt-2 mb-8" />
              <div className="w-full">
                <SkeletonBlock className="h-2 w-full rounded-full mb-3" />
                <SkeletonBlock className="h-5 w-48 mx-auto" />
              </div>
            </div>
          ) : (
            <div ref={xpCardRef} className="bg-secondaryBG p-8 rounded-3xl flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 border border-primary px-6 py-3 rounded-full text-primary text-[16px] font-medium mb-6">
                <BsTrophy size={24} />
                {rank}
              </div>

              <div className="text-5xl font-bold text-primary mb-1">
                {totalXp}
              </div>
              <div className="text-textsecondary text-[16px] mb-8">
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
                  <p className="text-textsecondary text-[16px]">
                    {xpToNext} XP more to {currentRank.next}
                  </p>
                ) : (
                  <p className="text-textsecondary text-[16px]">
                    Max rank achieved 🎉
                  </p>
                )}
              </div>
            </div>
          )}

          {/* RECENT ACTIVITIES */}
          <div ref={recentActivitiesRef}>
            <h2 className="text-textmain text-2xl font-semibold tracking-wide mb-4">
              Recent Activities
            </h2>

            <div className="flex flex-col gap-4">
              {showRecentSkeleton &&
                Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-secondaryBG rounded-2xl p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <SkeletonBlock className="h-5 w-36" />
                        <SkeletonBlock className="h-4 w-44 mt-2" />
                      </div>
                      <SkeletonBlock className="h-6 w-14" />
                    </div>
                  </div>
                ))}

              {recentError && (
                <p className="text-red-400">Failed to load recent activity.</p>
              )}

              {!showRecentSkeleton &&
                recentActivities?.slice(0, 8).map((activity, index) => (
                  <RecentActivityItem
                    key={`${activity.reward_id}-${index}`}
                    title={activity.name}
                    time={formatRecentActivityTime(
                      activity.occurred_at ?? activity.unlocked_at,
                    )}
                    xp={activity.xp_gained}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>

      <LoadingOverlay show={showLoadingOverlay} />
      <Tour
        open={shouldOpenRewardsTour}
        onClose={() => setRewardsTour(false)}
        onFinish={() => setRewardsTour(false)}
        steps={rewardsTourSteps}
        zIndex={2147483645}
        rootClassName="!z-[2147483645]"
      />

      <VoucherCongratsOverlay />
    </div>
  );
}
