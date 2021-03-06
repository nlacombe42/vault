import {Component, Inject, OnInit} from '@angular/core';
import {Category} from "../categories/category.model";
import {BudgetsService} from "../budgets/budgets.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

export interface AddBudgetDialogConfig {
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
	category: Category | undefined;
	amount: number | undefined;
	incomeBudget: boolean;
	investmentBudget: boolean;

	constructor(public dialog: MatDialogRef<AddBudgetDialogComponent>,
				@Inject(MAT_DIALOG_DATA) public data: AddBudgetDialogConfig,
				private budgetService: BudgetsService) {

		this.categories = [];
		this.month = data.month;
		this.incomeBudget = false;
		this.investmentBudget = false;
		this.category = undefined;
		this.amount = undefined;
	}

	ngOnInit() {
		this.budgetService.getUnbudgetedCategories(this.month)
			.subscribe(category => this.categories.push(category),
				undefined,
				() => {
					this.categories = this.categories.splice(0);
				});
	}

	addBudget() {
	    if (!this.category || !this.amount) {
	        throw 'category or amount not set';
        }

		this.budgetService.createBudget(this.category.categoryId, this.month, this.amount, this.incomeBudget, this.investmentBudget)
			.subscribe(() => {
				this.dialog.close();
			}, (errorResponse) => {
				console.error('Error while creating budget.', errorResponse);
			});
	}

	closeDialog(): void {
		this.dialog.close();
	}

	setCategory(category: Category): void {
		this.category = category;
	}
}
