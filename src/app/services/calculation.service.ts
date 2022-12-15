import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  CalculationSummary,
  formSubmission,
} from '../model/mortgage.interface';

@Injectable({
  providedIn: 'root',
})
export class MortgageCalculationService {
  constructor() {}

  /*totalAmtofLoan = 80000
	Annual interest rate = 5% = 0.05 = 5/100
	Monthly interest rate = .05/12 = .00417
	Amortization period/ or the year the bank has given you to pay off your loan = 10yrs --->
	convert this to month which is 120 months (yr * 12)

	Mortgage calculation --> M = 80,000 [.00417(1+.00417)^120]/[(1+.00417)^120-1]

  if there is a down payment let's say 16000

  Mortgage calculation ---> M= 80,000-16,000 [.00417(1+.00417)^119]/[(1+.00417)^119-1].
  consider Changing values and fixed value

  */
  public CalculateMortgage(
    mortgageData: formSubmission
  ): Observable<CalculationSummary[]> {
    const interestRatePercentage =
      parseInt(mortgageData.plan.interestRate) / 100;
    const interestRate = this.determineInterestRate(
      mortgageData.plan.paymentFrequency,
      interestRatePercentage
    );
    const term = this.determineTerm(
      mortgageData.plan.term,
      mortgageData.plan.paymentFrequency
    );
    const amortizationPeriod = this.determineAmortization(
      mortgageData.plan.amortizationPeriod,
      mortgageData.plan.paymentFrequency
    );
    const roundInterstRate = Number(interestRate.toFixed(5));
    const totalLoan = parseInt(mortgageData.plan.mortgageAmt);
    const caclulatemonthly = 1 + roundInterstRate;

    const prePayment =
      mortgageData.prePlan.paymentAmt === ''
        ? 0
        : parseInt(mortgageData.prePlan.paymentAmt);

    let calcResult;
    let totalMonthlyPayment = 0;
    if (prePayment !== 0) {
      const amortizationplusInterest = Number(
        Math.pow(caclulatemonthly, amortizationPeriod - 1).toFixed(5)
      );
      const amortizationminusInterest = Math.pow(
        caclulatemonthly,
        amortizationPeriod - 2
      );

      calcResult =
        (totalLoan - prePayment) *
        (roundInterstRate * amortizationplusInterest);
      totalMonthlyPayment = calcResult / (amortizationminusInterest - 1);
    } else {
      const amortizationplusInterest = Math.pow(
        caclulatemonthly,
        amortizationPeriod
      );
      const amortizationminusInterest = Math.pow(
        caclulatemonthly,
        amortizationPeriod - 1
      );
      calcResult = totalLoan * (roundInterstRate * amortizationplusInterest);
      totalMonthlyPayment = calcResult / (amortizationminusInterest - 1);
    }
    return of(
      this.mapMortgageResults(
        prePayment,
        Number(totalMonthlyPayment.toFixed(2)),
        totalLoan,
        term,
        amortizationPeriod
      )
    );
  }

  private determineTerm(term: number, frequency: number) {
    let paymentTerm;
    switch (true) {
      case frequency === 0:
        paymentTerm = term * 52;
        break;
      case frequency === 1:
        paymentTerm = term * 26;
        break;
      case frequency === 2:
        paymentTerm = term * 12;
        break;
      case frequency === 3:
        paymentTerm = term * 52;
        break;
      case frequency === 4:
        paymentTerm = term * 26;
        break;
      case frequency === 5:
        paymentTerm = term * 24;
        break;
    }
    return paymentTerm as number;
  }

  private determineAmortization(period: number, frequency: number) {
    let paymentAmortization;
    switch (true) {
      case frequency === 0:
        paymentAmortization = period * 52;
        break;
      case frequency === 1:
        paymentAmortization = period * 26;
        break;
      case frequency === 2:
        paymentAmortization = period * 12;
        break;
      case frequency === 3:
        paymentAmortization = period * 52;
        break;
      case frequency === 4:
        paymentAmortization = period * 26;
        break;
      case frequency === 5:
        paymentAmortization = period * 24;
        break;
    }
    return paymentAmortization as number;
  }

  private determineInterestRate(frequency: number, rate: number): number {
    let interestRate;
    switch (true) {
      case frequency === 0:
        interestRate = rate / 52;
        break;
      case frequency === 1:
        interestRate = rate / 26;
        break;
      case frequency === 2:
        interestRate = rate / 12;
        break;
      case frequency === 3:
        interestRate = rate / 52;
        break;
      case frequency === 4:
        interestRate = rate / 26;
        break;
      case frequency === 5:
        interestRate = rate / 24;
        break;
    }
    return interestRate as number;
  }

  private mapMortgageResults(
    prepayment: number,
    monthlyPayment: number,
    totalLoan: number,
    term: number,
    period: number
  ): CalculationSummary[] {
    return [
      {
        descr: 'Number of Payments',
        termPeriod: term.toString(),
        mortgagePeriod: period.toString(),
      },
      {
        descr: 'Mortgage Payment',
        termPeriod: `$${monthlyPayment}`,
        mortgagePeriod: `$${monthlyPayment}`,
      },
      {
        descr: 'Prepayment',
        termPeriod: `$${prepayment}`,
        mortgagePeriod: `$${prepayment}`,
      },
      {
        descr: 'Principal Payments',
        termPeriod: `$${((totalLoan * term) / period).toFixed(2)}`,
        mortgagePeriod: `$${totalLoan}`,
      },
      {
        descr: 'Interest Payments',
        termPeriod: `$${(
          monthlyPayment * term -
          (totalLoan * term) / period
        ).toFixed(2)}`,
        mortgagePeriod: `$${(monthlyPayment * period - totalLoan).toFixed(2)}`,
      },
      {
        descr: 'Total Cost',
        termPeriod: `$${(monthlyPayment * term).toFixed(2)}`,
        mortgagePeriod: `$${(monthlyPayment * period).toFixed(2)}`,
      },
    ];
  }
}
