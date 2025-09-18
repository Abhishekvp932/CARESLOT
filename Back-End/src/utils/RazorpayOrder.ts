export interface RazorpayOrder {
  id: string;
  entity: string;  
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string | null;
  status: string;
  attempts: number;
  notes: Record<string,null>;
  offer_id: string | null;
  created_at: number;
}
