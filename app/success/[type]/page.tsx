"use client";

import Logo from "@/components/gloabalComponents/Logo";
import React, { JSX, use } from "react";
import { PiCheckFatFill } from "react-icons/pi";

type SuccessType = "verification" | "reset_password";

interface TextMap {
  [key: string]: {
    title: string;
    message: string;
    buttonText: string;
  };
}

const textMap: TextMap = {
  verification: {
    title: "Verification Successful!",
    message:
      "Your account has been verified. You now have full access to all features and can proceed with your account.",
    buttonText: "Continue",
  },
  reset_password: {
    title: "Password Reset Successful!",
    message:
      "Your password has been successfully reset. You can now log in using your new password.",
    buttonText: "Go to Login",
  },
};

interface SuccessPageProps {
  params: Promise<{
    type: SuccessType;
  }>;
}

export default function SuccessPage({ params }: SuccessPageProps): JSX.Element {
  const { type } = use(params);
  const { title, message, buttonText } = textMap[type] || textMap.verification;

  const handleContinue = () => {
    if (type === "reset_password") {
      window.location.href = "/auth/login";
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-text-main px-6">
      {/* Logo */}
      <div className="absolute top-12 left-16 text-3xl font-bold text-gray-100">
        <Logo width={200} />
      </div>

      {/* Success Icon */}
      <div className="bg-green-500 rounded-full p-6 mb-12 flex items-center justify-center">
        <PiCheckFatFill className="text-white text-7xl" />
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-semibold text-[#FFA726] mb-4 text-center">
        {title}
      </h1>

      {/* Message */}
      <p className="text-gray-300 text-center max-w-md mb-16 leading-relaxed text-lg">
        {message}
      </p>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        className="bg-[#FFA726] hover:bg-[#FF9800] text-white font-semibold py-3 px-16 rounded-full transition-colors duration-200 cursor-pointer w-full max-w-md"
      >
        {buttonText}
      </button>
    </div>
  );
}
