import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import "rxjs/add/observable/from";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/map";
import {Observable} from "rxjs/Observable";
import {DatePipe} from "@angular/common";
import {MonthBudgetsInfo} from "./month-budgets-info";
import {MonthBudgetCreationRequest} from "./month-budget-creation-request";
import {Category} from "../shared/category.model";

@Injectable()
export class BudgetsService {
	private readonly vaultBudgetsUrl: string = environment.apiBaseUrls.vaultWs + '/v1/budgets';
	private readonly vaultMonthBudgetsUrl: string = this.vaultBudgetsUrl + '/month';

	constructor(private http: HttpClient, private datePipe: DatePipe) {
	}

	createBudget(categoryId: number, month: Date, plannedMaxAmount: number, income: boolean): Observable<void> {
		let monthBudgetCreationRequest: MonthBudgetCreationRequest = {
			categoryId,
			month: this.toIsoYearMonth(month),
			plannedMaxAmount,
			income
		};

		return this.http.post<void>(this.vaultMonthBudgetsUrl, monthBudgetCreationRequest);
	}

	getMonthBudgetsInfo(month: Date): Observable<MonthBudgetsInfo> {
		let monthIsoString = this.toIsoYearMonth(month);
		let url = this.vaultBudgetsUrl + `/month/${monthIsoString}/info`;

		return this.http.get<MonthBudgetsInfo>(url);
	}

	getUnbudgetedCategories(month: Date): Observable<Category> {
		let monthIsoString = this.toIsoYearMonth(month);
		let url = this.vaultBudgetsUrl + `/month/${monthIsoString}/unbudgetedCategories`;

		return this.http.get<Category[]>(url).flatMap(categories => Observable.from(categories));
	}

	private toIsoYearMonth(date: Date): string {
		return this.datePipe.transform(date, 'y-MM');
	}
}
