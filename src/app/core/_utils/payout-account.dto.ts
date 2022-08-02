export interface PayoutAccountDto {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string;
  bankCode: string;
  destinationBranchCode?: string;
  metadata: any;
}

export interface BankDto {
  id: number;
  code: string;
  name: string;
}

export interface BankBranchDto {
  id: number;
  branchCode: string;
  branchName: string;
}
