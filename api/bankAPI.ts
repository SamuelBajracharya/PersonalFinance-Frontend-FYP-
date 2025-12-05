import axios from "axios";

const bankingAPI = axios.create({
  baseURL: "https://koshconnect-production.up.railway.app",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, 
});

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Transaction {
  transaction_id: string;
  description: string;
  from_to: string;
  type: "CREDIT" | "DEBIT";
  amount: number;
  created_at: string;
  category: string;
  account_id: string;
}

export interface NewTransaction {
  account_id: string;
  amount: number;
  type: string;
  category?: string;
}

export const getUser = async (userId: string): Promise<User> => {
  const { data } = await bankingAPI.get<User>(`/users/${userId}`);
  return data;
};

// Get all accounts of a user
export const getUserAccounts = async (userId: string): Promise<Account[]> => {
  const { data } = await bankingAPI.get<Account[]>(`/users/${userId}/accounts`);
  return data;
};

// Get a specific account
export const getAccount = async (accountId: string): Promise<Account> => {
  const { data } = await bankingAPI.get<Account>(`/accounts/${accountId}`);
  return data;
};

// Get transactions of a specific account
export const getAccountTransactions = async (
  accountId: string
): Promise<Transaction[]> => {
  const { data } = await bankingAPI.get<Transaction[]>(
    `/accounts/${accountId}/transactions`
  );
  return data;
};

// Get a specific transaction
export const getTransaction = async (
  transactionId: string
): Promise<Transaction> => {
  const { data } = await bankingAPI.get<Transaction>(
    `/transactions/${transactionId}`
  );
  return data;
};

// Add a new transaction
export const addTransaction = async (
  transactionData: NewTransaction
): Promise<Transaction> => {
  const { data } = await bankingAPI.post<Transaction>(
    `/transactions/`,
    transactionData
  );
  return data;
};

