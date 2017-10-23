import {Component, OnInit} from '@angular/core';
import {MdDialog} from "@angular/material";
import {AddBudgetDialogComponent, AddBudgetDialogConfig} from "../add-budget-dialog/add-budget-dialog.component";
import {Budget} from "./budget.model";
import {BudgetsService} from "./budgets.service";
import {DateUtils} from "../shared/date.util";
import {CategoriesService} from "../shared/categories.service";
import {Category} from "../shared/category.model";
import {Observable} from "rxjs/Observable";

class DisplayedBudget extends Budget {
	category: Category;
}

@Component({
	selector: 'displayedBudgets',
	templateUrl: './budgets.component.html',
	styleUrls: ['./budgets.component.scss']
})
export class BudgetsComponent implements OnInit {
	monthDisplayed: Date;
	displayedBudgets: DisplayedBudget[];
	categories: Category[];

	constructor(public dialog: MdDialog, private budgetService: BudgetsService, private categoryService: CategoriesService) {
		this.monthDisplayed = new Date();
		this.displayedBudgets = [];
		this.categories = [];
	}

	ngOnInit() {
		this.categoryService.getUserCategories()
			.subscribe(category => this.categories.push(category),
				undefined,
				() => this.loadBudgets());
	}

	showAddBudgetDialog() {
		let addBudgetDialogConfig: AddBudgetDialogConfig = {
			month: this.monthDisplayed
		};

		let dialog = this.dialog.open(AddBudgetDialogComponent, {
			panelClass: 'fullscreen-dialog',
			data: addBudgetDialogConfig
		});

		dialog.afterClosed().subscribe(result => {
			console.log('The dialog was closed with result: ', result);
		});
	}

	private loadBudgets(): void {
		let startDate = DateUtils.getFirstSecondOfMonth(this.monthDisplayed);
		let endDate = DateUtils.getLastSecondOfMonth(this.monthDisplayed);

		this.displayedBudgets = [];

		this.budgetService.getBudgets(startDate, endDate)
			.subscribe(budget => this.addToDisplayedBudget(budget),
				undefined,
				() => {
					this.displayedBudgets = this.displayedBudgets.splice(0);
				});
	}

	private addToDisplayedBudget(budget: Budget): void {
		this.toDisplayedBudget(budget).subscribe(displayedBudget => {
			this.displayedBudgets.push(displayedBudget);
		});
	}

	private toDisplayedBudget(budget: Budget): Observable<DisplayedBudget> {
		return new Observable<DisplayedBudget>(observer => {
			this.categoryService.getCategory(budget.categoryId)
				.subscribe(category => {
					let displayedBudget: DisplayedBudget = {
						budgetId: budget.budgetId,
						categoryId: budget.categoryId,
						startDate: budget.startDate,
						endDate: budget.endDate,
						plannedMaxAmount: budget.plannedMaxAmount,
						currentAmount: budget.currentAmount,
						category
					};

					observer.next(displayedBudget);
					observer.complete();
				});
		});
	}

	get month(): Date {
		return this.monthDisplayed;
	}

	set month(month: Date) {
		if (!DateUtils.monthEquals(this.monthDisplayed, month)) {
			this.monthDisplayed = month;
			this.loadBudgets();
		}
	}
}
