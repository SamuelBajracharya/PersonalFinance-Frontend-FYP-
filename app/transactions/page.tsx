"use client";

import React, { useEffect } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FaEyeSlash, FaRedoAlt } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import StatCard from "@/components/gloabalComponents/StatCards";

import { Transaction } from "@/api/transactionAPI";
import { useBankOverlay } from "@/stores/useBankOverlay";
import LinkAccountOverlay from "@/components/gloabalComponents/LinkAccountOverlay";
import {
  useNabilBankAccount,
  useNabilBankTransactions,
} from "@/hooks/useBankTransaction";

const Transactions: React.FC = () => {
  const { isOpen, isBankLinked, open, initialize } = useBankOverlay();

  // Initialize persisted state once
  useEffect(() => {
    initialize();
  }, [initialize]);

  const {
    data: account,
    isLoading: accountLoading,
    isError,
  } = useNabilBankAccount(isBankLinked);

  const { data: transactions, isLoading: transactionLoading } =
    useNabilBankTransactions(isBankLinked);

  const columns: ColumnsType<Transaction> = [
    {
      title: "Name",
      dataIndex: "description",
      key: "name",
      render: (text: string) => (
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full size-10 flex items-center justify-center text-white font-bold shadow-md">
            T
          </div>
          <span className="text-gray-200">{text}</span>
        </div>
      ),
    },
    {
      title: "From/To",
      dataIndex: "merchant",
      key: "merchant",
      render: (text) => <span className="text-gray-300">{text}</span>,
    },
    {
      title: "Transaction",
      dataIndex: "type",
      key: "transaction_type",
      render: (text: Transaction["type"]) => (
        <span
          className={`${
            text === "DEBIT" ? "text-red-500" : "text-green-500"
          } font-medium`}
        >
          {text === "DEBIT" ? "Expense" : "Income"}
        </span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text, record) => (
        <span
          className={`${
            record.type === "DEBIT" ? "text-red-500" : "text-green-500"
          } font-medium`}
        >
          Rs.{Number(text).toFixed(2)}
        </span>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      key: "date",
      render: (text) => (
        <span className="text-gray-300">{new Date(text).toLocaleString()}</span>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text) => <span className="text-gray-300">{text}</span>,
    },
  ];

  const expenseTotal = isBankLinked
    ? (transactions
        ?.filter((t) => t.type === "DEBIT")
        .reduce((sum, t) => sum + Number(t.amount), 0) ?? 0)
    : 0;

  const incomeTotal = isBankLinked
    ? (transactions
        ?.filter((t) => t.type === "CREDIT")
        .reduce((sum, t) => sum + Number(t.amount), 0) ?? 0)
    : 0;

  if (isBankLinked && (accountLoading || transactionLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading account details...
      </div>
    );
  }

  if (isBankLinked && (isError || !account)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load account data.
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-6 font-sans">
      <div className="flex w-full gap-6 mb-6">
        {!isBankLinked ? (
          <div className="flex-grow bg-gradient-to-br from-[#1c1c1c] to-[#3a3a3a] rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <p className="text-[#f39c12] text-3xl font-semibold mb-2">
                Link Account
              </p>
              <p className="text-gray-300 text-lg max-w-md">
                For a smoother experience, please link your bank account.
              </p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={open}
                className="border border-accent text-accent px-12 py-3 rounded-full text-lg hover:bg-accent hover:text-white transition cursor-pointer"
              >
                Link Account
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#161616] to-[#414040] rounded-2xl p-6 flex flex-col flex-grow justify-between">
            <div>
              <p className="text-[#d1d0d0] text-2xl tracking-widest mb-1">
                {account?.account_number_masked}
              </p>
              <p className="text-primary font-semibold text-xl">
                {account?.bank_name} ({account?.account_type})
              </p>
            </div>

            <div className="flex justify-between items-center mt-5">
              <div className="flex gap-2">
                <p className="text-[#d1d0d0] text-xl">Balance:</p>
                <p className="text-primary text-xl flex items-center gap-2">
                  ${Number(account?.balance).toFixed(2)}
                  <FaEyeSlash />
                </p>
              </div>
              <div className="bg-primary p-3 rounded-full cursor-pointer">
                <FaRedoAlt className="text-white text-2xl animate-spin" />
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col flex-grow gap-6">
          <div className="flex gap-6">
            <StatCard
              type="expense"
              value={expenseTotal}
              disabled={!isBankLinked}
            />
            <StatCard
              type="income"
              value={incomeTotal}
              disabled={!isBankLinked}
            />
          </div>

          <button className="bg-[#f39c12] hover:bg-[#e68a00] transition font-medium text-lg py-3 rounded-full flex items-center justify-center gap-2">
            <AiOutlinePlus /> Create New Transaction
          </button>
        </div>
      </div>

      <div className="bg-secondaryBG rounded-2xl p-6">
        <Table
          columns={columns}
          dataSource={
            isBankLinked ? transactions?.map((t) => ({ key: t.id, ...t })) : []
          }
          pagination={{ pageSize: 5, showSizeChanger: false }}
          className="custom-table"
        />
      </div>

      {isOpen && <LinkAccountOverlay />}
    </div>
  );
};

export default Transactions;
