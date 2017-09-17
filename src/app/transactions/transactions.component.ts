import {Component, OnInit} from '@angular/core';
import {Transaction} from "../shared/transaction.model";
import {TransactionsService} from "../shared/transactions.service";
import "rxjs/add/operator/toArray";
import "rxjs/add/operator/do";
import "rxjs/add/operator/take";
import {ArrayUtils, Grouping} from "../shared/array.util";
import {SearchTransactionsRequest} from "../shared/search-transactions-request.model";
import {Category} from "../shared/category.model";
import {CategoriesService} from "../shared/categories.service";

class DisplayedTransaction extends Transaction {
	dateOnly: Date;
	categoryName: string;
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
	private categories: Map<number, Category>;

	constructor(private transactionService: TransactionsService, private categoriesService: CategoriesService) {
		this.transactionsByDate = [];
		this.displayedTransactions = [];
		this.pageNumber = 0;
		this.categories = new Map();
	}

	ngOnInit() {
		this.categoriesService.getUserCategories()
			.subscribe(category => {
				this.categories.set(category.categoryId, category);
			}, error => {
				console.error('Error getting categories', error);
			}, () => {
				this.fetchMoreTransactions();
			});
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
				let pageDisplayedTransactions = pageTransactions.map(transaction => this.toDisplayedTransaction(transaction));
				this.displayedTransactions = this.displayedTransactions.concat(pageDisplayedTransactions);

				this.transactionsByDate =
					ArrayUtils.groupByField(this.displayedTransactions, 'dateOnly',
						displayedTransaction => displayedTransaction.dateOnly.getTime());
			});
	}

	private toDisplayedTransaction(transaction: Transaction): DisplayedTransaction {
		let displayedTransaction = new DisplayedTransaction();

		displayedTransaction.transactionId = transaction.transactionId;
		displayedTransaction.accountId = transaction.accountId;
		displayedTransaction.categoryId = transaction.categoryId;
		displayedTransaction.categoryName = this.getCategoryName(transaction);
		displayedTransaction.datetime = transaction.datetime;
		displayedTransaction.description = transaction.description;
		displayedTransaction.amount = transaction.amount;
		displayedTransaction.dateOnly = new Date(transaction.datetime.toDateString());

		return displayedTransaction;
	}

	private getCategoryName(transaction: Transaction): string {
		let category = this.categories.get(transaction.categoryId);

		return category === undefined ? undefined : category.name;
	}
}
