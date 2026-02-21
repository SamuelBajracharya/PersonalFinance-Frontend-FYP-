"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import {
  loginToBank,
  getBankAccounts,
  createTransaction,
  BankAccount,
  Transaction,
  unlinkBankAccounts,
  deleteUserTransactionData,
  getNabilBankTransactions,
  getNabilBankAccount,
} from "@/api/transactionAPI";

// login to bank
export const useLoginToBank = () => {
  return useMutation({
    mutationFn: (data: { username: string; password: string }) =>
      loginToBank(data.username, data.password),

    onSuccess: () => {
      localStorage.setItem("isBankLinked", "true");
    },
  });
};

// unlinks bank account
export const useUnlinkBankAccounts = () => {
  return useMutation({
    mutationFn: unlinkBankAccounts,
    onSuccess: () => {
      localStorage.setItem("isBankLinked", "false");
    },
  });
};

// deletes all the users bank data
export const useDeleteUserTransactionData = () => {
  return useMutation({
    mutationFn: deleteUserTransactionData,
  });
};

// get all bank accounts
export const useBankAccounts = () => {
  return useQuery<BankAccount[]>({
    queryKey: ["bank-accounts"],
    queryFn: getBankAccounts,
  });
};

// get Nabil Bank account (current user)
export const useNabilBankAccount = (enabled: boolean) => {
  return useQuery<BankAccount>({
    queryKey: ["nabil-bank-account"],
    queryFn: getNabilBankAccount,
    enabled,
    placeholderData: (previousData) => previousData,
  });
};

// get Nabil Bank transactions (current user)
export const useNabilBankTransactions = (enabled: boolean) => {
  return useQuery<Transaction[]>({
    queryKey: ["nabil-bank-transactions"],
    queryFn: getNabilBankTransactions,
    enabled,
    placeholderData: (previousData) => previousData,
  });
};
// create a transaction
export const useCreateTransaction = () => {
  return useMutation({
    mutationFn: (data: Partial<Transaction>) => createTransaction(data),
  });
};
