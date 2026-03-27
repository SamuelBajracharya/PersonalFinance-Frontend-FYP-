"use client";

import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useCreateBudget } from "@/hooks/useBudgetGoals";
import { useCreateBudgetOverlay } from "@/stores/useCreateBudgetOverlay";
import { Select } from "antd";
import { useAntdMessage } from "@/components/gloabalComponents/AntdMessageContext";

const { Option } = Select;

const CATEGORY_OPTIONS = [
  "Groceries",
  "Coffee",
  "Shopping",
  "Transport",
  "Entertainment",
  "Utilities",
  "Food",
  "Clothing",
  "Travel",
];

const CreateBudgetOverlay: React.FC = () => {
  const { isCreateBudgetOpen, closeCreateBudget } = useCreateBudgetOverlay();
  const { mutate, isPending } = useCreateBudget();
  const messageApi = useAntdMessage();

  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState<number | "">("");

  if (!isCreateBudgetOpen) return null;

  const handleClose = () => {
    if (isPending) return;
    setCategory("");
    setAmount("");
    closeCreateBudget();
  };

  const handleCreate = () => {
    if (!category || !amount) return;
    mutate(
      {
        category,
        budget_amount: Number(amount),
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
            dropdownClassName="custom-select"
            size="large"
            options={CATEGORY_OPTIONS.map((cat) => ({ label: cat, value: cat }))}
            showSearch={false}
            allowClear={false}
            popupMatchSelectWidth={true}
            getPopupContainer={trigger => trigger.parentNode}
          />

          {/* Budget Amount */}
          <input
            type="number"
            placeholder="Budget amount"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="w-full rounded-full bg-transparent border-1 border-primary px-6 py-3 text-lg text-textmain focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-textsecondary"
          />
        </div>

        {/* Actions (flex column) */}
        <div className="mt-12 flex flex-col gap-4">
          <button
            onClick={handleCreate}
            disabled={!category || !amount || isPending}
            className={`rounded-full bg-primary py-4 text-lg font-medium text-textmain hover:bg-primary/80 transition disabled:opacity-70 ${(!category || !amount || isPending) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
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
