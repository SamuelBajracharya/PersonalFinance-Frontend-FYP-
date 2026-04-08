"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FaBolt,
  FaBullseye,
  FaBus,
  FaCarSide,
  FaChartLine,
  FaEllipsisH,
  FaFilm,
  FaGraduationCap,
  FaHeartbeat,
  FaHome,
  FaLightbulb,
  FaMoneyBillWave,
  FaPiggyBank,
  FaShoppingBag,
  FaShoppingBasket,
  FaShieldAlt,
  FaUtensils,
  FaWallet,
} from "react-icons/fa";
import PageProgressBar from "@/components/gloabalComponents/PageProgressBar";
import Logo from "@/components/gloabalComponents/Logo";
import { useCreateBudget } from "@/hooks/useBudgetGoals";
import { TRANSACTION_CATEGORIES } from "@/types/transactionCategories";
import { fetchMyBudgetsAPI } from "@/api/BudgetGoalAPI";

type StepOption = {
  label: string;
  icon: React.ReactNode;
};

type StepData = {
  currentStep: number;
  title: string;
  options: StepOption[];
  buttonText: string;
  inputConfig?: {
    type: "number";
    placeholder: string;
  };
};

const BUDGET_CATEGORY_MAP: Record<string, string> = {
  "Food & Dining": "Food",
  Transportation: "Transport",
  "Housing / Rent": "Utilities",
  Housing: "Utilities",
  Healthcare: "Utilities",
  Education: "Shopping",
  Savings: "Travel",
};

const ALLOWED_BUDGET_CATEGORIES = new Set(TRANSACTION_CATEGORIES);

const normalizeBudgetCategory = (category: string): string => {
  const trimmed = category.trim();
  const mapped = BUDGET_CATEGORY_MAP[trimmed] ?? trimmed;

  if (ALLOWED_BUDGET_CATEGORIES.has(mapped)) {
    return mapped;
  }

  // Last-resort fallback to avoid request rejection from invalid category values.
  return "Food";
};

