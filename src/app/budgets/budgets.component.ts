import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material";
import {AddBudgetDialogComponent, AddBudgetDialogConfig} from "../add-budget-dialog/add-budget-dialog.component";
import {Budget} from "./budget.model";
import {BudgetsService} from "./budgets.service";
import {DateUtils} from "../shared/date.util";
import {CategoriesService} from "../shared/categories.service";
import {Category} from "../shared/category.model";
import {Observable} from "rxjs/Observable";
import {MonthStats} from "./month-stats.model";

class DisplayedBudget extends Budget {
	category: Category;
}

@Component({
	selector: 'budgets',
	templateUrl: './budgets.component.html',
	styleUrls: ['./budgets.component.scss']
})
export class BudgetsComponent implements OnInit {
	monthDisplayed: Date;
	incomeBudgets: DisplayedBudget[];
	spendingBudgets: DisplayedBudget[];
	everythingElseBudget: DisplayedBudget;
	monthStats: MonthStats;
	categories: Category[];

	constructor(public dialog: MatDialog, private budgetService: BudgetsService, private categoryService: CategoriesService) {
		this.monthDisplayed = new Date();
		this.spendingBudgets = [];
		this.incomeBudgets = [];
		this.categories = [];
	}

	ngOnInit() {
		this.loadCategoriesAndBudgets();
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
			this.loadMonthBudgetsInfo();
		});
	}

	private loadCategoriesAndBudgets() {
		this.categoryService.getUserCategories()
			.subscribe(category => this.categories.push(category),
				undefined,
				() => this.loadMonthBudgetsInfo());
	}

	private loadMonthBudgetsInfo(): void {
		this.spendingBudgets = [];
		this.everythingElseBudget = undefined;

		this.budgetService.getMonthBudgetsInfo(this.monthDisplayed)
			.subscribe(monthBudgetsInfo => {
				this.addSpendingBudgets(monthBudgetsInfo.spendingBudgets);
				this.addIncomeBudgets(monthBudgetsInfo.incomeBudgets);
				this.spendingBudgets = this.spendingBudgets.splice(0);
				this.incomeBudgets = this.incomeBudgets.splice(0);
				this.monthStats = monthBudgetsInfo.monthStats;
				this.toDisplayedBudget(monthBudgetsInfo.unbudgeted).subscribe(displayedBudget => {
					this.everythingElseBudget = displayedBudget;
				});
			});
	}

	private addSpendingBudgets(budgets: Budget[]): void {
		budgets.forEach(budget => this.addSpendingBudget(budget));
	}

	private addSpendingBudget(budget: Budget): void {
		this.toDisplayedBudget(budget).subscribe(displayedBudget => {
			this.spendingBudgets.push(displayedBudget);
		});
	}

	private addIncomeBudgets(budgets: Budget[]): void {
		budgets.forEach(budget => this.addIncomeBudget(budget));
	}

	private addIncomeBudget(budget: Budget): void {
		this.toDisplayedBudget(budget).subscribe(displayedBudget => {
			this.incomeBudgets.push(displayedBudget);
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
			this.loadMonthBudgetsInfo();
		}
	}
}
