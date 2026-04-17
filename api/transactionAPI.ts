import { bankInstance } from "./axiosInstance";
import { AxiosError, AxiosRequestConfig } from "axios";

export interface BankAccount {
  id: string;
  external_account_id: string;
  bank_name: string;
  account_number_masked: string;
  account_type: string;
  balance: number;
  user_id: string;
}

export interface Transaction {
  id: string;
  account_id: string;
  external_transaction_id?: string;
  amount: number;
  currency: string;
  type: string;
  status: string;
  date: string;
  description?: string;
  merchant?: string;
  category?: string;
  source?: string;
}

export interface SyncedBankAccount {
  user_id: string;
  bank_name: string;
  account_number_masked: string;
  account_type: string;
  balance: number;
  account_id: string;
}

export interface BankLoginSyncResponse {
  status: string;
  message: string;
  synced_accounts: SyncedBankAccount[];
  synced_stock_instruments?: number;
  bank_token?: string;
  synced_accounts_detail?: Array<{
    external_account_id: string;
    local_account_id: string;
    new_transactions: number;
    status: string;
  }>;
}

// login to bank and sync accounts
export const loginToBank = async (
  username: string,
  password: string,
): Promise<BankLoginSyncResponse> => {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);

  const response = await bankInstance.post("/bank-login", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// get all bank accounts
export const getBankAccounts = async (
  config?: AxiosRequestConfig
): Promise<BankAccount[]> => {
  const response = await bankInstance.get("/accounts", config);
  return response.data;
};

// create a new transaction
export const createTransaction = async (
  transactionData: Partial<Transaction>,
): Promise<Transaction> => {
  const response = await bankInstance.post("/transactions", transactionData);
  return response.data;
};

// Get first linked bank account for current user (generalized endpoint)
export const getPrimaryBankAccount = async (
  config?: AxiosRequestConfig
): Promise<BankAccount> => {
  const response = await bankInstance.get("/accounts", config);
  const accounts = response.data as BankAccount[];

  if (!Array.isArray(accounts) || accounts.length === 0) {
    throw new Error("No linked bank account found.");
  }

  return accounts[0];
};

// Get transactions for primary linked bank account (generalized endpoint)
export const getBankTransactions = async (
  config?: AxiosRequestConfig
): Promise<Transaction[]> => {
  try {
    const primaryAccount = await getPrimaryBankAccount(config);
    const response = await bankInstance.get(`/accounts/${primaryAccount.id}/transactions`, config);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    if (status && status >= 400 && status < 500 && status !== 401 && status !== 403) {
      const legacyResponse = await bankInstance.get("/accounts/nabil/transactions", config);
      return legacyResponse.data;
    }
    throw error;
  }
};

// Backward-compatible aliases
export const getNabilBankAccount = getPrimaryBankAccount;
export const getNabilBankTransactions = getBankTransactions;

// unlink all bank accounts for current user
export const unlinkBankAccounts = async (): Promise<{ message: string }> => {
  const response = await bankInstance.post("/unlink");
  return response.data;
};

// delete all transaction data for current user
export const deleteUserTransactionData = async (): Promise<{
  message: string;
}> => {
  const response = await bankInstance.delete("/delete-data");
  return response.data;
};
