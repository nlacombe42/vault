import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Transaction} from "./transaction.model";
import {forkJoin, from, Observable} from "rxjs";
import {PaginationResponse} from "../shared/pagination-response.model";
import {SearchTransactionsRequest} from "./search-transactions-request.model";
import {DisplayedTransaction} from "./displayed-transaction.model";
import {CategoriesService} from "../categories/categories.service";
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
				mergeMap((rawTransactions: any[]) => from(rawTransactions)),
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
					from(rawPaginationResponse.elements)
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
				mergeMap((transactions: Transaction[]) => from(transactions)),
				mergeMap((transaction: Transaction) => this.toDisplayedTransaction(transaction)),
				toArray(),
				map((displayedTransactions: DisplayedTransaction[]) => this.toDisplayedTransactionsByDate(displayedTransactions)));
	}

	categorize(transactionId: number, categoryId: number): Observable<void> {
		let request = {categoryId};

		return this.http.put<void>(environment.apiBaseUrls.vaultWs + `/v1/transactions/${transactionId}/category`, request);
	}

	deleteTransaction(transactionId: number): Observable<void> {
		let url = this.vaultTransactionsUrl + transactionId;

		return this.http.delete<any>(url);
	}

	getTransaction(transactionId: number): Observable<DisplayedTransaction> {
		let url = this.vaultTransactionsUrl + transactionId;

		return this.http.get<any>(url)
			.pipe(mergeMap((rawTransaction: any) => this.toDisplayedTransaction(this.toTransaction(rawTransaction))));
	}

	rawTransactionToDisplayedTransactionsByDate(rawTransactions: any[]): Observable<Grouping<Date, DisplayedTransaction>[]> {
		let displayedTransactionsObservables = rawTransactions.map(rawTransaction => this.rawTransactionToDisplayedTransaction(rawTransaction));

		return forkJoin(displayedTransactionsObservables)
			.pipe(map((displayedTransactions: DisplayedTransaction[]) => this.toDisplayedTransactionsByDate(displayedTransactions)));
	}

	rawTransactionToDisplayedTransaction(rawTransaction: any): Observable<DisplayedTransaction> {
		return this.toDisplayedTransaction(this.toTransaction(rawTransaction));
	}

	private toDisplayedTransactionsByDate(displayedTransactions: DisplayedTransaction[]): Grouping<Date, DisplayedTransaction>[] {
		let displayedTransactionsByDate = ArrayUtils.groupByField(displayedTransactions, 'dateOnly',
			displayedTransaction => displayedTransaction.dateOnly.getTime());

		displayedTransactionsByDate = displayedTransactionsByDate.sort(function (transactionGroup1, transactionGroup2) {
			return transactionGroup2.key - transactionGroup1.key;
		});

		return displayedTransactionsByDate;
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
					temporary: transaction.temporary,
					dateOnly: new Date(transaction.datetime.toDateString())
				};
			}));
	}

	private toTransaction(rawTransaction: any): Transaction {
		return {
			accountId: rawTransaction.accountId,
			transactionId: rawTransaction.transactionId,
			datetime: new Date(rawTransaction.datetime * 1000),
			description: rawTransaction.description,
			amount: rawTransaction.amount,
			categoryId: rawTransaction.categoryId,
			temporary: rawTransaction.temporary
		};
	}
}
