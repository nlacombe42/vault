import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import "rxjs/add/observable/from";
import 'rxjs/add/observable/forkJoin'
import {Observable} from "rxjs/Observable";
import {DatePipe} from "@angular/common";
import {DisplayedMonthBudgetsInfo, MonthBudgetsInfo} from "./month-budgets-info";
import {MonthBudgetCreationRequest} from "./month-budget-creation-request";
import {Category} from "../categories/category.model";
import {TransactionsService} from "../transactions/transactions.service";
import {Budget, BudgetWithTransactions, DisplayedBudget} from "./budget.model";
import {CategoriesService} from "../categories/categories.service";
import {map, mergeMap, take, toArray} from "rxjs/operators";
import "rxjs/add/operator/defaultIfEmpty";

@Injectable()
export class BudgetsService {
	private readonly vaultBudgetsUrl: string = environment.apiBaseUrls.vaultWs + '/v1/budgets';
	private readonly vaultMonthBudgetsUrl: string = this.vaultBudgetsUrl + '/month';

	constructor(private http: HttpClient, private datePipe: DatePipe, private transactionsService: TransactionsService,
				private categoryService: CategoriesService) {
	}

	createBudget(categoryId: number, month: Date, plannedMaxAmount: number, income: boolean, investment: boolean): Observable<void> {
		let monthBudgetCreationRequest: MonthBudgetCreationRequest = {
			categoryId,
			month: this.toIsoYearMonth(month),
			plannedMaxAmount,
			income,
			investment
		};

		return this.http.post<void>(this.vaultMonthBudgetsUrl, monthBudgetCreationRequest);
	}

	getMonthBudgetsInfo(month: Date): Observable<DisplayedMonthBudgetsInfo> {
		let monthIsoString = this.toIsoYearMonth(month);
		let url = this.vaultBudgetsUrl + `/month/${monthIsoString}/info`;

		return this.http.get<MonthBudgetsInfo>(url)
			.pipe(mergeMap((monthBudgetsInfo: MonthBudgetsInfo) => this.toDisplayedMonthBudgetsInfo(monthBudgetsInfo)));
	}

	getUnbudgetedCategories(month: Date): Observable<Category> {
		let monthIsoString = this.toIsoYearMonth(month);
		let url = this.vaultBudgetsUrl + `/month/${monthIsoString}/unbudgetedCategories`;

		return this.http.get<Category[]>(url)
			.pipe(mergeMap((categories: Category[]) => Observable.from(categories)));
	}

	getBudget(budgetId: number): Observable<BudgetWithTransactions> {
		let url = this.vaultBudgetsUrl + '/' + budgetId;

		return this.http.get<any>(url)
			.pipe(mergeMap(rawBudgetWithTransactions => this.toBudgetWithTransactions(rawBudgetWithTransactions)));
	}

	updateBudgetPlannedMaxAmount(budgetId: number, plannedMaxAmount: number): Observable<void> {
		let url = this.vaultBudgetsUrl + `/${budgetId}/plannedMaxAmount`;

		return this.http.put<void>(url, plannedMaxAmount);
	}

	private toDisplayedMonthBudgetsInfo(monthBudgetsInfo: MonthBudgetsInfo): Observable<DisplayedMonthBudgetsInfo> {
		let unbudgetedDisplayedBudgetObservable = this.toDisplayedBudget(monthBudgetsInfo.unbudgeted).pipe(take(1));
		let incomeDisplayedBudgetsObservable = Observable.from(monthBudgetsInfo.incomeBudgets)
			.pipe(mergeMap((incomeBudget: Budget) => this.toDisplayedBudget(incomeBudget)), toArray());
		let spendingDisplayedBudgetsObservable = Observable.from(monthBudgetsInfo.spendingBudgets)
			.pipe(mergeMap((spendingBudget: Budget) => this.toDisplayedBudget(spendingBudget)), toArray());

		return Observable.forkJoin(unbudgetedDisplayedBudgetObservable, incomeDisplayedBudgetsObservable, spendingDisplayedBudgetsObservable)
			.pipe(map(results => {
				return {
					monthStats: monthBudgetsInfo.monthStats,
					unbudgeted: results[0],
					incomeBudgets: results[1],
					spendingBudgets: results[2]
				};
			}));
	}

	private toDisplayedBudget(budget: Budget): Observable<DisplayedBudget> {
		return this.categoryService.getCategory(budget.categoryId)
			.pipe(map(category => {
				return {
					budgetId: budget.budgetId,
					categoryId: budget.categoryId,
					startDate: budget.startDate,
					endDate: budget.endDate,
					plannedMaxAmount: budget.plannedMaxAmount,
					currentAmount: budget.currentAmount,
					income: budget.income,
					investment: budget.investment,
					category
				};
			}));
	}

	private toBudgetWithTransactions(rawBudgetWithTransactions: any): Observable<BudgetWithTransactions> {
		let displayedTransactionsByDateObservable =
			this.transactionsService.rawTransactionToDisplayedTransactionsByDate(rawBudgetWithTransactions.transactions)
				.defaultIfEmpty(undefined);
		let categoryObservable = this.categoryService.getCategory(rawBudgetWithTransactions.categoryId);

		return Observable.forkJoin(displayedTransactionsByDateObservable, categoryObservable)
			.pipe(map(results => {
				return {
					budgetId: rawBudgetWithTransactions.budgetId,
					categoryId: rawBudgetWithTransactions.categoryId,
					startDate: rawBudgetWithTransactions.startDate,
					endDate: rawBudgetWithTransactions.endDate,
					plannedMaxAmount: rawBudgetWithTransactions.plannedMaxAmount,
					currentAmount: rawBudgetWithTransactions.currentAmount,
					income: rawBudgetWithTransactions.income,
					investment: rawBudgetWithTransactions.investment,
					transactionsByDate: results[0],
					category: results[1],
				};
			}));
	}

	private toIsoYearMonth(date: Date): string {
		return this.datePipe.transform(date, 'y-MM');
	}
}