const OnboardingPage = () => {
  const params = useParams();
  const router = useRouter();
  const { mutateAsync: createBudget } = useCreateBudget();

  const step = params.step as string;

  // Determine current step number and content
  const getStepData = (): StepData => {
    switch (step) {
      case "goal":
        return {
          currentStep: 1,
          title: "What is your goal with Logo?",
          options: [
            {
              label: "Keep my finances under control",
              icon: <FaShieldAlt />,
            },
            {
              label: "Save more effectively",
              icon: <FaPiggyBank />,
            },
            {
              label: "Track my expenses better",
              icon: <FaWallet />,
            },
            {
              label: "Plan my future goals",
              icon: <FaBullseye />,
            },
            {
              label: "Get better financial insights",
              icon: <FaChartLine />,
            },
            {
              label: "Others",
              icon: <FaEllipsisH />,
            },
          ],
          buttonText: "Continue",
        };
      case "spending":
        return {
          currentStep: 2,
          title: "Which category can't you afford to spend less on?",
          options: [
            {
              label: "Housing / Rent",
              icon: <FaHome />,
            },
            {
              label: "Groceries",
              icon: <FaShoppingBasket />,
            },
            {
              label: "Utilities",
              icon: <FaBolt />,
            },
            {
              label: "Healthcare",
              icon: <FaHeartbeat />,
            },
            {
              label: "Education",
              icon: <FaGraduationCap />,
            },
            {
              label: "Transportation",
              icon: <FaBus />,
            },
            {
              label: "Others",
              icon: <FaEllipsisH />,
            },
          ],
          buttonText: "Continue",
        };
      case "budget-category":
        return {
          currentStep: 3,
          title: "What category do you want to start your budget goal with?",
          options: [
            {
              label: "Food",
              icon: <FaUtensils />,
            },
            {
              label: "Transport",
              icon: <FaCarSide />,
            },
            {
              label: "Groceries",
              icon: <FaShoppingBasket />,
            },
            {
              label: "Utilities",
              icon: <FaBolt />,
            },
            {
              label: "Shopping",
              icon: <FaShoppingBag />,
            },
            {
              label: "Entertainment",
              icon: <FaFilm />,
            },
            {
              label: "Coffee",
              icon: <FaMoneyBillWave />,
            },
            {
              label: "Clothing",
              icon: <FaShieldAlt />,
            },
            {
              label: "Travel",
              icon: <FaBus />,
            },
          ],
          buttonText: "Continue",
        };
      case "budget-amount":
        return {
          currentStep: 4,
          title: "What budget amount do you want to set for this category?",
          options: [],
          buttonText: "Finish",
          inputConfig: {
            type: "number",
            placeholder: "Enter budget amount...",
          },
        };
      default:
        return {
          currentStep: 1,
          title: "What is your goal with Logo?",
          options: [
            {
              label: "Keep my finances under control",
              icon: <FaShieldAlt />,
            },
          ],
          buttonText: "Continue",
        };
    }
  };

  const { currentStep, title, options, buttonText, inputConfig } =
    getStepData();
  const [selected, setSelected] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [otherValue, setOtherValue] = useState("");

  const selectedOption = selected !== null ? options[selected] : null;
  const isOtherSelected = selectedOption?.label === "Others";

  const getOtherPlaceholder = () => {
    if (step === "goal") {
      return "Tell us your goal...";
    }

    if (step === "spending") {
      return "Enter category you cannot reduce spending on...";
    }

    if (step === "budget-category") {
      return "Enter your budget goal category...";
    }

    return "Enter your option...";
  };

  useEffect(() => {
    setSelected(null);
    setInputValue("");
    setOtherValue("");
  }, [step]);

  const isActionDisabled = inputConfig
    ? !inputValue.trim() || Number(inputValue) <= 0
    : selected === null || (isOtherSelected && !otherValue.trim());

  const handleNext = async () => {
    if (isActionDisabled) return;

    if (inputConfig) {
      localStorage.setItem("onboarding_budgetAmount", inputValue);
    } else if (selected !== null) {
      const selectedLabel =
        selectedOption?.label === "Others" ? otherValue.trim() : selectedOption?.label;

      if (selectedLabel) {
        localStorage.setItem(`onboarding_${step}`, selectedLabel);
      }
    }

    if (step === "goal") {
      router.push("/onboarding/spending");
    } else if (step === "spending") {
      router.push("/onboarding/budget-category");
    } else if (step === "budget-category") {
      router.push("/onboarding/budget-amount");
    } else if (step === "budget-amount") {
      localStorage.setItem("isBankLinked", "false");

      const selectedCategory = localStorage.getItem("onboarding_budget-category");
      const budgetAmountRaw = localStorage.getItem("onboarding_budgetAmount") ?? inputValue;
      const parsedBudgetAmount = Number(budgetAmountRaw);
      const normalizedCategory = selectedCategory
        ? normalizeBudgetCategory(selectedCategory)
        : null;

      if (
        normalizedCategory &&
        Number.isFinite(parsedBudgetAmount) &&
        parsedBudgetAmount > 0
      ) {
        try {
          const existingBudgets = await fetchMyBudgetsAPI();
          const hasDuplicateCategory = existingBudgets.some(
            (budget) =>
              budget.category.trim().toLowerCase() ===
              normalizedCategory.trim().toLowerCase()
          );

          if (!hasDuplicateCategory) {
            await createBudget({
              category: normalizedCategory,
              budget_amount: parsedBudgetAmount,
            });
          }
        } catch (error) {
          console.error("Failed to auto-create onboarding budget goal:", error);
        }
      }

      localStorage.removeItem("onboarding_goal");
      localStorage.removeItem("onboarding_spending");
      localStorage.removeItem("onboarding_budget-category");
      localStorage.removeItem("onboarding_budgetAmount");

      router.push("/transactions");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0e0e0e] flex flex-col items-center justify-start pt-12 text-white">
      {/* Logo */}
      <div className="w-[90%] flex justify-start">
        <Logo width={200} />
      </div>

      {/* Progress bar */}
      <PageProgressBar currentStep={currentStep} totalSteps={4} />

      {/* Title */}
      <div className="text-center mt-12 mb-12">
        <h2 className="text-3xl font-semibold text-[#fca311]">{title}</h2>
      </div>

      {/* Options or Input Field */}
      {!inputConfig ? (
        <div className="flex flex-col gap-4 w-[90%] max-w-xl">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                setSelected(index);
                if (options[index].label !== "Others") {
                  setOtherValue("");
                }
              }}
              className={`flex items-center gap-3 px-5 py-4 rounded-xl border transition-all duration-200 cursor-pointer
                ${selected === index
                  ? "border-blue-500 bg-[#1a1a1a]"
                  : "border-transparent bg-[#1a1a1a]/80"
                }`}
            >
              <span
                className={`text-lg ${selected === index ? "text-blue-400" : "text-gray-300"
                  }`}
              >
                {option.icon}
              </span>
              <span
                className={`text-base ${selected === index ? "text-blue-400" : "text-gray-200"
                  }`}
              >
                {option.label}
              </span>
            </button>
          ))}

          {isOtherSelected ? (
            <input
              type="text"
              value={otherValue}
              onChange={(e) => setOtherValue(e.target.value)}
              placeholder={getOtherPlaceholder()}
              className="w-full bg-accentBG text-textmain placeholder-textsecondary rounded-full px-5 py-4 focus:outline-none focus:border-primary transition-all duration-300"
            />
          ) : null}
        </div>
      ) : (
        <div className="w-[90%] max-w-xl">
          <input
            type={inputConfig.type}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            min="0"
            step="0.01"
            placeholder={inputConfig.placeholder}
            className="w-full bg-accentBG text-textmain placeholder-textsecondary rounded-full px-5 py-4 focus:outline-none focus:border-primary transition-all duration-300"
          />
        </div>
      )}

      {/* Continue/Finish button */}
      <button
        className={`mt-18 w-full max-w-md text-textmain font-semibold py-3 px-10 rounded-full text-lg transition-colors
          ${isActionDisabled
            ? "bg-primary/40 cursor-not-allowed"
            : "bg-primary hover:bg-primary/80 cursor-pointer"
          }`}
        onClick={handleNext}
        disabled={isActionDisabled}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default OnboardingPage;
