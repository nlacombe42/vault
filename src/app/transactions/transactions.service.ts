import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Transaction} from "./transaction.model";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/from";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/map";
import {PaginationResponse} from "../shared/pagination-response.model";
import {SearchTransactionsRequest} from "./search-transactions-request.model";
import {DisplayedTransaction} from "./displayed-transaction.model";
import {CategoriesService} from "../shared/categories.service";
import {ArrayUtils, Grouping} from "../shared/array.util";

@Injectable()
export class TransactionsService {
	private readonly vaultTransactionsUrl: string = environment.apiBaseUrls.vaultWs + '/v1/transactions/';
	private readonly vaultUncategorizedTransactionsUrl: string = this.vaultTransactionsUrl + 'uncategorized';
	private readonly vaultTransactionSearchUrl: string = this.vaultTransactionsUrl + 'search';
	private readonly vaultBudgetsUrl: string = environment.apiBaseUrls.vaultWs + '/v1/budgets/';

	constructor(private http: HttpClient, private categoriesService: CategoriesService) {
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

	searchDisplayedTransactionsByDate(pageNumber: number, pageSize: number): Observable<Grouping<Date, DisplayedTransaction>[]> {
		let searchRequest: SearchTransactionsRequest = {
			paginationRequest: {
				pageNumber,
				size: pageSize
			},
			categorizedOnly: true
		};

		return this.searchTransactions(searchRequest)
			.map(paginationResponse => paginationResponse.elements)
			.flatMap(transactions => Observable.from(transactions))
			.flatMap(transaction => this.toDisplayedTransaction(transaction))
			.toArray()
			.map(displayedTransactions => this.toDisplayedTransactionsByDate(displayedTransactions));
	}

	categorize(transactionId: number, categoryId: number): Observable<void> {
		let request = {categoryId};

		return this.http.put<void>(environment.apiBaseUrls.vaultWs + `/v1/transactions/${transactionId}/category`, request);
	}

	getBudgetDisplayedTransactionsByDate(budgetId: number): Observable<Grouping<Date, DisplayedTransaction>[]> {
		let url = this.vaultBudgetsUrl + budgetId + '/transactions';

		return this.http.get<any[]>(url)
			.mergeMap(rawTransactions => Observable.from(rawTransactions))
			.flatMap(rawTransaction => this.toDisplayedTransaction(this.toTransaction(rawTransaction)))
			.toArray()
			.map(displayedTransactions => this.toDisplayedTransactionsByDate(displayedTransactions));
	}

	getTransaction(transactionId: number): Observable<DisplayedTransaction> {
		let url = this.vaultTransactionsUrl + transactionId;

		return this.http.get<any>(url)
			.flatMap(rawTransaction => this.toDisplayedTransaction(this.toTransaction(rawTransaction)));
	}

	private toDisplayedTransactionsByDate(displayedTransactions: DisplayedTransaction[]): Grouping<Date, DisplayedTransaction>[] {
		return ArrayUtils.groupByField(displayedTransactions, 'dateOnly',
			displayedTransaction => displayedTransaction.dateOnly.getTime());
	}

	private toDisplayedTransaction(transaction: Transaction): Observable<DisplayedTransaction> {
		return this.categoriesService.getCategory(transaction.categoryId)
			.map(category => {
				return {
					transactionId: transaction.transactionId,
					accountId: transaction.accountId,
					categoryId: transaction.categoryId,
					category: category,
					datetime: transaction.datetime,
					description: transaction.description,
					amount: transaction.amount,
					dateOnly: new Date(transaction.datetime.toDateString())
				};
			});
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
