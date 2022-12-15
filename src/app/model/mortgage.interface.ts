export enum PaymentFrequency {
  ACCELERATED_WEEKLY = 'Accelerated Weekly',
  WEEKLY = 'weekly',
  ACCELERATED_BI = 'Accelerated Bi-weekly',
  BI_WEEKLY = 'Bi-weekly(every 2 weeks)',
  SEMI_MONTHLY = 'Semi monthly(24x per year)',
  MONTHLY = 'Monthly(12x per year)',
}

export interface frequency {
  id: number;
  label: string;
}

export interface formSubmission {
  plan: paymentPlan;
  prePlan: prePaymentPlan;
}

export interface paymentPlan {
  amortizationPeriod: number;
  interestRate: string;
  mortgageAmt: string;
  paymentFrequency: number;
  term: number;
}

export interface prePaymentPlan {
  paymentAmt: string;
}

export interface CalculationSummary {
  descr: string;
  termPeriod: string;
  mortgagePeriod: string;
}
