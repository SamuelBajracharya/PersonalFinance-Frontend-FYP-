"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Select } from "antd";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FaEyeSlash, FaRedoAlt } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import StatCard from "@/components/gloabalComponents/StatCards";
import LoadingOverlay from "@/components/gloabalComponents/LoadingOverlay";
import SkeletonBlock from "@/components/gloabalComponents/SkeletonBlock";

import { Transaction } from "@/api/transactionAPI";
import { useBankOverlay } from "@/stores/useBankOverlay";
import LinkAccountOverlay from "@/components/gloabalComponents/LinkAccountOverlay";
import {
  useNabilBankAccount,
  useNabilBankTransactions,
} from "@/hooks/useBankTransaction";

const Transactions: React.FC = () => {
  const { isOpen, isBankLinked, isInitialized, open, initialize } = useBankOverlay();

  // Year and category selectors
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Initialize persisted state once
  useEffect(() => {
    initialize();
  }, [initialize]);

  const {
    data: account,
    isLoading: accountLoading,
    isFetching: accountFetching,
    isError,
  } = useNabilBankAccount(isBankLinked);

  const {
    data: transactions,
    isLoading: transactionLoading,
    isFetching: transactionFetching,
  } = useNabilBankTransactions(isBankLinked);

  // Extract unique years and categories from transactions
  const years = useMemo(() => {
    if (!transactions) return [];
    const yearSet = new Set(transactions.map(t => new Date(t.date).getFullYear()));
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [transactions]);

  const categories = useMemo(() => {
    if (!transactions) return [];
    const catSet = new Set(transactions.map(t => t.category).filter(Boolean));
    return Array.from(catSet);
  }, [transactions]);

  // Filter transactions by year, category, and search
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter(t => {
      const matchYear = selectedYear === "all" || new Date(t.date).getFullYear().toString() === selectedYear;
      const matchCategory = selectedCategory === "all" || t.category === selectedCategory;
      const matchSearch =
        !searchTerm ||
        (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (t.merchant && t.merchant.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (t.category && t.category.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchYear && matchCategory && matchSearch;
    });
  }, [transactions, selectedYear, selectedCategory, searchTerm]);

  const showLoadingOverlay =
    !isInitialized ||
    (isBankLinked &&
      (accountLoading || transactionLoading || accountFetching || transactionFetching));

  const showInitialSkeletons =
    showLoadingOverlay &&
    !isError &&
    (!account || !transactions);

  const columns: ColumnsType<Transaction> = [
    {
      title: "Name",
      dataIndex: "description",
      key: "name",
      render: (_: string, record: Transaction) => {
        // Build image src from category
        const category = record.category || "default";
        // Use lowercase category with 'Category' suffix for file path
        const categoryFile = `/${category ? category.toLowerCase() + 'Category' : 'defaultCategory'}.png`;
        return (
          <div className="flex items-center gap-3">
            <img
              src={categoryFile}
              alt={category}
              className="rounded-xl size-11 object-cover bg-accent"
              onError={e => { e.currentTarget.src = "/notfound.png"; }}
            />
            <span className="text-textmain">{record.description}</span>
          </div>
        );
      },
    },
    {
      title: "From/To",
      dataIndex: "merchant",
      key: "merchant",
      render: (text) => <span className="text-textsecondary">{text}</span>,
    },
    {
      title: "Transaction",
      dataIndex: "type",
      key: "transaction_type",
      render: (text: Transaction["type"]) => (
        <span
          className={`${text === "DEBIT" ? "text-red-500" : "text-green-500"
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
          className={`${record.type === "DEBIT" ? "text-red-500" : "text-green-500"
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
        <span className="text-textsecondary">{new Date(text).toLocaleString()}</span>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text) => <span className="text-textsecondary">{text}</span>,
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

  return (
    <div className="min-h-screen px-6 py-6 font-sans relative">


      <div className="flex w-full gap-6 mb-6">
        {showInitialSkeletons ? (
          <div className="bg-gradient-to-br from-[var(--color-bankCardFrom)] to-[var(--color-bankCardTo)] rounded-2xl p-6 flex flex-col flex-grow justify-between animate-pulse">
            <div>
              <SkeletonBlock className="h-7 w-52 mb-3" />
              <SkeletonBlock className="h-6 w-64" />
            </div>

            <div className="flex justify-between items-center mt-5">
              <div className="flex gap-2 items-center">
                <SkeletonBlock className="h-6 w-18" />
                <SkeletonBlock className="h-6 w-28" />
              </div>
              <SkeletonBlock className="size-12 rounded-full" />
            </div>
          </div>
        ) : !isInitialized ? (
          <div className="flex-grow bg-gradient-to-br from-[var(--color-bankCardFrom)] to-[var(--color-bankCardTo)] rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <p className="text-primary text-3xl font-semibold mb-2">
                Account Status
              </p>
              <p className="text-gray-300 text-lg max-w-md">
                Checking linked account information...
              </p>
            </div>
            <div className="flex justify-end">
              <button
                disabled
                className="border border-accent/50 text-accent/60 px-12 py-3 rounded-full text-lg cursor-not-allowed"
              >
                Link Account
              </button>
            </div>
          </div>
        ) : !isBankLinked ? (
          <div className="flex-grow bg-gradient-to-br from-[var(--color-bankCardFrom)] to-[var(--color-bankCardTo)] rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <p className="text-primary text-3xl font-semibold mb-2">
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
          <div className="bg-gradient-to-br from-[var(--color-bankCardFrom)] to-[var(--color-bankCardTo)] rounded-2xl p-6 flex flex-col flex-grow justify-between">
            <div>
              <p className="text-textsecondary text-2xl tracking-widest mb-1">
                {account?.account_number_masked}
              </p>
              <p className="text-textmain font-semibold text-xl">
                {account?.bank_name} ({account?.account_type})
              </p>
            </div>

            <div className="flex justify-between items-center mt-5">
              <div className="flex gap-2">
                <p className="text-textsecondary text-xl">Balance:</p>
                <p className="text-primary text-xl flex items-center gap-2">
                  Rs. {Number(account?.balance).toFixed(2)}
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
          {showInitialSkeletons ? (
            <>
              <div className="flex gap-6 animate-pulse">
                <SkeletonBlock className="rounded-2xl h-[144px] flex-1" />
                <SkeletonBlock className="rounded-2xl h-[144px] flex-1" />
              </div>
              <SkeletonBlock className="h-[52px] rounded-full" />
            </>
          ) : (
            <>
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

              <button className="bg-primary hover:bg-primary transition font-medium text-lg py-3 rounded-full flex items-center justify-center gap-2 !text-white">
                <AiOutlinePlus /> Create New Transaction
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-secondaryBG rounded-2xl p-6">
        {/* Filters above the table */}
        <div className="flex flex-col gap-8 bg-transparent rounded-xl px-4 pt-3 justify-between">
          <div className="flex flex-row justify-between items-center">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4">
                <span className="font-medium text-xl !text-primary">Year:</span>
                <Select
                  value={selectedYear}
                  onChange={v => setSelectedYear(v)}
                  className="custom-select"
                  popupClassName="custom-select"
                  style={{ minWidth: 120, borderColor: '#ffaa2d' }}
                >
                  <Select.Option value="all">All</Select.Option>
                  {years.map(y => (
                    <Select.Option key={y} value={y.toString()}>{y}</Select.Option>
                  ))}
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-xl !text-primary">Category:</span>
                <Select
                  value={selectedCategory}
                  onChange={v => setSelectedCategory(v)}
                  className="custom-select"
                  popupClassName="custom-select"
                  style={{ minWidth: 120, borderColor: '#ffaa2d' }}
                >
                  <Select.Option value="all">All</Select.Option>
                  {categories.map(c => (
                    <Select.Option key={c as string} value={c as string}>{c}</Select.Option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="flex items-center ml-auto">
              <input
                type="text"
                placeholder="Search..."
                className="rounded-full w-[400px] text-lg px-6 py-2 bg-tableBG text-textmain focus:outline-none focus:ring-2 focus:ring-primary"
                style={{ minWidth: 180 }}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {isBankLinked && isError && !account && (
            <div className="mb-4 text-red-500">Failed to load account data.</div>
          )}
          {showInitialSkeletons ? (
            <div className="animate-pulse">
              <SkeletonBlock className="h-[56px] rounded-t-xl mb-[1px]" />
              <div className="space-y-[1px]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonBlock key={index} className="h-[64px]" />
                ))}
              </div>
              <SkeletonBlock className="h-10 mt-4 rounded-lg" />
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={
                isBankLinked ? filteredTransactions.map((t) => ({ key: t.id, ...t })) : []
              }
              pagination={{ pageSize: 5, showSizeChanger: false }}
              className="custom-table"
            />
          )}
        </div>

        <LoadingOverlay show={showLoadingOverlay} />

        {isOpen && <LinkAccountOverlay />}
      </div>
    </div>
  );
};

export default Transactions;
