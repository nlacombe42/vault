import {Component, OnInit} from '@angular/core';
import {Transaction} from "../shared/transaction.model";
import {TransactionsService} from "../shared/transactions.service";
import "rxjs/add/operator/toArray";
import "rxjs/add/operator/do";
import "rxjs/add/operator/take";
import "rxjs/add/observable/merge";
import {ArrayUtils, Grouping} from "../shared/array.util";
import {SearchTransactionsRequest} from "../shared/search-transactions-request.model";
import {CategoriesService} from "../shared/categories.service";
import {Observable} from "rxjs/Observable";
import {Category} from "../shared/category.model";

class DisplayedTransaction extends Transaction {
	dateOnly: Date;
	category: Category
}

@Component({
	selector: 'transactions',
	templateUrl: './transactions.component.html',
	styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

	transactionsByDate: Grouping<Date, DisplayedTransaction>[];
	private displayedTransactions: DisplayedTransaction[];
	private pageNumber: number;
	private readonly pageSize: number = 25;

	constructor(private transactionService: TransactionsService, private categoriesService: CategoriesService) {
		this.transactionsByDate = [];
		this.displayedTransactions = [];
		this.pageNumber = 0;
	}

	ngOnInit() {
		this.fetchMoreTransactions();
	}

	fetchMoreTransactions() {
		let pageTransactions: Transaction[];

		let searchRequest: SearchTransactionsRequest = {
			paginationRequest: {
				pageNumber: this.pageNumber,
				size: this.pageSize
			},
			categorizedOnly: true
		};

		this.transactionService.searchTransactions(searchRequest)
			.subscribe(paginationResponse => {
				pageTransactions = paginationResponse.elements;
				this.pageNumber++;
			}, undefined, () => {
				this.toDisplayedTransactions(pageTransactions)
					.subscribe(displayedTransaction => this.displayedTransactions.push(displayedTransaction),
						undefined,
						() => {
							this.transactionsByDate =
								ArrayUtils.groupByField(this.displayedTransactions, 'dateOnly',
									displayedTransaction => displayedTransaction.dateOnly.getTime());
						});
			});
	}

	private toDisplayedTransactions(transactions: Transaction[]): Observable<DisplayedTransaction> {
		let conversionObservables: Observable<DisplayedTransaction>[] = [];

		transactions.forEach(transaction => {
			conversionObservables.push(this.toDisplayedTransaction(transaction));
		});

		return Observable.merge(...conversionObservables);
	}

	private toDisplayedTransaction(transaction: Transaction): Observable<DisplayedTransaction> {
		return new Observable<DisplayedTransaction>(observer => {
			this.categoriesService.getCategory(transaction.categoryId)
				.subscribe(category => {
					let displayedTransaction: DisplayedTransaction = {
						transactionId: transaction.transactionId,
						accountId: transaction.accountId,
						categoryId: transaction.categoryId,
						category: category,
						datetime: transaction.datetime,
						description: transaction.description,
						amount: transaction.amount,
						dateOnly: new Date(transaction.datetime.toDateString())
					};

					observer.next(displayedTransaction);
					observer.complete();
				});
		});
	}
}
