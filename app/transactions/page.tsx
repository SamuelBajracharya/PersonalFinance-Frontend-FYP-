"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Select, Table, Tour, Pagination } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FaEye, FaEyeSlash, FaRedoAlt } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import StatCard from "@/components/gloabalComponents/StatCards";
import LoadingOverlay from "@/components/gloabalComponents/LoadingOverlay";
import SkeletonBlock from "@/components/gloabalComponents/SkeletonBlock";

import { Transaction } from "@/api/transactionAPI";
import { useBankOverlay } from "@/stores/useBankOverlay";
import LinkAccountOverlay from "@/components/gloabalComponents/LinkAccountOverlay";
import ManualTransactionCreateOverlay from "@/components/gloabalComponents/ManualTransactionCreateOverlay";
import { useCreateManualTransactionsOverlay } from "@/stores/useCreateManualTransactionsOverlay";

import {
  usePrimaryBankAccount,
  useBankTransactions,
} from "@/hooks/useBankTransaction";
import { useBankSync } from "@/hooks/useBankSync";
import { useAntdMessage } from "@/components/gloabalComponents/AntdMessageContext";
import { useTourStore } from "@/stores/useTour";
import { useResponsive } from "@/hooks/useResponsive";
import { useCurrentUser } from "@/hooks/useAuth";

