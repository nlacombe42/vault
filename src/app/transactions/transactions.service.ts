import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Transaction} from "./transaction.model";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/from";
import "rxjs/add/observable/forkJoin";
import {PaginationResponse} from "../shared/pagination-response.model";
import {SearchTransactionsRequest} from "./search-transactions-request.model";
import {DisplayedTransaction} from "./displayed-transaction.model";
import {CategoriesService} from "../shared/categories.service";
import {ArrayUtils, Grouping} from "../shared/array.util";
import {map, mergeMap, toArray} from "rxjs/operators";

@Injectable()
export class TransactionsService {
	private readonly vaultTransactionsUrl: string = environment.apiBaseUrls.vaultWs + '/v1/transactions/';
	private readonly vaultUncategorizedTransactionsUrl: string = this.vaultTransactionsUrl + 'uncategorized';
	private readonly vaultTransactionSearchUrl: string = this.vaultTransactionsUrl + 'search';
	private readonly vaultBudgetsUrl: string = environment.apiBaseUrls.vaultWs + '/v1/budgets/';

	constructor(private http: HttpClient, private categoriesService: CategoriesService) {
	}

	getUncategorizedTransactions(): Observable<Transaction> {
		return this.http.get<any[]>(this.vaultUncategorizedTransactionsUrl)
			.pipe(
				mergeMap((rawTransactions: any[]) => Observable.from(rawTransactions)),
				map(rawTransaction => this.toTransaction(rawTransaction)));
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
						.pipe(
							map(rawTransaction => this.toTransaction(rawTransaction)),
							toArray())
						.subscribe((transactions: Transaction[]) => {
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
			.pipe(
				map((paginationResponse: PaginationResponse<Transaction>) => paginationResponse.elements),
				mergeMap((transactions: Transaction[]) => Observable.from(transactions)),
				mergeMap((transaction: Transaction) => this.toDisplayedTransaction(transaction)),
				toArray(),
				map((displayedTransactions: DisplayedTransaction[]) => this.toDisplayedTransactionsByDate(displayedTransactions)));
	}

	categorize(transactionId: number, categoryId: number): Observable<void> {
		let request = {categoryId};

		return this.http.put<void>(environment.apiBaseUrls.vaultWs + `/v1/transactions/${transactionId}/category`, request);
	}

	getBudgetDisplayedTransactionsByDate(budgetId: number): Observable<Grouping<Date, DisplayedTransaction>[]> {
		let url = this.vaultBudgetsUrl + budgetId + '/transactions';

		return this.http.get<any[]>(url)
			.pipe(mergeMap((rawTransactions: any[]) => this.rawTransactionToDisplayedTransactionsByDate(rawTransactions)));
	}

	getTransaction(transactionId: number): Observable<DisplayedTransaction> {
		let url = this.vaultTransactionsUrl + transactionId;

		return this.http.get<any>(url)
			.pipe(mergeMap((rawTransaction: any) => this.toDisplayedTransaction(this.toTransaction(rawTransaction))));
	}

	rawTransactionToDisplayedTransactionsByDate(rawTransactions: any[]): Observable<Grouping<Date, DisplayedTransaction>[]> {
		return Observable.forkJoin(rawTransactions.map(rawTransaction => this.rawTransactionToDisplayedTransaction(rawTransaction)))
			.pipe(map((displayedTransactions: DisplayedTransaction[]) => this.toDisplayedTransactionsByDate(displayedTransactions)));
	}

	rawTransactionToDisplayedTransaction(rawTransaction: any): Observable<DisplayedTransaction> {
		return this.toDisplayedTransaction(this.toTransaction(rawTransaction));
	}

	private toDisplayedTransactionsByDate(displayedTransactions: DisplayedTransaction[]): Grouping<Date, DisplayedTransaction>[] {
		return ArrayUtils.groupByField(displayedTransactions, 'dateOnly',
			displayedTransaction => displayedTransaction.dateOnly.getTime());
	}

	private toDisplayedTransaction(transaction: Transaction): Observable<DisplayedTransaction> {
		return this.categoriesService.getCategory(transaction.categoryId)
			.pipe(map(category => {
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
			}));
	}

	private toTransaction(rawTransaction: any): Transaction {
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
