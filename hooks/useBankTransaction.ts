"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import {
  loginToBank,
  getBankAccounts,
  createTransaction,
  BankAccount,
  Transaction,
  unlinkBankAccounts,
  deleteUserTransactionData,
  getBankTransactions,
  getPrimaryBankAccount,
} from "@/api/transactionAPI";
import { queryKeys } from "@/lib/queryKeys";

// login to bank
export const useLoginToBank = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { username: string; password: string }) =>
      loginToBank(data.username, data.password),

    onSuccess: (response) => {
      localStorage.setItem("isBankLinked", "true");

      // Store bank_token in cookie
      if (response.bank_token) {
        Cookies.set("bank_token", response.bank_token, { expires: 7, secure: true, sameSite: "strict" });
      }

      queryClient.invalidateQueries({ queryKey: queryKeys.bank.accounts });
      queryClient.invalidateQueries({ queryKey: queryKeys.bank.account });
      queryClient.invalidateQueries({ queryKey: queryKeys.bank.transactions });
      queryClient.invalidateQueries({ queryKey: queryKeys.bank.syncStatus });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.goalStatuses });
    },
  });
};

// unlinks bank account
export const useUnlinkBankAccounts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unlinkBankAccounts,
    onSuccess: () => {
      localStorage.setItem("isBankLinked", "false");

      queryClient.invalidateQueries({ queryKey: queryKeys.bank.accounts });
      queryClient.invalidateQueries({ queryKey: queryKeys.bank.account });
      queryClient.invalidateQueries({ queryKey: queryKeys.bank.transactions });
      queryClient.invalidateQueries({ queryKey: queryKeys.bank.syncStatus });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.goalStatuses });
    },
  });
};

// deletes all the users bank data
export const useDeleteUserTransactionData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUserTransactionData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bank.transactions });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.goalStatuses });
    },
  });
};

// get all bank accounts
export const useBankAccounts = () => {
  return useQuery<BankAccount[]>({
    queryKey: queryKeys.bank.accounts,
    queryFn: getBankAccounts,
    staleTime: 1000 * 60 * 5,
  });
};

// get primary linked bank account (current user)
export const usePrimaryBankAccount = (enabled: boolean) => {
  return useQuery<BankAccount>({
    queryKey: queryKeys.bank.account,
    queryFn: getPrimaryBankAccount,
    enabled,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 3,
  });
};

// get transactions for primary linked bank account (current user)
export const useBankTransactions = (enabled: boolean) => {
  return useQuery<Transaction[]>({
    queryKey: queryKeys.bank.transactions,
    queryFn: getBankTransactions,
    enabled,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60,
  });
};
// create a transaction
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Transaction>) => createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bank.transactions });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.goalStatuses });
    },
  });
};

// Backward-compatible aliases for existing imports.
export const useNabilBankAccount = usePrimaryBankAccount;
export const useNabilBankTransactions = useBankTransactions;
