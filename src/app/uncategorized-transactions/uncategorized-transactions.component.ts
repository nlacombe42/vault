import {Component, OnInit} from '@angular/core';
import {Transaction} from "../shared/transaction.model";
import {TransactionsService} from "../shared/transactions.service";
import "rxjs/add/operator/toArray";
import "rxjs/add/operator/do";
import "rxjs/add/operator/take";
import {Category} from "../shared/category.model";
import {CategoriesService} from "../shared/categories.service";
import {ArrayUtils, Grouping} from "../shared/array.util";

class DisplayedTransaction extends Transaction {
	dateOnly: Date
}

@Component({
	selector: 'uncategorized-transactions',
	templateUrl: './uncategorized-transactions.component.html',
	styleUrls: ['./uncategorized-transactions.component.scss']
})
export class UncategorizedTransactionsComponent implements OnInit {

	categories: Category[];
	transactionsByDate: Grouping<Date, DisplayedTransaction>[];

	constructor(private transactionService: TransactionsService, private categoriesService: CategoriesService) {
		this.categories = [];
		this.transactionsByDate = [];
	}

	ngOnInit() {
		this.categoriesService.getUserCategories()
			.subscribe(category => this.categories.push(category));

		let displayedTransactions: DisplayedTransaction[] = [];

		this.transactionService.getUncategorizedTransactions()
			.subscribe(transaction => {
				displayedTransactions.push(this.toDisplayedTransaction(transaction));
			}, undefined, () => {
				this.transactionsByDate = ArrayUtils.groupByField(displayedTransactions, 'dateOnly',
					displayedTransaction => displayedTransaction.dateOnly.getTime());
			});
	}

	private toDisplayedTransaction(transaction: Transaction): DisplayedTransaction {
		let displayedTransaction = new DisplayedTransaction();

		displayedTransaction.transactionId = transaction.transactionId;
		displayedTransaction.accountId = transaction.accountId;
		displayedTransaction.categoryId = transaction.categoryId;
		displayedTransaction.datetime = transaction.datetime;
		displayedTransaction.description = transaction.description;
		displayedTransaction.amount = transaction.amount;
		displayedTransaction.dateOnly = new Date(transaction.datetime.toDateString());

		return displayedTransaction;
	}
}
