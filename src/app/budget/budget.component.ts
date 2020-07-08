import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {BudgetsService} from "../budgets/budgets.service";
import {BudgetWithTransactions} from "../budgets/budget.model";

@Component({
	selector: 'budget',
	templateUrl: './budget.component.html',
	styleUrls: ['./budget.component.scss']
})
export class BudgetComponent implements OnInit {

	budget: BudgetWithTransactions;
	budgetName: string;

	constructor(private route: ActivatedRoute, private budgetsService: BudgetsService) {
	}

	ngOnInit() {
		let budgetId = +this.route.snapshot.paramMap.get('budgetId');

		this.budgetsService.getBudget(budgetId)
			.subscribe(budget => {
				this.budget = budget;
				this.budgetName = this.budget.category === undefined ? 'Unbudgeted' : this.budget.category.name;
			});
	}

	updateBudget(): void {
		this.budgetsService.updateBudget(this.budget.budgetId, {
			plannedMaxAmount: this.budget.plannedMaxAmount,
			income: this.budget.income,
			investment: this.budget.investment
		}).subscribe();
	}
}
