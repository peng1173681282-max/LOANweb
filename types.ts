
export enum MenuKey {
  PRODUCT_BASIC = 'product_basic',
  LOAN_TYPE = 'loan_type',
  PRODUCT_GENERAL = 'product_general',
  CHANNEL_PARAM = 'channel_param',
  FUNDER_MGMT = 'funder_mgmt',
  SYSTEM_ADMIN = 'system_admin'
}

export interface CreditProduct {
  id: string;
  code: string; // 6-digit product code
  name: string;
  isRevolving: boolean; // Revolving credit
  creditTerm: string; // Credit term like '1年', '5年'
  type: string;
  apr: number;
  termRange: [number, number];
  amountRange: [number, number];
  status: 'Draft' | 'Published' | 'Archived';
  createdAt: string;
}

export interface LoanType {
  id: string;
  title: string;
  description: string;
  category: 'Personal' | 'Business' | 'Agricultural';
}

export interface SystemLog {
  id: string;
  user: string;
  action: string;
  time: string;
  status: 'Success' | 'Failure';
}

export interface Funder {
  id: string;
  name: string;
  totalLimit: number;
  usedLimit: number;
  status: 'Active' | 'Paused';
  type: 'Bank' | 'Trust' | 'Other';
}

export interface Channel {
  id: string;
  name: string;
  code: string;
  feeRate: number;
  status: 'Enabled' | 'Disabled';
  lastUpdated: string;
}
