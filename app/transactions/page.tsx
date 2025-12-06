"use client";

import React from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FaEyeSlash, FaRedoAlt } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import StatCard from "@/components/gloabalComponents/StatCards";
import {
  useAccountTransactions,
  useBankAccount,
} from "@/hooks/useBankTransaction";
import { Transaction } from "@/api/transactionAPI";

const Transactions: React.FC = () => {
  const accountId = "9da523ad-769c-4095-b376-2db6b3cf2441";

  const {
    data: account,
    isLoading: accountLoading,
    isError,
  } = useBankAccount(accountId);
  console.log("Account Data:", account);

  const { data: transactions, isLoading: transactionLoading } =
    useAccountTransactions(accountId);
  console.log("Transactions Data:", transactions);

  const columns: ColumnsType<Transaction> = [
    {
      title: "Name",
      dataIndex: "description",
      key: "name",
      render: (text: string) => (
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full size-10 flex items-center justify-center text-white font-bold shadow-md">
            💸
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

  if (accountLoading || transactionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Loading account details...</p>
      </div>
    );
  }

  if (isError || !account) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load account data.
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-6 font-sans">
      <div className="flex w-full gap-6 mb-6">
        {/* Account Card */}
        <div className="bg-gradient-to-br from-[#161616] to-[#414040] rounded-2xl p-6 flex flex-col flex-grow-1 justify-between">
          <div>
            <p className="text-[#d1d0d0] text-2xl tracking-widest mb-1">
              {account.account_number_masked}
            </p>
            <p className="text-primary font-semibold text-xl">
              {account.bank_name} ({account.account_type})
            </p>
          </div>

          <div className="flex justify-between items-center mt-5">
            <div className="flex gap-2">
              <p className="text-[#d1d0d0] text-xl">Balance:</p>
              <p className="text-primary text-xl flex items-center gap-2">
                ${Number(account.balance || 0).toFixed(2)}
                <FaEyeSlash />
              </p>
            </div>

            {/* SYNC BUTTON */}
            <div className="bg-primary p-3 rounded-full cursor-pointer hover:bg-primary/80 transition">
              <div className="animate-spin text-white text-2xl">
                <FaRedoAlt />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-grow gap-6">
          <div className="flex gap-6">
            <StatCard
              type="expense"
              value={
                transactions
                  ?.filter((t) => t.type === "DEBIT")
                  .reduce((sum, t) => sum + Number(t.amount), 0) ?? 0
              }
            />

            <StatCard
              type="income"
              value={
                transactions
                  ?.filter((t) => t.type === "CREDIT")
                  .reduce((sum, t) => sum + Number(t.amount), 0) ?? 0
              }
            />
          </div>

          <button className="bg-[#f39c12] hover:bg-[#e68a00] flex-grow transition font-medium text-lg py-3 px-0 rounded-full flex items-center justify-center gap-2">
            <AiOutlinePlus /> Create New Transaction
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-secondaryBG rounded-2xl p-6">
        <Table
          columns={columns}
          dataSource={transactions?.map((t) => ({
            key: t.id,
            ...t,
          }))}
          pagination={{
            pageSize: 5,
            total: transactions?.length ?? 0,
            showSizeChanger: false,
          }}
          className="custom-table"
        />
      </div>
    </div>
  );
};

export default Transactions;
