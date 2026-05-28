"use client";

import Logo from "@/components/gloabalComponents/Logo";
import React, {
  useState,
  ClipboardEvent,
  KeyboardEvent,
  JSX,
  useEffect,
  use,
} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { OtpData, TokenResponse, ResetTokenResponse } from "@/types/authAPI";
import { useRequestOtp, useVerifyOtp } from "@/hooks/useAuth";
import { message } from "antd";

type Purpose = "account_verification" | "password_reset" | "two_factor_auth";

interface TextMap {
  [key: string]: {
    title: string;
    subtitle: string;
  };
}

const textMap: TextMap = {
  account_verification: {
    title: "Enter Verification Code",
    subtitle: "Please input the 6-digit verification code sent to your email",
  },
  password_reset: {
    title: "Enter Reset Password Code",
    subtitle: "Enter the code sent to your email to reset your password",
  },
  two_factor_auth: {
    title: "2-Step Authentication",
    subtitle: "Enter the 6-digit security code sent to your device",
  },
};

interface VerificationPageProps {
  params: Promise<{
    purpose: Purpose;
  }>;
}

export default function VerificationPage({
  params,
}: VerificationPageProps): JSX.Element {
  const secureCookie = process.env.NODE_ENV === "production";
  const { purpose } = use(params);
  const [code, setCode] = useState<string[]>(new Array(6).fill(""));
  const [cooldown, setCooldown] = useState(0);
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const { mutate: verifyOtp, isPending: verifying } = useVerifyOtp();
  const { mutate: resendOtp, isPending: resending } = useRequestOtp();

  const { title, subtitle } = textMap[purpose] || textMap.account_verification;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((t) => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleChange = (value: string, index: number): void => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        document.getElementById(`code-${index + 1}`)?.focus();
      }
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pasted)) return;

    const digits = pasted.split("").slice(0, 6);
    const newCode = [...code];
    for (let i = 0; i < digits.length; i++) newCode[i] = digits[i];
    setCode(newCode);
    document.getElementById(`code-${Math.min(digits.length - 1, 5)}`)?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newCode = [...code];

      if (newCode[index]) {
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) {
        newCode[index - 1] = "";
        setCode(newCode);
        document.getElementById(`code-${index - 1}`)?.focus();
      }
    }
  };

  const handleVerify = (): void => {
    const fullCode = code.join("");
    if (fullCode.length < 6) {
      messageApi.warning("Please enter the full 6-digit code");
      return;
    }

    const otpData: OtpData = { code: fullCode, purpose };

    verifyOtp(otpData, {
      onSuccess: (res: TokenResponse | ResetTokenResponse) => {
        messageApi.success("Code verified successfully!");

        if ("reset_token" in res) {
          Cookies.set("resetToken", res.reset_token, {
            expires: 1 / 24,
            secure: secureCookie,
            sameSite: "strict",
          });
          router.push("/auth/reset-password");
          return;
        }

        Cookies.set("accessToken", res.access_token, {
          expires: 1,
          secure: secureCookie,
          sameSite: "strict",
        });

        Cookies.set("refreshToken", res.refresh_token, {
          expires: 7,
          secure: secureCookie,
          sameSite: "strict",
        });

        const successRouteMap: Record<Purpose, string> = {
          account_verification: "/success/account_verification",
          password_reset: "/success/password_reset",
          two_factor_auth: "/success/two_factor_auth",
        };

        router.push(successRouteMap[purpose]);
      },
      onError: (err: any) =>
        messageApi.error(
          err?.response?.data?.message || "Invalid or expired code",
        ),
    });
  };

  const handleResend = (): void => {
    if (cooldown > 0) return;

    resendOtp(purpose, {
      onSuccess: () => {
        messageApi.success("OTP code resent successfully!");
        setCooldown(60);
      },
      onError: (err: any) =>
        messageApi.error(err?.response?.data?.message || "Failed to resend code"),
    });
  };

  return (
    <div className="flex flex-col items-center h-full text-textmain px-4 w-full max-w-xl mx-auto theme-transition py-4 md:justify-center md:h-auto">
      {contextHolder}

      {/* Desktop Logo */}
      <div className="hidden md:block mb-10">
        <Logo width={240} />
      </div>

      {/* Mobile Illustration Banner */}
      <div className="w-full flex-grow flex-1 relative rounded-3xl overflow-hidden shadow-2xl mb-6 md:hidden min-h-[150px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/auth_image.png"
          alt="auth-image"
          className="absolute inset-0 w-full h-full object-cover scale-[1.15]"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/40" />
      </div>

      {/* Verification Form and Titles */}
      <div className="w-full flex flex-col items-center shrink-0">
        <h1 className="text-3xl md:text-4xl font-semibold text-primary mb-3 text-center">
          {title}
        </h1>
        <p className="text-base md:text-lg text-textsecondary text-center mb-8 theme-transition max-w-md">{subtitle}</p>

        <div className="flex space-x-2 md:space-x-3 mb-6 justify-center w-full">
          {code.map((num, i) => (
            <input
              key={i}
              id={`code-${i}`}
              type="text"
              maxLength={1}
              value={num}
              inputMode="numeric"
              onChange={(e) => handleChange(e.target.value, i)}
              onPaste={handlePaste}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className="size-12 md:size-16 text-center text-xl rounded-lg bg-accentBG border border-accentBG text-textmain focus:border-primary focus:outline-none theme-transition"
            />
          ))}
        </div>

        <p className="text-md text-textsecondary mb-8 theme-transition whitespace-nowrap">
          Didn’t receive any code?{" "}
          <button
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            className="text-accent hover:underline disabled:opacity-50 theme-transition font-medium cursor-pointer"
          >
            {cooldown > 0
              ? `Resend in ${cooldown}s`
              : resending
                ? "Resending..."
                : "Resend code"}
          </button>
        </p>

        <button
          onClick={handleVerify}
          disabled={verifying}
          className="bg-primary hover:bg-primary/80 text-white w-full max-w-xs font-semibold py-3 px-8 rounded-full theme-transition disabled:opacity-50 cursor-pointer shadow-lg"
        >
          {verifying ? "Verifying..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
