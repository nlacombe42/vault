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
	progressBarColorClass: string;
	incomeBudget: boolean;

	constructor() {
	}

	ngOnInit() {
		let now = new Date();
		this.dayProgressPercent = Math.floor(now.getDate() / DateUtils.getLastSecondOfMonth(now).getDate() * 100);
		this.incomeBudget = false;
		this.progressBarColorClass = 'green-progress';
	}

	private updateProgress() {
		this.updateBudgetPercentComplete();
		this.updateProgressColor();
	}

	private updateProgressColor() {
		if (this.incomeBudget) {
			this.progressBarColorClass = 'green-progress';
		} else {
			if (this.budgetPercentComplete <= 75) {
				this.progressBarColorClass = 'green-progress';
			} else if (this.budgetPercentComplete <= 100) {
				this.progressBarColorClass = 'yellow-progress';
			} else {
				this.progressBarColorClass = 'red-progress';
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
		this.incomeBudget = income;
		this.updateProgress();
	}
}
