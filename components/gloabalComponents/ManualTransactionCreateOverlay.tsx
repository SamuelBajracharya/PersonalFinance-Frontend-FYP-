import React, { useState } from "react";
import { useCreateManualTransactionsOverlay } from "@/stores/useCreateManualTransactionsOverlay";
import { Select, Input, DatePicker } from "antd";
import dayjs from "dayjs";
import { useThemeStore } from "@/stores/useThemeStore";
import { TRANSACTION_CATEGORIES } from "@/types/transactionCategories";

const ManualTransactionCreateOverlay: React.FC = () => {
    const { theme } = useThemeStore();
    const {
        createManualTransactions,
        closeCreateManualTransactions,
    } = useCreateManualTransactionsOverlay();

    const [category, setCategory] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [date, setDate] = useState<any>(null);

    if (!createManualTransactions) return null;

    return (
        <div
            className={`fixed inset-0 !z-[2147483645] flex items-center justify-center bg-mainBG/60 backdrop-blur-[1px]`}
            style={{ zIndex: 1200 }}
            data-theme={theme}
        >
            <div
                className="rounded-3xl p-8 w-full max-w-md mx-auto flex flex-col gap-6 shadow-2xl relative bg-secondaryBG"
            >
                <h2 className="text-3xl font-bold text-primary mb-2">Add Transaction</h2>
                <div className="flex flex-col gap-4">
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
                <div className="flex flex-col gap-4">
                    <label className="text-lg font-medium text-textmain">Amount</label>
                    <Input
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        placeholder="Rs5000"
                        className="w-full !rounded-xl !border-none !bg-tableBG !px-6 !py-3 !text-lg !text-textmain focus:!outline-none focus:!ring-1 focus:!ring-primary placeholder:!text-textsecondary"
                        size="large"
                        type="number"
                    />
                </div>
                <div className="flex flex-col gap-4">
                    <label className="text-lg font-medium text-textmain">Date</label>
                    <DatePicker
                        value={date}
                        onChange={setDate}
                        className="w-full !rounded-xl !border-none !bg-tableBG !px-6 !py-3 !text-lg !text-textmain focus:!outline-none focus:!ring-1 focus:!ring-primary placeholder:!text-textsecondary"
                        size="large"
                        format="MM/DD/YYYY"
                        style={{ width: '100%' }}
                        classNames={{ popup: { root: "custom-select" } }}
                    />
                </div>
                <button
                    className="w-full py-4 rounded-full bg-primary text-white text-xl font-semibold mt-4 hover:bg-primary/90 transition"
                >
                    Add
                </button>
                <button
                    className="w-full py-4 rounded-full bg-[#444] text-white text-xl font-semibold mt-2 hover:bg-[#333] transition"
                    onClick={closeCreateManualTransactions}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default ManualTransactionCreateOverlay;
