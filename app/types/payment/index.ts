export interface Invoice {
  id: string;
  isAnnual: false;
  businessId: string;
  platform?: string;
  subscriptionId: string;
  paymentUrl: string;
  email: string;
  reference: string;
  createdAt: string;
  status: string;
  subscription: {
    id: string;
    name: string;
    tier: string;
    description: string;
    monthlyPrice: number;
    annualPrice: number;
  };
  payload: {
    status: string;
    description: string;
    payment_amount: number;
    charges_description: string;
    charges_amount: number;
    vat: number;
    total: number;
    invoice_date: string;
    due_date: string;
    invoice_id: string;
    email: string;
    address: string;
    name: string;
    color: string;
  };
}

export interface Plan {
  businessId: string;
  newPlanId: string;
  isAnnual: boolean;
  paymentReference: string;
}
