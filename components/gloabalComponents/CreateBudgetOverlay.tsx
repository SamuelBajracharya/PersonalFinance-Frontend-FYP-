"use client";

import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useCreateBudget } from "@/hooks/useBudgetGoals";
import { useCreateBudgetOverlay } from "@/stores/useCreateBudgetOverlay";
import { Select, message } from "antd";

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
          message.success({
            content: "Budget goal created successfully!",
            duration: 2,
            style: { zIndex: 9999 },
          });

          setTimeout(() => {
            handleClose();
          }, 2000); // matches the message duration
        },
        onError: () => {
          message.error({
            content: "Failed to create budget goal. Try again.",
            duration: 2,
            style: { zIndex: 9999 },
          });
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-secondaryBG p-8">
        {/* Close */}
        <button
          onClick={handleClose}
          disabled={isPending}
          className="absolute right-8 top-8 text-gray-300 hover:text-white transition disabled:opacity-50"
        >
          <FaTimes size={24} />
        </button>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-semibold text-primary mb-4">
            Create New Budget
          </h2>
          <p className="text-gray-300 text-lg">
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
            className="custom-select !py-6 w-full !text-gray-200 !bg-transparent border-1 border-primary rounded-full"
          >
            {CATEGORY_OPTIONS.map((cat) => (
              <Option key={cat} value={cat}>
                {cat}
              </Option>
            ))}
          </Select>

          {/* Budget Amount */}
          <input
            type="number"
            placeholder="Budget amount"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="w-full rounded-full bg-transparent border-1 border-primary px-6 py-3 text-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Actions (flex column) */}
        <div className="mt-12 flex flex-col gap-4">
          <button
            onClick={handleCreate}
            disabled={!category || !amount || isPending}
            className="rounded-full bg-primary py-4 text-lg font-medium hover:bg-primary/80 transition disabled:opacity-70"
          >
            {isPending ? "Creating..." : "Create Budget"}
          </button>

          <button
            onClick={handleClose}
            disabled={isPending}
            className="rounded-full bg-accentBG py-4 text-lg hover:bg-white/5 transition disabled:opacity-40"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBudgetOverlay;
