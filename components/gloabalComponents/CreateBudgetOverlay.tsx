"use client";

import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useCreateBudget } from "@/hooks/useBudgetGoals";
import { useCreateBudgetOverlay } from "@/stores/useCreateBudgetOverlay";
import { Select } from "antd";
import { useAntdMessage } from "@/components/gloabalComponents/AntdMessageContext";
import { fetchPastSpendingOptionsAPI, PastSpendingOption } from "@/api/BudgetGoalAPI";
import { TRANSACTION_CATEGORIES } from "@/types/transactionCategories";

const CreateBudgetOverlay: React.FC = () => {
  const { isCreateBudgetOpen, closeCreateBudget } = useCreateBudgetOverlay();
  const { mutate, isPending } = useCreateBudget();
  const messageApi = useAntdMessage();

  const [category, setCategory] = useState("");
  const [options, setOptions] = useState<PastSpendingOption[]>([]);
  const [pastSpending, setPastSpending] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<PastSpendingOption | null>(null);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  React.useEffect(() => {
    if (!category) {
      setOptions([]);
      setPastSpending(null);
      setSelectedOption(null);
      return;
    }
    const loadOptions = async () => {
      setIsLoadingOptions(true);
      try {
        const data = await fetchPastSpendingOptionsAPI(category);
        setOptions(data.options);
        setPastSpending(data.past_spending);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingOptions(false);
      }
    };
    loadOptions();
  }, [category]);

  if (!isCreateBudgetOpen) return null;

  const handleClose = () => {
    if (isPending) return;
    setCategory("");
    setSelectedOption(null);
    setOptions([]);
    setPastSpending(null);
    closeCreateBudget();
  };

  const handleCreate = () => {
    if (!category || !selectedOption || pastSpending === null) return;
    mutate(
      {
        category,
        budget_amount: Number(selectedOption.new_budget_amount),
        past_spending: Number(pastSpending),
        reduction_percent: Number(selectedOption.reduction_percent),
      },
      {
        onSuccess: () => {
          messageApi.success("Budget goal created successfully!");
          setTimeout(() => {
            handleClose();
          }, 2000);
        },
        onError: () => {
          messageApi.error("Failed to create budget goal. Try again.");
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 !z-[2147483645] flex items-center justify-center bg-overlay/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-secondaryBG p-8">
        {/* Close */}
        <button
          onClick={handleClose}
          disabled={isPending}
          className={`absolute right-8 top-8 text-textsecondary hover:text-textmain transition disabled:opacity-50 ${isPending ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          type="button"
        >
          <FaTimes size={24} />
        </button>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-semibold text-primary mb-4">
            Create New Budget
          </h2>
          <p className="text-textsecondary text-lg">
            Define a category and set your budget limit.
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-5">
          {/* Category Select */}
          <Select
            value={category || undefined}
            onChange={(value: string) => setCategory(value)}
            placeholder="Select category"
            className="custom-select !w-full cursor-pointer !h-[3.5rem]"
            classNames={{ popup: { root: "custom-select" } }}
            size="large"
            options={TRANSACTION_CATEGORIES.map((cat) => ({ label: cat, value: cat }))}
            showSearch={false}
            allowClear={false}
            popupMatchSelectWidth={true}
            getPopupContainer={trigger => trigger.parentNode}
          />

          {/* Budget Options */}
          {category && (
            <div className="flex flex-col gap-2">
              <label className="text-textsecondary text-sm font-medium">
                Choose a reduction option based on past month's spending (saves amount):
              </label>
              {isLoadingOptions ? (
                <div className="text-textsecondary text-sm animate-pulse">
                  Analyzing transactions and generating options...
                </div>
              ) : (
                <Select
                  value={selectedOption ? JSON.stringify(selectedOption) : undefined}
                  onChange={(valStr: string) => setSelectedOption(JSON.parse(valStr))}
                  placeholder="Select savings level"
                  className="custom-select !w-full cursor-pointer !h-[3.5rem]"
                  classNames={{ popup: { root: "custom-select" } }}
                  size="large"
                  options={options.map((opt) => ({
                    label: opt.label,
                    value: JSON.stringify(opt),
                  }))}
                  showSearch={false}
                  allowClear={false}
                  popupMatchSelectWidth={true}
                  getPopupContainer={(trigger) => trigger.parentNode}
                />
              )}
            </div>
          )}
        </div>

        {/* Actions (flex column) */}
        <div className="mt-12 flex flex-col gap-4">
          <button
            onClick={handleCreate}
            disabled={!category || !selectedOption || isPending}
            className={`rounded-full bg-primary py-4 text-lg font-medium text-textmain hover:bg-primary/80 transition disabled:opacity-70 ${(!category || !selectedOption || isPending) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            type="button"
          >
            {isPending ? "Creating..." : "Create Budget"}
          </button>

          <button
            onClick={handleClose}
            disabled={isPending}
            className={`rounded-full bg-accentBG py-4 text-lg text-textmain hover:bg-accentBG/80 transition disabled:opacity-40 ${isPending ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            type="button"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBudgetOverlay;
