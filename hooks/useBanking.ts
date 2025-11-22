import {
  Account,
  addTransaction,
  getAccount,
  getAccountTransactions,
  getTransaction,
  getUser,
  getUserAccounts,
  NewTransaction,
  Transaction,
  User,
} from "@/api/bankAPI";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


// Get a single user
export const useUser = (userId: string) => {
  return useQuery<User>({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
  });
};

// Get all accounts of a user
export const useUserAccounts = (userId: string) => {
  return useQuery<Account[]>({
    queryKey: ["userAccounts", userId],
    queryFn: () => getUserAccounts(userId),
    enabled: !!userId,
  });
};

// ====================== ACCOUNTS ======================

// Get a specific account
export const useAccount = (accountId: string) => {
  return useQuery<Account>({
    queryKey: ["account", accountId],
    queryFn: () => getAccount(accountId),
    enabled: !!accountId,
  });
};

// Get all transactions of an account
export const useAccountTransactions = (accountId: string) => {
  return useQuery<Transaction[]>({
    queryKey: ["accountTransactions", accountId],
    queryFn: () => getAccountTransactions(accountId),
    enabled: !!accountId,
  });
};

// ====================== TRANSACTIONS ======================

// Get a specific transaction
export const useTransaction = (transactionId: string) => {
  return useQuery<Transaction>({
    queryKey: ["transaction", transactionId],
    queryFn: () => getTransaction(transactionId),
    enabled: !!transactionId,
  });
};

// Add a new transaction
export const useAddTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newTx: NewTransaction) => addTransaction(newTx),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["accountTransactions", data.account_id],
      });
    },
  });
};
