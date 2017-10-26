import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import "rxjs/add/observable/from";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/map";
import {Budget} from "./budget.model";
import {Observable} from "rxjs/Observable";
import {DatePipe} from "@angular/common";

class MonthBudgetCreationRequest {
	categoryId: number;
	month: string;
	plannedMaxAmount: number;
}

@Injectable()
export class BudgetsService {
	private readonly vaultbudgetsUrl: string = environment.apiBaseUrls.vaultWs + '/v1/budgets';
	private readonly vaultMonthBudgetsUrl: string = this.vaultbudgetsUrl + '/month';

	constructor(private http: HttpClient, private datePipe: DatePipe) {
	}

	createBudget(categoryId: number, month: Date, plannedMaxAmount: number): Observable<void> {
		let monthBudgetCreationRequest: MonthBudgetCreationRequest = {
			categoryId,
			month: this.toIsoYearMonth(month),
			plannedMaxAmount,
		};

		return this.http.post<void>(this.vaultMonthBudgetsUrl, monthBudgetCreationRequest);
	}

	getBudgets(startDate: Date, endDate: Date): Observable<Budget> {
		const queryParams = new HttpParams()
			.set('startDate', startDate.toISOString())
			.set('endDate', endDate.toISOString());

		return this.http.get<Budget[]>(this.vaultbudgetsUrl, {params: queryParams})
			.mergeMap(budgets => Observable.from(budgets));
	}

	getMonthEverythingElseBudget(month: Date): Observable<Budget> {

		let monthIsoString = this.toIsoYearMonth(month);
		let url = this.vaultbudgetsUrl + `/month/${monthIsoString}/everythingElse`;

		return this.http.get<Budget>(url);
	}

	private toIsoYearMonth(date: Date): string {
		return this.datePipe.transform(date, 'y-MM');
	}
}
