import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import "rxjs/add/observable/from";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/map";
import {Budget} from "./budget.model";
import {Observable} from "rxjs/Observable";

@Injectable()
export class BudgetsService {
	private readonly vaultbudgetsUrl: string = environment.apiBaseUrls.vaultWs + '/v1/budgets';

	constructor(private http: HttpClient) {
	}

	createBudget(budget: Budget): Observable<void> {
		return this.http.post<void>(this.vaultbudgetsUrl, budget);
	}

	getBudgets(startDate: Date, endDate: Date): Observable<Budget> {
		const queryParams = new HttpParams()
			.set('startDate', startDate.toISOString())
			.set('endDate', endDate.toISOString());

		return this.http.get<Budget[]>(this.vaultbudgetsUrl, {params: queryParams})
			.mergeMap(budgets => Observable.from(budgets));
	}
}
