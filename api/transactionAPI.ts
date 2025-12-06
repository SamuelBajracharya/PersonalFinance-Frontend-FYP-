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

// login to bank and sync accounts
export const loginToBank = async (
  username: string,
  password: string
): Promise<any> => {
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

// get single bank account by id
export const getBankAccount = async (
  accountId: string
): Promise<BankAccount> => {
  const response = await bankInstance.get(`/accounts/${accountId}`);
  return response.data;
};

// create a new transaction
export const createTransaction = async (
  transactionData: Partial<Transaction>
): Promise<Transaction> => {
  const response = await bankInstance.post("/transactions", transactionData);
  return response.data;
};

// get all transactions for a bank account
export const getAccountTransactions = async (
  accountId: string
): Promise<Transaction[]> => {
  const response = await bankInstance.get(
    `/accounts/${accountId}/transactions`
  );
  return response.data;
};
