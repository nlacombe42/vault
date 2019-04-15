import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material";
import {AddBudgetDialogComponent, AddBudgetDialogConfig} from "../add-budget-dialog/add-budget-dialog.component";
import {DisplayedBudget} from "./budget.model";
import {BudgetsService} from "./budgets.service";
import {DateUtils} from "../shared/date.util";
import {CategoriesService} from "../categories/categories.service";
import {Category} from "../categories/category.model";
import {MonthStats} from "./month-stats.model";
import {StorageService} from "../shared/storage.service";

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
	cashFlowLabel: string;
	cashFlow: number;
	cashFlowWithoutInvestmentLabel: string;
	cashFlowWithoutInvestment: number;
	spendingTotal: number;
	totalPlannedMaxAmountMinusInvestments: number;

	constructor(public dialog: MatDialog, private budgetService: BudgetsService,
				private categoryService: CategoriesService, private storageService: StorageService) {

		let storedDisplayedMonth = this.storageService.getDisplayedMonthForBudgets();

		this.monthDisplayed = storedDisplayedMonth !== undefined ? storedDisplayedMonth : new Date();
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
		this.budgetService.getMonthBudgetsInfo(this.monthDisplayed)
			.subscribe(monthBudgetsInfo => {
				this.spendingBudgets = monthBudgetsInfo.spendingBudgets;
				this.incomeBudgets = monthBudgetsInfo.incomeBudgets;
				this.monthStats = monthBudgetsInfo.monthStats;
				this.everythingElseBudget = monthBudgetsInfo.unbudgeted;
				this.updateCashFlow();
				this.updateSpendingTotal();
			});
	}

	private updateCashFlow() {
		if (DateUtils.isPastMonth(this.monthDisplayed)) {
			this.cashFlowLabel = 'Current cash flow';
			this.cashFlow = this.monthStats.currentAmount;
		} else {
			let planedTotalIncome = this.getMonthPlanedTotalIncome();
			this.cashFlowLabel = 'Planed cash flow';
			this.cashFlow = planedTotalIncome - Math.max(this.monthStats.totalPlannedMaxAmount, this.monthStats.currentAmount);
		}

		if (DateUtils.isPastMonth(this.monthDisplayed)) {
			let investmentTotal = this.getCurrentInvestmentTotal();
			this.cashFlowWithoutInvestmentLabel = 'Current cash flow (without investment)';
			this.cashFlowWithoutInvestment = this.cashFlow + investmentTotal;
			this.totalPlannedMaxAmountMinusInvestments = this.monthStats.totalPlannedMaxAmount - investmentTotal;
		} else {
			let investmentTotal = this.getPlannedInvestmentTotal();
			this.cashFlowWithoutInvestmentLabel = 'Planed cash flow (without investment)';
			this.cashFlowWithoutInvestment = this.cashFlow + investmentTotal;
			this.totalPlannedMaxAmountMinusInvestments = this.monthStats.totalPlannedMaxAmount - investmentTotal;
		}
	}

	private getCurrentInvestmentTotal(): number {
		let spendingInvestmentTotal = this.spendingBudgets
			.filter(spendingBudget => spendingBudget.investment)
			.reduce((investmentTotal, spendingBudget) => investmentTotal + spendingBudget.currentAmount, 0);

		let incomeInvestmentTotal = this.incomeBudgets
			.filter(spendingBudget => spendingBudget.investment)
			.reduce((investmentTotal, incomeBudget) => investmentTotal + incomeBudget.currentAmount, 0);

		return spendingInvestmentTotal - incomeInvestmentTotal;
	}

	private getPlannedInvestmentTotal(): number {
		let spendingInvestmentTotal = this.spendingBudgets
			.filter(spendingBudget => spendingBudget.investment)
			.reduce((investmentTotal, spendingBudget) => investmentTotal + spendingBudget.plannedMaxAmount, 0);

		let incomeInvestmentTotal = this.incomeBudgets
			.filter(spendingBudget => spendingBudget.investment)
			.reduce((investmentTotal, incomeBudget) => investmentTotal + incomeBudget.plannedMaxAmount, 0);

		return spendingInvestmentTotal - incomeInvestmentTotal;
	}

	private updateSpendingTotal() {
		this.spendingTotal = this.getSpendingBudgetTotal() + this.everythingElseBudget.currentAmount;
	}

	private getSpendingBudgetTotal(): number {
		if (this.spendingBudgets.length == 0)
			return 0;

		return this.spendingBudgets
			.map(spendingBudget => spendingBudget.currentAmount)
			.reduce((totalSpent, budgetSpent) => totalSpent + budgetSpent);
	}

	private getMonthPlanedTotalIncome(): number {
		let planedTotalIncome = 0;

		this.incomeBudgets.forEach(incomeBudget => planedTotalIncome += incomeBudget.plannedMaxAmount);

		return planedTotalIncome;
	}

	get month(): Date {
		return this.monthDisplayed;
	}

	set month(month: Date) {
		if (!DateUtils.monthEquals(this.monthDisplayed, month)) {
			this.monthDisplayed = month;
			this.storageService.setDisplayedMonthForBudgets(month);
			this.loadMonthBudgetsInfo();
		}
	}
}
