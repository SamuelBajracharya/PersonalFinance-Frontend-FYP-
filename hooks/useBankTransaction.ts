"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
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

// login to bank
export const useLoginToBank = () => {
  const setNabilAccountId = useNabilAccountStore(
    (state) => state.setNabilAccountId,
  );

  return useMutation({
    mutationFn: (data: { username: string; password: string }) =>
      loginToBank(data.username, data.password),

    onSuccess: (response: BankLoginSyncResponse) => {
      localStorage.setItem("isBankLinked", "true");

      const nabilAccount = response.synced_accounts?.find((account) =>
        account.bank_name.toLowerCase().includes("nabil"),
      );

      setNabilAccountId(nabilAccount?.account_id ?? null);
    },
  });
};

// unlinks bank account
export const useUnlinkBankAccounts = () => {
  const clearNabilAccountId = useNabilAccountStore(
    (state) => state.clearNabilAccountId,
  );

  return useMutation({
    mutationFn: unlinkBankAccounts,
    onSuccess: () => {
      localStorage.setItem("isBankLinked", "false");
      clearNabilAccountId();
    },
  });
};

// deletes all the users bank data
export const useDeleteUserTransactionData = () => {
  const clearNabilAccountId = useNabilAccountStore(
    (state) => state.clearNabilAccountId,
  );

  return useMutation({
    mutationFn: deleteUserTransactionData,
    onSuccess: () => {
      clearNabilAccountId();
    },
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
