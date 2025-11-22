"use client";

import React from "react";
import { FaBalanceScale } from "react-icons/fa";
import Image from "next/image";

type StatType = "expense" | "income" | "balance";

interface StatCardProps {
  type: StatType;
  value: number;
}

export default function StatCard({ type, value }: StatCardProps) {
  const config = {
    expense: {
      label: "Expenses",
      color: "text-red-500",
      bg: "bg-red-500",
      icon: (
        <Image
          src="/expense.svg"
          alt="Expense Icon"
          width={24}
          height={24}
          className="size-8"
        />
      ),
      prefix: "Rs.",
    },
    income: {
      label: "Incomes",
      color: "text-green-500",
      bg: "bg-green-500",
      icon: (
        <Image
          src="/income.svg"
          alt="Expense Icon"
          width={24}
          height={24}
          className="size-8"
        />
      ),
      prefix: "Rs.",
    },
    balance: {
      label: "Balance",
      color: "text-blue-500",
      bg: "bg-blue-600",
      icon: <FaBalanceScale className="text-2xl" />,
      prefix: "$",
    },
  }[type];

  return (
    <div className="bg-secondaryBG rounded-2xl flex flex-grow items-center justify-between px-6 py-8">
      <div className="flex flex-col gap-4">
        {/* Icon + label */}
        <div className="flex items-center gap-4">
          <div className={`${config.bg} rounded-2xl p-2`}>{config.icon}</div>
          <p className="text-2xl font-medium">{config.label}</p>
        </div>

        {/* Value */}
        <p className={`${config.color} text-xl tracking-wide`}>
          {config.prefix}
          {value.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
