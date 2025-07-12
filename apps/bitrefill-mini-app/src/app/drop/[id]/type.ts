export type DropData = {
  id: string;
  giftcard_id: string;
  giftcard_name: string;
  amount: number;
  quantity: number;
  deadline: string;
  cast_hash: string | null;
  created_by: string;
  redemption_info?: any;
  invoice_status: string;
  criteria: string;
};
