"use client";

import { UserVoucher, VoucherTemplate } from "@/api/couponsAPI";
import CouponTicket, { TierLevel } from "@/components/gloabalComponents/CouponTicket";
import LoadingOverlay from "@/components/gloabalComponents/LoadingOverlay";
import SkeletonBlock from "@/components/gloabalComponents/SkeletonBlock";
import {
  useAvailableVoucherTemplates,
  useMyActiveVouchers,
  useVoucherHistory,
} from "@/hooks/useCoupons";

/* helpers reused from rewards page */
const getBrandFromTitle = (title: string) => {
  const lower = title.toLowerCase();
  if (lower.includes("worldlink")) return "worldlink";
  if (lower.includes("daraz")) return "daraz";
  if (lower.includes("coffee")) return "himalayan_java";
  return "foodmandu";
};

const getDiscountText = (type: string, value: number) => {
  return type === "PERCENTAGE" ? `${value}% OFF` : `Rs ${value} OFF`;
};

export default function CouponsPage() {
  const { data: available, isLoading: availableLoading } =
    useAvailableVoucherTemplates();

  const { data: active, isLoading: activeLoading } = useMyActiveVouchers();

  const { data: history, isLoading: historyLoading } = useVoucherHistory();

  const expiredVouchers = history?.filter((v) => v.status === "EXPIRED") ?? [];
  const showAvailableSkeleton = availableLoading && !available;
  const showActiveSkeleton = activeLoading && !active;
  const showHistorySkeleton = historyLoading && !history;
  const showLoadingOverlay =
    showAvailableSkeleton || showActiveSkeleton || showHistorySkeleton;

  return (
    <div className="min-h-screen p-8 text-white space-y-12">
      <section>
        <h2 className="text-2xl font-semibold mb-6">Available Coupons</h2>

        {showAvailableSkeleton && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-[220px] rounded-3xl bg-secondaryBG" />
            ))}
          </div>
        )}

        {!showAvailableSkeleton && available && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {available.map((voucher: VoucherTemplate) => (
              <CouponTicket
                key={voucher.id}
                title={voucher.title}
                brand={getBrandFromTitle(voucher.title)}
                tier={voucher.tier_required as TierLevel}
                discount={getDiscountText(
                  voucher.discount_type,
                  voucher.discount_value,
                )}
                expiry={"Unlock by earning XP"}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Active Coupons</h2>

        {showActiveSkeleton && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-[220px] rounded-3xl bg-secondaryBG" />
            ))}
          </div>
        )}

        {!showActiveSkeleton && active && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {active.map((voucher: UserVoucher) => (
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
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Expired Coupons</h2>

        {showHistorySkeleton && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-60">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-[220px] rounded-3xl bg-secondaryBG" />
            ))}
          </div>
        )}

        {!showHistorySkeleton && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-60">
            {expiredVouchers.map((voucher: UserVoucher) => (
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
      </section>

      <LoadingOverlay show={showLoadingOverlay} />
    </div>
  );
}
