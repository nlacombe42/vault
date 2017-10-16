import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";
import {Category} from "../shared/category.model";
import {CategoriesService} from "../shared/categories.service";
import {BudgetsService} from "../budgets/budgets.service";
import {Budget} from "../budgets/budget.model";
import {DateUtils} from "../shared/date.util";

export class AddBudgetDialogConfig {
	month: Date;
}

@Component({
	selector: 'add-budget-dialog',
	templateUrl: './add-budget-dialog.component.html',
	styleUrls: ['./add-budget-dialog.component.scss']
})
export class AddBudgetDialogComponent implements OnInit {

	categories: Category[];
	month: Date;
	category: Category;
	amount: number;

	constructor(public dialog: MdDialogRef<AddBudgetDialogComponent>,
				@Inject(MD_DIALOG_DATA) public data: AddBudgetDialogConfig,
				private categoriesService: CategoriesService,
				private budgetService: BudgetsService) {

		this.categories = [];
		this.month = data.month;
	}

	ngOnInit() {
		this.categoriesService.getUserCategories()
			.subscribe(category => this.categories.push(category));
	}

	addBudget() {
		let budget: Budget = {
			budgetId: undefined,
			categoryId: this.category.categoryId,
			startDate: DateUtils.getFirstSecondOfMonth(this.month),
			endDate: DateUtils.getLastSecondOfMonth(this.month),
			plannedMaxAmount: this.amount,
			currentAmount: undefined
		};

		this.budgetService.createBudget(budget).subscribe(() => {
			this.dialog.close();
		}, (errorResponse) => {
			console.error('Error while creating budget.', errorResponse);
		});
	}

	closeDialog(): void {
		this.dialog.close();
	}
}
