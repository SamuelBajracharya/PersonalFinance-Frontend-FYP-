"use client";

import React, { useState } from "react";
import { useCreateManualTransactionsOverlay } from "@/stores/useCreateManualTransactionsOverlay";
import { Select, Input, DatePicker } from "antd";
import dayjs from "dayjs";
import { useThemeStore } from "@/stores/useThemeStore";
import { TRANSACTION_CATEGORIES } from "@/types/transactionCategories";
import { useAntdMessage } from "@/components/gloabalComponents/AntdMessageContext";
import { useCreateTransaction, usePrimaryBankAccount } from "@/hooks/useBankTransaction";

const ManualTransactionCreateOverlay: React.FC = () => {
    const { theme } = useThemeStore();
    const {
        createManualTransactions,
        closeCreateManualTransactions,
    } = useCreateManualTransactionsOverlay();
    const messageApi = useAntdMessage();
    const { data: account } = usePrimaryBankAccount(createManualTransactions);
    const { mutate, isPending } = useCreateTransaction();

    const [category, setCategory] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [date, setDate] = useState<any>(null);
    const [description, setDescription] = useState<string>("");
    const [merchant, setMerchant] = useState<string>("");
    const [type, setType] = useState<"DEBIT" | "CREDIT">("DEBIT");
    const [currency, setCurrency] = useState<string>("NPR");

    if (!createManualTransactions) return null;

    const canSubmit = Boolean(
        account?.id &&
        category &&
        amount &&
        date &&
        description &&
        merchant &&
        type &&
        currency
    );

    const handleClose = () => {
        if (isPending) return;
        setCategory("");
        setAmount("");
        setDate(null);
        setDescription("");
        setMerchant("");
        setType("DEBIT");
        setCurrency("NPR");
        closeCreateManualTransactions();
    };

    const handleSubmit = () => {
        if (!account?.id || !canSubmit) return;

        mutate(
            {
                source: "MANUAL",
                date: dayjs(date).toISOString(),
                amount: Number(amount),
                currency: currency.trim() || "NPR",
                type,
                status: "POSTED",
                description: description.trim(),
                merchant: merchant.trim(),
                category,
                account_id: account.id,
            },
            {
                onSuccess: () => {
                    messageApi.success("Transaction added successfully!");
                    setTimeout(() => {
                        handleClose();
                    }, 500);
                },
                onError: () => {
                    messageApi.error("Failed to add transaction. Try again.");
                },
            }
        );
    };

    return (
        <div
            className={`fixed inset-0 !z-[2147483645] flex items-center justify-center bg-mainBG/60 backdrop-blur-[1px]`}
            style={{ zIndex: 1200 }}
            data-theme={theme}
        >
            <div
                className="rounded-3xl p-6 w-full max-w-2xl mx-4 flex flex-col gap-5 shadow-2xl relative bg-secondaryBG max-h-[85vh] overflow-hidden"
            >
                <h2 className="text-3xl font-bold text-primary mb-2">Add Transaction</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-auto pr-1">
                    <div className="flex flex-col gap-3">
                        <label className="text-lg font-medium !text-textmain">Description</label>
                        <Input
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Cash purchase"
                            className="w-full !rounded-xl !border-none !bg-tableBG !px-5 !py-3 !text-lg !text-textmain focus:!outline-none focus:!ring-1 focus:!ring-primary placeholder:!text-textsecondary"
                            size="large"
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="text-lg font-medium !text-textmain">Merchant</label>
                        <Input
                            value={merchant}
                            onChange={e => setMerchant(e.target.value)}
                            placeholder="Local Store"
                            className="w-full !rounded-xl !border-none !bg-tableBG !px-5 !py-3 !text-lg !text-textmain focus:!outline-none focus:!ring-1 focus:!ring-primary placeholder:!text-textsecondary"
                            size="large"
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="text-lg font-medium !text-textmain">Categories</label>
                        <Select
                            value={category}
                            onChange={setCategory}
                            placeholder="Select category"
                            className="custom-select w-full rounded-xl"
                            size="large"
                            options={TRANSACTION_CATEGORIES.map((cat) => ({ label: cat, value: cat }))}
                            classNames={{ popup: { root: "custom-select" } }}
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="text-lg font-medium text-textmain">Amount</label>
                        <Input
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            placeholder="Rs5000"
                            className="w-full !rounded-xl !border-none !bg-tableBG !px-5 !py-3 !text-lg !text-textmain focus:!outline-none focus:!ring-1 focus:!ring-primary placeholder:!text-textsecondary"
                            size="large"
                            type="number"
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="text-lg font-medium !text-textmain">Type</label>
                        <Select
                            value={type}
                            onChange={(value) => setType(value)}
                            placeholder="Select type"
                            className="custom-select w-full rounded-xl"
                            size="large"
                            options={[
                                { label: "Expense (DEBIT)", value: "DEBIT" },
                                { label: "Income (CREDIT)", value: "CREDIT" },
                            ]}
                            classNames={{ popup: { root: "custom-select" } }}
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="text-lg font-medium text-textmain">Date</label>
                        <DatePicker
                            value={date}
                            onChange={setDate}
                            className="w-full !rounded-xl !border-none !bg-tableBG !px-5 !py-3 !text-lg !text-textmain focus:!outline-none focus:!ring-1 focus:!ring-primary placeholder:!text-textsecondary"
                            size="large"
                            format="MM/DD/YYYY"
                            style={{ width: "100%" }}
                            classNames={{ popup: { root: "custom-select" } }}
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="text-lg font-medium text-textmain">Currency</label>
                        <Input
                            value={currency}
                            onChange={e => setCurrency(e.target.value)}
                            placeholder="NPR"
                            className="w-full !rounded-xl !border-none !bg-tableBG !px-5 !py-3 !text-lg !text-textmain focus:!outline-none focus:!ring-1 focus:!ring-primary placeholder:!text-textsecondary"
                            size="large"
                        />
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={!canSubmit || isPending}
                    className="w-full py-4 rounded-full bg-primary text-white text-xl font-semibold mt-2 hover:bg-primary/90 transition disabled:opacity-70"
                >
                    {isPending ? "Adding..." : "Add"}
                </button>
                <button
                    className="w-full py-4 rounded-full bg-[#444] text-white text-xl font-semibold mt-2 hover:bg-[#333] transition"
                    onClick={handleClose}
                    disabled={isPending}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default ManualTransactionCreateOverlay;
