"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaMoneyBillWave, FaPiggyBank, FaChartPie } from "react-icons/fa";
import PageProgressBar from "@/components/gloabalComponents/PageProgressBar";
import Logo from "@/components/gloabalComponents/Logo";

const OnboardingPage = () => {
  const params = useParams();
  const router = useRouter();

  const step = params.step as string;

  // Determine current step number and content
  const getStepData = () => {
    switch (step) {
      case "goal":
        return {
          currentStep: 1,
          title: "What is your goal with Logo?",
          options: [
            "Keep my finances under control",
            "Save more effectively",
            "Track my expenses better",
            "Plan my future goals",
            "Get better financial insights",
          ],
          icon: <FaMoneyBillWave />,
          buttonText: "Continue",
        };
      case "spending":
        return {
          currentStep: 2,
          title: "How do you usually spend your money?",
          options: [
            "I spend mostly on needs",
            "I often buy impulsively",
            "I prefer saving more than spending",
            "I balance both saving and spending",
          ],
          icon: <FaPiggyBank />,
          buttonText: "Continue",
        };
      case "budget-category":
        return {
          currentStep: 3,
          title: "What category do you want to budget for?",
          options: [],
          icon: <FaChartPie />,
          buttonText: "Finish",
        };
      default:
        return {
          currentStep: 1,
          title: "What is your goal with Logo?",
          options: [],
          icon: <FaMoneyBillWave />,
          buttonText: "Continue",
        };
    }
  };

  const { currentStep, title, options, icon, buttonText } = getStepData();
  const [selected, setSelected] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");

  const handleNext = () => {
    if (step === "goal") router.push("/onboarding/spending");
    else if (step === "spending") router.push("/onboarding/budget-category");
    else console.log("Finished onboarding with:", { selected, inputValue });
  };

  return (
    <div className="min-h-screen w-full bg-[#0e0e0e] flex flex-col items-center justify-start pt-12 text-white">
      {/* Logo */}
      <div className="w-[90%] flex justify-start">
        <Logo width={200} />
      </div>

      {/* Progress bar */}
      <PageProgressBar currentStep={currentStep} totalSteps={3} />

      {/* Title */}
      <div className="text-center mt-12 mb-12">
        <h2 className="text-3xl font-semibold text-[#fca311]">{title}</h2>
      </div>

      {/* Options or Input Field */}
      {step !== "budget-category" ? (
        <div className="flex flex-col gap-4 w-[90%] max-w-xl">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelected(index)}
              className={`flex items-center gap-3 px-5 py-4 rounded-xl border transition-all duration-200 cursor-pointer
                ${
                  selected === index
                    ? "border-blue-500 bg-[#1a1a1a]"
                    : "border-transparent bg-[#1a1a1a]/80"
                }`}
            >
              <span
                className={`text-lg ${
                  selected === index ? "text-blue-400" : "text-gray-300"
                }`}
              >
                {icon}
              </span>
              <span
                className={`text-base ${
                  selected === index ? "text-blue-400" : "text-gray-200"
                }`}
              >
                {option}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="w-[90%] max-w-xl">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter your category..."
            className="w-full bg-accentBG text-textmain placeholder-textsecondary rounded-full px-5 py-4 focus:outline-none focus:border-primary transition-all duration-300"
          />
        </div>
      )}

      {/* Continue/Finish button */}
      <button
        className="mt-18 w-full max-w-md bg-primary hover:bg-primary/80 text-textmain font-semibold py-3 px-10 rounded-full text-lg transition-colors cursor-pointer"
        onClick={handleNext}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default OnboardingPage;
