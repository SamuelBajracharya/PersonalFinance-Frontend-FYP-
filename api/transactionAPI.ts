import { bankInstance } from "./axiosInstance";

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
  synced_stock_instruments: number;
  bank_token: string;
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
export const getBankAccounts = async (): Promise<BankAccount[]> => {
  const response = await bankInstance.get("/accounts");
  return response.data;
};

// create a new transaction
export const createTransaction = async (
  transactionData: Partial<Transaction>,
): Promise<Transaction> => {
  const response = await bankInstance.post("/transactions", transactionData);
  return response.data;
};

// Get Nabil Bank account for current user
export const getNabilBankAccount = async (): Promise<BankAccount> => {
  const response = await bankInstance.get("/accounts/nabil");
  return response.data;
};

// Get transactions for Nabil Bank account (current user)
export const getNabilBankTransactions = async (): Promise<Transaction[]> => {
  const response = await bankInstance.get("/accounts/nabil/transactions");
  return response.data;
};

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
