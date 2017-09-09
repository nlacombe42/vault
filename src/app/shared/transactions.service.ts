import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Transaction} from "./transaction.model";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/from";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/map";

@Injectable()
export class TransactionsService {
	private readonly vaultUncategorizedTransactionsUrl: string = environment.apiBaseUrls.vaultWs + '/api/v1/transactions/uncategorized';

	constructor(private http: HttpClient) {
	}

	getUncategorizedTransactions(): Observable<Transaction> {
		return new Observable<Transaction>(observer => {
			this.http.get<any[]>(this.vaultUncategorizedTransactionsUrl)
				.mergeMap(rawTransactions => Observable.from(rawTransactions))
				.map(rawTransaction => {
					return this.toTransaction(rawTransaction);
				})
				.subscribe(transaction => {
					observer.next(transaction);
				}, (errorResponse: HttpErrorResponse) => {
					observer.error(errorResponse.error);
				}, () => {
					observer.complete();
				});
		});
	}

	private toTransaction(rawTransaction) {
		let transaction = new Transaction();
		transaction.accountId = rawTransaction.accountId;
		transaction.transactionId = rawTransaction.transactionId;
		transaction.datetime = new Date(rawTransaction.datetime * 1000);
		transaction.description = rawTransaction.description;
		transaction.amount = rawTransaction.amount;
		transaction.categoryId = rawTransaction.category;

		return transaction;
	}
}
