"use client";

import Logo from "@/components/gloabalComponents/Logo";
import React, {
  useState,
  ChangeEvent,
  ClipboardEvent,
  KeyboardEvent,
  JSX,
  use,
} from "react";

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
    subtitle: "Please input the 6 digit verification code sent to your email",
  },
  password_reset: {
    title: "Enter Reset Password Code",
    subtitle: "Enter the code sent to your email to reset your password",
  },
  two_factor_auth: {
    title: "2-Step Authentication",
    subtitle: "Enter the 6 digit security code sent to your device",
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

  const { title, subtitle } = textMap[purpose] || textMap.email_verification;

  const handleChange = (value: string, index: number): void => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus next input
      if (value && index < 5) {
        const next = document.getElementById(
          `code-${index + 1}`
        ) as HTMLInputElement | null;
        if (next) next.focus();
      }
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pasted)) return;

    const digits = pasted.split("").slice(0, 6);
    const newCode = [...code];
    for (let i = 0; i < digits.length; i++) {
      newCode[i] = digits[i];
    }
    setCode(newCode);

    // Focus last filled input
    const nextIndex = Math.min(digits.length - 1, 5);
    const next = document.getElementById(
      `code-${nextIndex}`
    ) as HTMLInputElement | null;
    if (next) next.focus();
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
        const prev = document.getElementById(
          `code-${index - 1}`
        ) as HTMLInputElement | null;
        if (prev) prev.focus();
      }
    }
  };

  const handleVerify = (): void => {
    const fullCode = code.join("");
    if (fullCode.length < 6) {
      alert("Please enter the full code");
      return;
    }
    console.log("Verifying code:", fullCode, "for purpose:", purpose);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-textmain px-6 w-full max-w-xl mx-auto">
      {/* Logo */}
      <div className="mb-12">
        {" "}
        <Logo width={240} />
      </div>

      {/* Title */}
      <h1 className="text-4xl font-semibold text-primary mb-4 text-center">
        {title}
      </h1>

      {/* Subtitle */}
      <p className="text-lg text-gray-300 text-center mb-8">{subtitle}</p>

      {/* Verification Code Inputs */}
      <div className="flex space-x-3 mb-6">
        {code.map((num, i) => (
          <input
            key={i}
            id={`code-${i}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={num}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange(e.target.value, i)
            }
            onPaste={handlePaste}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className="size-16 text-center text-lg rounded-lg bg-accentBG focus:border-primary focus:border-1 focus:outline-none"
          />
        ))}
      </div>

      {/* Resend */}
      <p className="text-md text-gray-400 mb-8">
        You didn’t receive any code?{" "}
        <button className="text-blue-500 hover:underline">Resend code</button>
      </p>

      {/* Verify Button */}
      <button
        onClick={handleVerify}
        className="bg-[#FFA726] hover:bg-[#FF9800] text-white w-[80%] font-semibold py-3 px-20 rounded-full transition-colors duration-200"
      >
        Verify
      </button>
    </div>
  );
}
