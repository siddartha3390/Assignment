import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  frequency,
  formSubmission,
  PaymentFrequency,
} from '../../model/mortgage.interface';

@Component({
  selector: 'app-payment-plan',
  templateUrl: './payment-plan.component.html',
  styleUrls: ['./payment-plan.component.scss'],
})
export class PaymentPlanComponent implements OnInit {
  mortgageForm!: FormGroup;
  paymentFrequecy: frequency[] = [];
  terms: number[] = [];
  amortization: number[] = [];
  @Output() mortgageDataSubmitted = new EventEmitter<formSubmission>();
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.setSelectValues();
    this.createMortgageForm();
  }

  setSelectValues() {
    this.terms = Array.from({ length: 10 }, (_, i) => i + 1);
    this.amortization = Array.from({ length: 30 }, (_, i) => i + 1);
    this.paymentFrequecy = [
      {
        id: 0,
        label: PaymentFrequency.WEEKLY,
      },
      {
        id: 1,
        label: PaymentFrequency.BI_WEEKLY,
      },
      {
        id: 2,
        label: PaymentFrequency.MONTHLY,
      },
      {
        id: 3,
        label: PaymentFrequency.ACCELERATED_WEEKLY,
      },
      {
        id: 4,
        label: PaymentFrequency.ACCELERATED_BI,
      },
      {
        id: 5,
        label: PaymentFrequency.SEMI_MONTHLY,
      },
    ];
  }

  public getField(field: string) {
    return this.mortgageForm.get(field);
  }
  createMortgageForm() {
    this.mortgageForm = this.fb.group({
      PaymentPlan: this.fb.group({
        MortgageAmt: ['100000'],
        InterestRate: ['5'],
        AmortizationPeriod: [this.amortization[24]],
        PaymentFrequency: [this.paymentFrequecy[2].id],
        Term: [this.terms[4]],
      }),
      prePaymentPlan: this.fb.group({
        PaymentAmt: ['0.00'],
      }),
    });
  }
  calculateMortgage() {
    const mortgageData: formSubmission = {
      plan: {
        amortizationPeriod: Number(
          this.getField('PaymentPlan.AmortizationPeriod')?.value
        ),
        interestRate: this.getField('PaymentPlan.InterestRate')?.value,
        mortgageAmt: this.getField('PaymentPlan.MortgageAmt')?.value,
        paymentFrequency: Number(
          this.getField('PaymentPlan.PaymentFrequency')?.value
        ),
        term: Number(this.getField('PaymentPlan.Term')?.value),
      },
      prePlan: {
        paymentAmt: this.getField('prePaymentPlan.PaymentAmt')?.value,
      },
    };
    this.mortgageDataSubmitted.emit(mortgageData);
  }
}
