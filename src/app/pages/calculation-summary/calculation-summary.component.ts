import { Component, Input, OnInit } from '@angular/core';
import { CalculationSummary } from '../../model/mortgage.interface';

@Component({
  selector: 'app-calculation-summary',
  templateUrl: './calculation-summary.component.html',
  styleUrls: ['./calculation-summary.component.scss'],
})
export class CalculationSummaryComponent implements OnInit {
  @Input() caclulationSummary!: CalculationSummary[];
  constructor() {}

  ngOnInit(): void {}
}
