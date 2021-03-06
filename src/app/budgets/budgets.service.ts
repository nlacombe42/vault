import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable, from, forkJoin, throwError, of} from "rxjs";
import {DatePipe} from "@angular/common";
import {DisplayedMonthBudgetsInfo, MonthBudgetsInfo} from "./month-budgets-info";
import {MonthBudgetCreationRequest} from "./month-budget-creation-request";
import {Category} from "../categories/category.model";
import {TransactionsService} from "../transactions/transactions.service";
import {Budget, BudgetUpdateRequest, BudgetWithTransactions, DisplayedBudget} from "./budget.model";
import {CategoriesService} from "../categories/categories.service";
import {map, mergeMap, take, toArray, defaultIfEmpty, catchError} from "rxjs/operators";
import {Grouping} from "../shared/array.util";
import {DisplayedTransaction} from "../transactions/displayed-transaction.model";

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
            .pipe(mergeMap((categories: Category[]) => from(categories)));
    }

    getBudget(budgetId: number): Observable<BudgetWithTransactions> {
        let url = this.vaultBudgetsUrl + '/' + budgetId;

        return this.http.get<any>(url)
            .pipe(mergeMap(rawBudgetWithTransactions => this.toBudgetWithTransactions(rawBudgetWithTransactions)));
    }

    updateBudget(budgetId: number, budgetUpdateRequest: BudgetUpdateRequest): Observable<void> {
        let url = this.vaultBudgetsUrl + `/${budgetId}`;

        return this.http.put<void>(url, budgetUpdateRequest);
    }

    private toDisplayedMonthBudgetsInfo(monthBudgetsInfo: MonthBudgetsInfo): Observable<DisplayedMonthBudgetsInfo> {
        let unbudgetedDisplayedBudgetObservable = this.toDisplayedBudget(monthBudgetsInfo.unbudgeted).pipe(take(1));
        let incomeDisplayedBudgetsObservable = from(monthBudgetsInfo.incomeBudgets)
            .pipe(mergeMap((incomeBudget: Budget) => this.toDisplayedBudget(incomeBudget)), toArray());
        let spendingDisplayedBudgetsObservable = from(monthBudgetsInfo.spendingBudgets)
            .pipe(mergeMap((spendingBudget: Budget) => this.toDisplayedBudget(spendingBudget)), toArray());

        return forkJoin([unbudgetedDisplayedBudgetObservable, incomeDisplayedBudgetsObservable, spendingDisplayedBudgetsObservable])
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
        return this.categoryService.getCategoryOrUndefinedIfArgumentUndefined(budget.categoryId)
            .pipe(
                map(category => {
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
                }),
            );
    }

    private toBudgetWithTransactions(rawBudgetWithTransactions: any): Observable<BudgetWithTransactions> {
        const displayedTransactionsByDateObservable = this.transactionsService.rawTransactionToDisplayedTransactionsByDate(rawBudgetWithTransactions.transactions);
        const categoryObservable = this.categoryService.getCategoryOrUndefinedIfArgumentUndefined(rawBudgetWithTransactions.categoryId);

        return forkJoin([displayedTransactionsByDateObservable, categoryObservable])
            .pipe(
                map(results => {
                    let transactionsByDate: Grouping<Date, DisplayedTransaction>[] = results[0];

                    return {
                        budgetId: rawBudgetWithTransactions.budgetId,
                        categoryId: rawBudgetWithTransactions.categoryId,
                        startDate: rawBudgetWithTransactions.startDate,
                        endDate: rawBudgetWithTransactions.endDate,
                        plannedMaxAmount: rawBudgetWithTransactions.plannedMaxAmount,
                        currentAmount: rawBudgetWithTransactions.currentAmount,
                        income: rawBudgetWithTransactions.income,
                        investment: rawBudgetWithTransactions.investment,
                        transactionsByDate: transactionsByDate,
                        category: results[1] || undefined,
                    };
                }),
            );
    }

    private toIsoYearMonth(date: Date): string {
        const isoDate = this.datePipe.transform(date, 'y-MM');

        if (!isoDate) {
            throw 'error when transforming date to iso';
        }

        return isoDate;
    }
}