const Transactions: React.FC = () => {
  const { isMobile } = useResponsive();
  const { data: user } = useCurrentUser();
  const [showBalance, setShowBalance] = useState(false);

  const { isOpen, isBankLinked, isInitialized, open, initialize } = useBankOverlay();
  const {
    isTransactionsLinkTour,
    isTransactionsFeatureTour,
    initialize: initializeTour,
    setTransactionsLinkTour,
    setTransactionsFeatureTour,
  } = useTourStore();

  const bankCardRef = useRef<HTMLDivElement>(null);
  const createTransactionRef = useRef<HTMLButtonElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  // Year and category selectors
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Initialize persisted state once
  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    initializeTour();
  }, [initializeTour]);

  useEffect(() => {
    if (isInitialized && isBankLinked && isTransactionsLinkTour) {
      setTransactionsLinkTour(false);
    }
  }, [
    isInitialized,
    isBankLinked,
    isTransactionsLinkTour,
    setTransactionsLinkTour,
  ]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedYear, selectedCategory, searchTerm]);

  const {
    data: account,
    isLoading: accountLoading,
    isFetching: accountFetching,
    isError,
  } = usePrimaryBankAccount(isBankLinked);

  const {
    data: transactions,
    isLoading: transactionLoading,
    isFetching: transactionFetching,
  } = useBankTransactions(isBankLinked);

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

  // Paginate transactions for mobile view
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(startIndex, startIndex + pageSize);
  }, [filteredTransactions, currentPage, pageSize]);

  const showLoadingOverlay =
    !isInitialized ||
    (isBankLinked &&
      (accountLoading || transactionLoading || accountFetching || transactionFetching));

  const showInitialSkeletons =
    showLoadingOverlay &&
    !isError &&
    (!account || !transactions);

  const shouldOpenLinkTour =
    isInitialized && isTransactionsLinkTour && !isBankLinked && !isOpen;
  const shouldOpenFeatureTour =
    isTransactionsFeatureTour && isBankLinked && !showInitialSkeletons;

  const resolveTarget = (element: HTMLElement | null): HTMLElement =>
    element ?? document.body;

  const mandatoryLinkStep = [
    {
      title: "Link Your Bank Account (Required)",
      description:
        "Before using transactions features, you must link your bank account from this card.",
      target: () => resolveTarget(bankCardRef.current),
    },
  ];

  const transactionsFeatureSteps = [
    {
      title: "Create New Transaction",
      description:
        "Use this button to add a manual transaction to your records.",
      target: () => resolveTarget(createTransactionRef.current),
    },
    {
      title: "Table Filters",
      description:
        "Filter transactions by year, category, and search terms to find entries quickly.",
      target: () => resolveTarget(filtersRef.current),
    },
    {
      title: "Transaction Table",
      description:
        "Review your transactions with details like merchant, amount, date, type, and category.",
      target: () => resolveTarget(tableRef.current),
    },
  ];

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

  const messageApi = useAntdMessage();
  const bankSync = useBankSync();
  const { openCreateManualTransactions, createManualTransactions } = useCreateManualTransactionsOverlay();

  // MOBILE RENDER PATH
  if (isMobile) {
    if (showInitialSkeletons) {
      return (
        <div suppressHydrationWarning className="px-4 py-4 font-sans flex flex-col gap-5 animate-pulse">
          {/* Card Skeleton */}
          <div className="bg-gradient-to-br from-[#2a2a2a] to-[#141414] rounded-3xl p-6 h-48 flex flex-col justify-between">
            <div>
              <SkeletonBlock className="h-7 w-48 mb-3" />
              <SkeletonBlock className="h-6 w-32" />
            </div>
            <div className="flex justify-between items-center mt-4">
              <SkeletonBlock className="h-6 w-36" />
              <SkeletonBlock className="size-10 rounded-full" />
            </div>
          </div>

          {/* Stats Skeleton */}
          <div className="flex gap-4">
            <SkeletonBlock className="h-20 rounded-2xl flex-1" />
            <SkeletonBlock className="h-20 rounded-2xl flex-1" />
          </div>

          {/* Button Skeleton */}
          <SkeletonBlock className="h-14 rounded-full w-full" />

          {/* List Skeleton */}
          <div className="flex justify-between items-center mt-4">
            <SkeletonBlock className="h-7 w-32" />
            <SkeletonBlock className="h-5 w-24" />
          </div>

          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-[#1d1d1d] rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4 w-2/3">
                  <SkeletonBlock className="size-12 rounded-2xl" />
                  <div className="flex flex-col gap-2 w-full">
                    <SkeletonBlock className="h-4 w-1/2" />
                    <SkeletonBlock className="h-3 w-1/3" />
                  </div>
                </div>
                <SkeletonBlock className="h-6 w-20" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div suppressHydrationWarning className="px-4 py-4 font-sans flex flex-col gap-5 pb-10">
        {/* Mobile Bank Card */}
        {!isInitialized ? (
          <div className="bg-[#1d1d1d] border border-white/5 rounded-3xl p-6 flex flex-col justify-between h-48">
            <p className="text-primary text-xl font-semibold">Account Status</p>
            <p className="text-gray-400 text-sm">Checking linked account information...</p>
          </div>
        ) : !isBankLinked ? (
          <div className="bg-[#1d1d1d] border border-white/5 rounded-3xl p-6 flex flex-col justify-between h-48">
            <div>
              <p className="text-primary text-xl font-semibold mb-1">Link Account</p>
              <p className="text-gray-400 text-sm">Link your bank account to start tracking your finances.</p>
            </div>
            <button
              onClick={open}
              className="border border-accent text-accent px-6 py-2.5 rounded-full text-base font-semibold hover:bg-accent hover:text-white transition w-full"
            >
              Link Account
            </button>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#2a2a2a] to-[#141414] border border-white/5 rounded-3xl p-6 flex flex-col justify-between h-48 relative overflow-hidden shadow-2xl">
            <div>
              <div className="text-textmain text-2xl tracking-widest font-mono mb-1">
                {account?.account_number_masked || "XXXX XXXX 1234"}
              </div>
              <div className="text-[#ffaa2d] font-semibold text-lg">
                {user?.name || "Samuel Bajracharya"}
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-2 items-center">
                <span className="text-textsecondary text-lg">Balance:</span>
                <span
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-textmain text-lg font-medium flex items-center gap-2 cursor-pointer"
                >
                  {showBalance
                    ? `Rs. ${Number(account?.balance ?? 0).toFixed(2)}`
                    : "XX.XX"}
                  {showBalance ? <FaEye className="text-textsecondary" /> : <FaEyeSlash className="text-textsecondary" />}
                </span>
              </div>
              <button
                onClick={() => {
                  bankSync.mutate(undefined, {
                    onSuccess: (data) => {
                      messageApi.success(data.message || "Bank synced successfully");
                    },
                    onError: () => {
                      messageApi.error("Failed to sync bank account");
                    },
                  });
                }}
                disabled={bankSync.isPending}
                className="bg-[#ffaa2d] text-black size-10 rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition"
              >
                <FaRedoAlt className={`text-white text-lg ${bankSync.isPending ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
        )}

        {/* Compact Stats */}
        <div className="flex gap-4">
          <div className="flex-1 bg-[#1d1d1d] border border-white/5 rounded-2xl p-4 flex items-center gap-3">
            <div className="bg-[#df4c4d] p-2.5 rounded-xl flex items-center justify-center">
              <img src="/expense.svg" alt="Expenses" className="size-5 invert" onError={e => { e.currentTarget.src = "/notfound.png"; }} />
            </div>
            <div>
              <p className="text-textmain font-semibold text-base">Expenses</p>
              <p className="text-[#df4c4d] font-semibold text-sm mt-0.5">Rs.{Number(expenseTotal).toFixed(2)}</p>
            </div>
          </div>

          <div className="flex-1 bg-[#1d1d1d] border border-white/5 rounded-2xl p-4 flex items-center gap-3">
            <div className="bg-[#00c782] p-2.5 rounded-xl flex items-center justify-center">
              <img src="/income.svg" alt="Incomes" className="size-5 invert" onError={e => { e.currentTarget.src = "/notfound.png"; }} />
            </div>
            <div>
              <p className="text-textmain font-semibold text-base">Incomes</p>
              <p className="text-[#00c782] font-semibold text-sm mt-0.5">Rs.{Number(incomeTotal).toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Create New Transaction Button */}
        <button
          onClick={openCreateManualTransactions}
          className="bg-[#ffaa2d] hover:bg-[#ffb74d] text-white font-bold text-lg py-3.5 rounded-full flex items-center justify-center gap-2 transition duration-200 shadow-md cursor-pointer w-full mt-2"
        >
          <AiOutlinePlus className="text-xl stroke-[3]" /> Create New Transaction
        </button>

        {/* Header & List of Transactions */}
        <div className="flex justify-between items-center mt-4 mb-2">
          <h2 className="text-2xl font-bold text-textmain">Transactions</h2>
          <a href="/analytics" className="text-[#ffaa2d] hover:text-[#ffb74d] transition text-sm font-medium underline">
            view analytics
          </a>
        </div>

        <div className="flex flex-col gap-3">
          {isBankLinked && paginatedTransactions.length > 0 ? (
            paginatedTransactions.map((t) => {
              const category = t.category || "default";
              const categoryFile = `/${category ? category.toLowerCase() + 'Category' : 'defaultCategory'}.png`;
              const isDebit = t.type === "DEBIT";
              return (
                <div
                  key={t.id}
                  className="bg-[#1d1d1d] border border-white/5 rounded-2xl p-4 flex items-center justify-between transition hover:bg-[#242424]"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-accent/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img
                        src={categoryFile}
                        alt={category}
                        className="size-8 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/notfound.png";
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-textmain font-semibold text-base line-clamp-1">
                        {t.description || "Transaction"}
                      </p>
                      <p className="text-textsecondary text-sm mt-0.5 line-clamp-1">
                        {t.merchant || "Receiver or sender"}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`font-semibold text-lg flex-shrink-0 ${
                      isDebit ? "text-[#df4c4d]" : "text-[#00c782]"
                    }`}
                  >
                    {isDebit ? "-" : "+"} Rs.{Number(t.amount).toFixed(2)}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-textsecondary text-base">
              No transactions found.
            </div>
          )}
        </div>

        {/* Ant Pagination for Mobile */}
        {isBankLinked && filteredTransactions.length > pageSize && (
          <div className="custom-table flex justify-center mt-3">
            <Pagination
              current={currentPage}
              onChange={(page) => setCurrentPage(page)}
              total={filteredTransactions.length}
              pageSize={pageSize}
              showSizeChanger={false}
              size="small"
            />
          </div>
        )}

        {isOpen && <LinkAccountOverlay />}
        {createManualTransactions && <ManualTransactionCreateOverlay />}
      </div>
    );
  }

  // DESKTOP RENDER PATH
  return (
    <div suppressHydrationWarning className="min-h-screen px-6 py-6 font-sans relative">

      <div className="flex w-full gap-6 mb-6">
        {showInitialSkeletons ? (
          <div ref={bankCardRef} className="bg-gradient-to-br from-[var(--color-bankCardFrom)] to-[var(--color-bankCardTo)] rounded-2xl p-6 flex flex-col flex-grow justify-between animate-pulse">
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
          <div ref={bankCardRef} className="flex-grow bg-gradient-to-br from-[var(--color-bankCardFrom)] to-[var(--color-bankCardTo)] rounded-2xl p-6 flex flex-col justify-between">
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
          <div ref={bankCardRef} className="flex-grow bg-gradient-to-br from-[var(--color-bankCardFrom)] to-[var(--color-bankCardTo)] rounded-2xl p-6 flex flex-col justify-between">
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
          <div ref={bankCardRef} className="bg-gradient-to-br from-[var(--color-bankCardFrom)] to-[var(--color-bankCardTo)] rounded-2xl p-6 flex flex-col flex-grow justify-between">
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
                <div className="text-primary text-xl flex items-center gap-2 cursor-pointer" onClick={() => setShowBalance(!showBalance)}>
                  Rs. {showBalance ? Number(account?.balance).toFixed(2) : "XX.XX"}
                  {showBalance ? <FaEye /> : <FaEyeSlash />}
                </div>
              </div>
              <button
                className="bg-primary p-3 rounded-full cursor-pointer flex items-center justify-center"
                onClick={() => {
                  bankSync.mutate(undefined, {
                    onSuccess: (data) => {
                      messageApi.success(data.message || "Bank synced successfully");
                    },
                    onError: () => {
                      messageApi.error("Failed to sync bank account");
                    },
                  });
                }}
                disabled={bankSync.isPending}
                title="Sync Bank Account"
                type="button"
              >
                <FaRedoAlt className={`text-white text-2xl transition ${bankSync.isPending ? "animate-spin" : ""}`} />
              </button>
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

              <button
                ref={createTransactionRef}
                className="bg-primary hover:bg-primary transition font-medium text-lg py-3 rounded-full flex items-center justify-center gap-2 !text-white cursor-pointer"
                onClick={openCreateManualTransactions}
              >
                <AiOutlinePlus /> Create New Transaction
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-secondaryBG rounded-2xl p-6">
        {/* Filters above the table */}
        <div ref={filtersRef} className="flex flex-col gap-8 bg-transparent rounded-xl px-4 pt-3 justify-between">
          <div className="flex flex-row justify-between items-center">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4">
                <span className="font-medium text-xl !text-primary">Year:</span>
                <Select
                  value={selectedYear}
                  onChange={v => setSelectedYear(v)}
                  className="custom-select"
                  classNames={{ popup: { root: "custom-select" } }}
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
                  classNames={{ popup: { root: "custom-select" } }}
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
            <div ref={tableRef}>
              <Table
                columns={columns}
                dataSource={
                  isBankLinked ? filteredTransactions.map((t) => ({ key: t.id, ...t })) : []
                }
                pagination={{ pageSize: 5, showSizeChanger: false }}
                className="custom-table"
              />
            </div>
          )}
        </div>

        <LoadingOverlay show={showLoadingOverlay} />

        <Tour
          open={shouldOpenLinkTour}
          onClose={() => {
            open();
          }}
          onFinish={() => {
            if (!isBankLinked) {
              open();
              return;
            }
            setTransactionsLinkTour(false);
          }}
          steps={mandatoryLinkStep}
          closable={false}
          zIndex={2147483645}
          rootClassName="!z-[2147483645]"
        />

        <Tour
          open={shouldOpenFeatureTour}
          onClose={() => setTransactionsFeatureTour(false)}
          onFinish={() => setTransactionsFeatureTour(false)}
          steps={transactionsFeatureSteps}
          zIndex={2147483645}
          rootClassName="!z-[2147483645]"
        />

        {isOpen && <LinkAccountOverlay />}
        {createManualTransactions && <ManualTransactionCreateOverlay />}
      </div>
    </div>
  );
};

export default Transactions;

