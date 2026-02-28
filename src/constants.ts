export const BUSINESS_UNITS = [
  "그린섬",
  "디자인",
  "목동",
  "강남",
  "분당",
  "강프리어",
  "홍프리어",
  "애니섬",
  "미잼",
  "미엔",
  "하이섬"
];

export const PAYMENT_METHODS = [
  "현금",
  "카드",
  "이체"
];

export interface Receipt {
  id?: number;
  date: string;
  place: string;
  amount: number;
  business_unit: string;
  payment_method: string;
  user: string;
  approval_date: string;
  approver: string;
  usage_purpose: string;
  image_url?: string;
  document_image?: string;
  created_at?: string;
}
