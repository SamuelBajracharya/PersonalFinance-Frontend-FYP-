"use client";

import { UserVoucher, VoucherTemplate } from "@/api/couponsAPI";
import CouponTicket from "@/components/gloabalComponents/CouponTicket";
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

  return (
    <div className="min-h-screen p-8 text-white space-y-12">
      <section>
        <h2 className="text-2xl font-semibold mb-6">Available Coupons</h2>

        {availableLoading && <p>Loading available coupons...</p>}

        {!availableLoading && available && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {available.map((voucher: VoucherTemplate) => (
              <CouponTicket
                key={voucher.id}
                title={voucher.title}
                brand={getBrandFromTitle(voucher.title)}
                tier={voucher.tier_required}
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

        {activeLoading && <p>Loading active coupons...</p>}

        {!activeLoading && active && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {active.map((voucher: UserVoucher) => (
              <CouponTicket
                key={voucher.id}
                title={voucher.title}
                brand={getBrandFromTitle(voucher.title)}
                tier={voucher.tier_required}
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

        {historyLoading && <p>Loading expired coupons...</p>}

        {!historyLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-60">
            {expiredVouchers.map((voucher: UserVoucher) => (
              <CouponTicket
                key={voucher.id}
                title={voucher.title}
                brand={getBrandFromTitle(voucher.title)}
                tier={voucher.tier_required}
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
    </div>
  );
}
