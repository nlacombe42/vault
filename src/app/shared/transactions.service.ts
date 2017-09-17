import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Transaction} from "./transaction.model";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/from";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/map";
import {PaginationResponse} from "./pagination-response.model";
import {SearchTransactionsRequest} from "./search-transactions-request.model";

@Injectable()
export class TransactionsService {
	private readonly vaultUncategorizedTransactionsUrl: string = environment.apiBaseUrls.vaultWs + '/v1/transactions/uncategorized';
	private readonly vaultTransactionSearchUrl: string = environment.apiBaseUrls.vaultWs + '/v1/transactions/search';

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

	searchTransactions(searchRequest: SearchTransactionsRequest): Observable<PaginationResponse<Transaction>> {
		return new Observable<PaginationResponse<Transaction>>(observer => {
			let rawPaginationResponse: PaginationResponse<any>;

			this.http.post<PaginationResponse<any>>(this.vaultTransactionSearchUrl, searchRequest)
				.subscribe(response => {
					rawPaginationResponse = response;
				}, (errorResponse: HttpErrorResponse) => {
					observer.error(errorResponse.error);
				}, () => {
					Observable.from(rawPaginationResponse.elements)
						.map(rawTransaction => {
							return this.toTransaction(rawTransaction);
						})
						.toArray()
						.subscribe(transactions => {
							observer.next(new PaginationResponse<Transaction>(rawPaginationResponse.paginationRequest, rawPaginationResponse.total, transactions));
						}, undefined, () => {
							observer.complete();
						});
				});
		});
	}

	categorize(transactionId: number, categoryId: number): Observable<void> {
		let request = {categoryId};

		return this.http.put<void>(environment.apiBaseUrls.vaultWs + `/v1/transactions/${transactionId}/category`, request);
	}

	private toTransaction(rawTransaction) {
		let transaction = new Transaction();
		transaction.accountId = rawTransaction.accountId;
		transaction.transactionId = rawTransaction.transactionId;
		transaction.datetime = new Date(rawTransaction.datetime * 1000);
		transaction.description = rawTransaction.description;
		transaction.amount = rawTransaction.amount;
		transaction.categoryId = rawTransaction.categoryId;

		return transaction;
	}
}
