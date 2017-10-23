import {Component, Input, OnInit} from '@angular/core';
import {DateUtils} from "../shared/date.util";

@Component({
	selector: 'budgetProgress',
	templateUrl: './budget-progress.component.html',
	styleUrls: ['./budget-progress.component.scss']
})
export class BudgetProgressComponent implements OnInit {
	budgetPlannedMaxAmount: number;
	budgetCurrentAmount: number;
	budgetPercentComplete: number;
	dayProgressPercent: number;

	constructor() {
	}

	ngOnInit() {
		let now = new Date();
		this.dayProgressPercent = Math.floor(now.getDate() / DateUtils.getLastSecondOfMonth(now).getDate() * 100);
	}

	private updateBudgetPercentComplete() {
		this.budgetPercentComplete = Math.floor(this.budgetCurrentAmount / this.budgetPlannedMaxAmount * 100);
	}

	@Input()
	get currentAmount(): number {
		return this.budgetCurrentAmount;
	}

	set currentAmount(currentAmount: number) {
		this.budgetCurrentAmount = currentAmount;
		this.updateBudgetPercentComplete();
	}

	@Input()
	get plannedMaxAmount(): number {
		return this.budgetPlannedMaxAmount;
	}

	set plannedMaxAmount(plannedMaxAmount: number) {
		this.budgetPlannedMaxAmount = plannedMaxAmount;
		this.updateBudgetPercentComplete();
	}
}
