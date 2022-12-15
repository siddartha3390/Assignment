import { Component, OnInit } from '@angular/core';
import {
  CalculationSummary,
  formSubmission,
} from '../../model/mortgage.interface';
import { MortgageCalculationService } from '../../services/calculation.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  initialMortgage: formSubmission = {
    plan: {
      amortizationPeriod: 25,
      interestRate: '5',
      mortgageAmt: '100000',
      paymentFrequency: 2,
      term: 5,
    },
    prePlan: {
      paymentAmt: '0.00',
    },
  };
  caclulationSummary!: CalculationSummary[];
  constructor(private calculator: MortgageCalculationService) {}

  ngOnInit(): void {
    this.calculateMortgage(this.initialMortgage);
  }

  calculateMortgage(ev: formSubmission) {
    this.calculator.CalculateMortgage(ev).subscribe((mortgageResult) => {
      this.caclulationSummary = mortgageResult;
    });
  }
}
