"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import {
  loginToBank,
  getBankAccounts,
  createTransaction,
  BankLoginSyncResponse,
  BankAccount,
  Transaction,
  unlinkBankAccounts,
  deleteUserTransactionData,
  getNabilBankTransactions,
  getNabilBankAccount,
} from "@/api/transactionAPI";
import { useNabilAccountStore } from "@/stores/useNabilAccountStore";
import { queryKeys } from "@/lib/queryKeys";

// login to bank
export const useLoginToBank = () => {
  const queryClient = useQueryClient();
  const setNabilAccountId = useNabilAccountStore(
    (state) => state.setNabilAccountId,
  );

  return useMutation({
    mutationFn: (data: { username: string; password: string }) =>
      loginToBank(data.username, data.password),

    onSuccess: (response: BankLoginSyncResponse) => {
      localStorage.setItem("isBankLinked", "true");

      // Store bank_token in cookie
      if (response.bank_token) {
        Cookies.set("bank_token", response.bank_token, { expires: 7, secure: true, sameSite: "strict" });
      }

      const nabilAccount = response.synced_accounts?.find((account) =>
        account.bank_name.toLowerCase().includes("nabil"),
      );

      setNabilAccountId(nabilAccount?.account_id ?? null);

      queryClient.invalidateQueries({ queryKey: queryKeys.bank.accounts });
      queryClient.invalidateQueries({ queryKey: queryKeys.bank.nabilAccount });
      queryClient.invalidateQueries({ queryKey: queryKeys.bank.nabilTransactions });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.goalStatuses });
    },
  });
};

// unlinks bank account
export const useUnlinkBankAccounts = () => {
  const queryClient = useQueryClient();
  const clearNabilAccountId = useNabilAccountStore(
    (state) => state.clearNabilAccountId,
  );

  return useMutation({
    mutationFn: unlinkBankAccounts,
    onSuccess: () => {
      localStorage.setItem("isBankLinked", "false");
      clearNabilAccountId();

      queryClient.invalidateQueries({ queryKey: queryKeys.bank.accounts });
      queryClient.invalidateQueries({ queryKey: queryKeys.bank.nabilAccount });
      queryClient.invalidateQueries({ queryKey: queryKeys.bank.nabilTransactions });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.goalStatuses });
    },
  });
};

// deletes all the users bank data
export const useDeleteUserTransactionData = () => {
  const queryClient = useQueryClient();
  const clearNabilAccountId = useNabilAccountStore(
    (state) => state.clearNabilAccountId,
  );

  return useMutation({
    mutationFn: deleteUserTransactionData,
    onSuccess: () => {
      clearNabilAccountId();

      queryClient.invalidateQueries({ queryKey: queryKeys.bank.nabilTransactions });
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

// get Nabil Bank account (current user)
export const useNabilBankAccount = (enabled: boolean) => {
  return useQuery<BankAccount>({
    queryKey: queryKeys.bank.nabilAccount,
    queryFn: getNabilBankAccount,
    enabled,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 3,
  });
};

// get Nabil Bank transactions (current user)
export const useNabilBankTransactions = (enabled: boolean) => {
  return useQuery<Transaction[]>({
    queryKey: queryKeys.bank.nabilTransactions,
    queryFn: getNabilBankTransactions,
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
      queryClient.invalidateQueries({ queryKey: queryKeys.bank.nabilTransactions });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.goalStatuses });
    },
  });
};
