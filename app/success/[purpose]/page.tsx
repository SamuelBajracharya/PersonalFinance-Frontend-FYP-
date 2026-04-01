"use client";

import { FaCheck } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { use } from "react";
import Logo from "@/components/gloabalComponents/Logo";

type SuccessPurpose =
  | "account_verification"
  | "password_reset"
  | "two_factor_auth";

interface PageProps {
  params: Promise<{
    purpose: SuccessPurpose;
  }>;
}

const successMap = {
  two_factor_auth: {
    title: "Verification Successful!",
    description:
      "Your account has been verified. You now have full access to all features and can proceed with your account.",
    redirect: "/dashboard",
  },
  password_reset: {
    title: "Password Reset Successful!",
    description:
      "Your password has been updated successfully. You can now continue using your account securely.",
    redirect: "/dashboard",
  },
  account_verification: {
    title: "Verification Successful!",
    description:
      "Your account has been verified. You now have full access to all features and can proceed with your account.",
    redirect: "/onboarding/goal",
  },
} as const;

export default function VerificationSuccessPage({ params }: PageProps) {
  const { purpose } = use(params);
  const router = useRouter();

  const content = successMap[purpose] ?? successMap.account_verification;

  return (
    <main className="min-h-screen flex flex-col items-center px-4 text-center relative pt-20 bg-mainBG text-textmain theme-transition">
      {/* Logo */}
      <div className="absolute top-6 left-6">
        <Logo width={240} />
      </div>

      <div className="w-full max-w-2xl mt-14 rounded-3xl bg-secondaryBG border border-accentBG shadow-2xl px-6 py-12 md:px-10 theme-transition">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="size-28 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg theme-transition">
            <FaCheck className="text-7xl text-white" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-semibold text-amber-400 mb-4 tracking-wide">
          {content.title}
        </h1>

        {/* Description */}
        <p className="text-textsecondary max-w-lg mx-auto mb-14 leading-relaxed text-xl theme-transition">
          {content.description}
        </p>

        {/* CTA */}
        <button
          onClick={() => router.push(content.redirect)}
          className="bg-primary hover:bg-primary/80 text-white font-medium text-xl px-30 py-3 rounded-full theme-transition shadow-md cursor-pointer"
        >
          Continue
        </button>
      </div>
    </main>
  );
}
