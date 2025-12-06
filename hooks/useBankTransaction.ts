"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import {
  loginToBank,
  getBankAccounts,
  getBankAccount,
  getAccountTransactions,
  createTransaction,
  BankAccount,
  Transaction,
} from "@/api/transactionAPI";

// login to bank
export const useLoginToBank = () => {
  return useMutation({
    mutationFn: (data: { username: string; password: string }) =>
      loginToBank(data.username, data.password),
  });
};

// get all bank accounts
export const useBankAccounts = () => {
  return useQuery<BankAccount[]>({
    queryKey: ["bank-accounts"],
    queryFn: getBankAccounts,
  });
};

// get single bank account by id
export const useBankAccount = (accountId: string) => {
  return useQuery<BankAccount>({
    queryKey: ["bank-account", accountId],
    queryFn: () => getBankAccount(accountId!),
    enabled: !!accountId,
  });
};

// get transactions for an account
export const useAccountTransactions = (accountId: string) => {
  return useQuery<Transaction[]>({
    queryKey: ["bank-account-transactions", accountId],
    queryFn: () => getAccountTransactions(accountId!),
    enabled: !!accountId,
  });
};

// create a transaction
export const useCreateTransaction = () => {
  return useMutation({
    mutationFn: (data: Partial<Transaction>) => createTransaction(data),
  });
};
