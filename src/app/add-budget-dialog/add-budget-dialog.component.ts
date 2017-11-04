import {Component, Inject, OnInit} from '@angular/core';
import {Category} from "../shared/category.model";
import {CategoriesService} from "../shared/categories.service";
import {BudgetsService} from "../budgets/budgets.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

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

	constructor(public dialog: MatDialogRef<AddBudgetDialogComponent>,
				@Inject(MAT_DIALOG_DATA) public data: AddBudgetDialogConfig,
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
		this.budgetService.createBudget(this.category.categoryId, this.month, this.amount)
			.subscribe(() => {
				this.dialog.close();
			}, (errorResponse) => {
				console.error('Error while creating budget.', errorResponse);
			});
	}

	closeDialog(): void {
		this.dialog.close();
	}
}
