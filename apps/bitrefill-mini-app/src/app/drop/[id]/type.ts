export type RedemptionInfo = {
  code: string;
  link: string;
  pin: string;
  barcode_format: string;
  barcode_value: string;
  instructions: string;
  expiration_date: string; // Consider using Date type if you'll be working with dates directly
  other: string;
  extra_fields?: {
    [key: string]: string;
  };
};
export type DropData = {
  id: string;
  giftcard_id: string;
  giftcard_name: string;
  amount: number;
  quantity: number;
  deadline: string;
  cast_hash: string | null;
  created_by: string;
  redemption_info?: RedemptionInfo;
  invoice_status: string;
  criteria: string;
};
