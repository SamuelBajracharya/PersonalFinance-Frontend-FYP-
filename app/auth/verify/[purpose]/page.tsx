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
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { OtpData, TokenResponse, ResetTokenResponse } from "@/types/authAPI";
import { useRequestOtp, useVerifyOtp } from "@/hooks/useAuth";
import { message } from "antd";

type Purpose = "email_verification" | "password_reset" | "two_factor_auth";

interface TextMap {
  [key: string]: {
    title: string;
    subtitle: string;
  };
}

const textMap: TextMap = {
  email_verification: {
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
  const { purpose } = use(params);
  const [code, setCode] = useState<string[]>(new Array(6).fill(""));
  const [cooldown, setCooldown] = useState(0);
  const router = useRouter();
  const { mutate: verifyOtp, isPending: verifying } = useVerifyOtp();
  const { mutate: resendOtp, isPending: resending } = useRequestOtp();

  const { title, subtitle } = textMap[purpose] || textMap.email_verification;

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
      message.warning("Please enter the full 6-digit code");
      return;
    }

    const otpData: OtpData = { code: fullCode, purpose };

    verifyOtp(otpData, {
      onSuccess: (res: TokenResponse | ResetTokenResponse) => {
        message.success("Code verified successfully!");

        if ("reset_token" in res) {
          Cookies.set("resetToken", res.reset_token, {
            expires: 1 / 24,
            secure: true,
            sameSite: "strict",
          });
          router.push(`/auth/reset-password`);
          return;
        }

        Cookies.set("accessToken", res.access_token, {
          expires: 1,
          secure: true,
          sameSite: "strict",
        });

        Cookies.set("refreshToken", res.refresh_token, {
          expires: 7,
          secure: true,
          sameSite: "strict",
        });

        if (purpose === "email_verification") {
          router.push("/onboarding/goal");
        } else {
          router.push("/dashboard");
        }
      },
      onError: (err: any) =>
        message.error(
          err?.response?.data?.message || "Invalid or expired code"
        ),
    });
  };

  const handleResend = (): void => {
    if (cooldown > 0) return;

    resendOtp(purpose, {
      onSuccess: () => {
        message.success("OTP code resent successfully!");
        setCooldown(60);
      },
      onError: (err: any) =>
        message.error(err?.response?.data?.message || "Failed to resend code"),
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-textmain px-6 w-full max-w-xl mx-auto">
      <div className="mb-12">
        <Logo width={240} />
      </div>

      <h1 className="text-4xl font-semibold text-primary mb-4 text-center">
        {title}
      </h1>
      <p className="text-lg text-gray-300 text-center mb-8">{subtitle}</p>

      <div className="flex space-x-3 mb-6">
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
            className="size-16 text-center text-lg rounded-lg bg-accentBG focus:border-primary focus:outline-none"
          />
        ))}
      </div>

      <p className="text-md text-gray-400 mb-8">
        Didn’t receive any code?{" "}
        <button
          onClick={handleResend}
          disabled={resending || cooldown > 0}
          className="text-accent hover:underline disabled:opacity-50"
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
        className="bg-primary hover:bg-primary/80 text-white w-[80%] font-semibold py-3 px-20 rounded-full transition-colors duration-200 disabled:opacity-50"
      >
        {verifying ? "Verifying..." : "Verify"}
      </button>
    </div>
  );
}
