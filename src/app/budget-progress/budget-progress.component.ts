import {Component, Input} from '@angular/core';
import {DateUtils} from "../shared/date.util";

@Component({
	selector: 'budgetProgress',
	templateUrl: './budget-progress.component.html',
	styleUrls: ['./budget-progress.component.scss']
})
export class BudgetProgressComponent {

	budgetPlannedMaxAmount: number;
	budgetCurrentAmount: number;
	budgetPercentComplete: number;
	dayProgressPercent: number;
	progressBarClasses: string;

	private incomeBudget: boolean;

	constructor() {
		let now = new Date();
		this.dayProgressPercent = Math.floor(now.getDate() / DateUtils.getLastSecondOfMonth(now).getDate() * 100);
		this.incomeBudget = false;
		this.progressBarClasses = 'budget-progress green-progress';
	}

	private updateProgress() {
		this.updateBudgetPercentComplete();
		this.updateProgressColor();
	}

	private updateProgressColor() {
		if (this.incomeBudget) {
			this.progressBarClasses = 'budget-progress green-progress';
		} else {
			if (this.budgetPercentComplete <= 75) {
				this.progressBarClasses = 'budget-progress green-progress';
			} else if (this.budgetPercentComplete <= 100) {
				this.progressBarClasses = 'budget-progress yellow-progress';
			} else {
				this.progressBarClasses = 'budget-progress red-progress';
			}
		}
	}

	private updateBudgetPercentComplete() {
		if (this.budgetPlannedMaxAmount === 0) {
			if (this.budgetCurrentAmount <= 0)
				this.budgetPercentComplete = 0;
			else
				this.budgetPercentComplete = 101;
		}
		else {
			this.budgetPercentComplete = Math.floor(this.budgetCurrentAmount / this.budgetPlannedMaxAmount * 100);
		}
	}

	@Input()
	get currentAmount(): number {
		return this.budgetCurrentAmount;
	}

	set currentAmount(currentAmount: number) {
		this.budgetCurrentAmount = currentAmount;
		this.updateProgress();
	}

	@Input()
	get plannedMaxAmount(): number {
		return this.budgetPlannedMaxAmount;
	}

	set plannedMaxAmount(plannedMaxAmount: number) {
		this.budgetPlannedMaxAmount = plannedMaxAmount;
		this.updateProgress();
	}

	@Input()
	get income(): boolean {
		return this.incomeBudget;
	}

	set income(income: boolean) {
		this.incomeBudget = income === undefined ? false : income;
		this.updateProgress();
	}
}
