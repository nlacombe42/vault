import {Component, OnInit} from '@angular/core';
import {Transaction} from "../transactions/transaction.model";
import {TransactionsService} from "../transactions/transactions.service";
import {Category} from "../categories/category.model";
import {CategoriesService} from "../categories/categories.service";
import {ArrayUtils, Grouping} from "../shared/array.util";
import {Router} from "@angular/router";
import {EventService, EventType} from "../shared/event.service";

class DisplayedTransaction extends Transaction {
	dateOnly: Date;
}

@Component({
	selector: 'uncategorized-transactions',
	templateUrl: './uncategorized-transactions.component.html',
	styleUrls: ['./uncategorized-transactions.component.scss']
})
export class UncategorizedTransactionsComponent implements OnInit {

	categories: Category[];
	transactionsByDate: Grouping<Date, DisplayedTransaction>[];

	constructor(private transactionService: TransactionsService, private categoriesService: CategoriesService,
				private router: Router, private eventService: EventService) {

		this.categories = [];
		this.transactionsByDate = [];
	}

	ngOnInit() {
		this.categoriesService.getUserCategories()
			.subscribe(category => this.categories.push(category),
				undefined,
				() => {
					this.categories = this.categories.slice(0);
				});

		this.refreshDisplayedTransactions();

		this.eventService.getEventObservableForType(EventType.TRANSACTION_IMPORT_FINISHED).subscribe(() => {
			this.refreshDisplayedTransactions();
		});
	}

	categorizeTransaction(transaction: Transaction, categoryId: number) {
		this.transactionService.categorize(transaction.transactionId, categoryId)
			.subscribe(undefined, undefined, () => {
				this.refreshDisplayedTransactions();
			});
	}

	goToTransactionDetail(transactionId: number): void {
		this.router.navigate(['transaction', transactionId]);
	}

	private refreshDisplayedTransactions() {
		let displayedTransactions: DisplayedTransaction[] = [];

		this.transactionService.getUncategorizedTransactions()
			.subscribe(transaction => {
				displayedTransactions.push(this.toDisplayedTransaction(transaction));
			}, undefined, () => {
				let transactionsByDate = ArrayUtils.groupByField(displayedTransactions, 'dateOnly',
					displayedTransaction => displayedTransaction.dateOnly.getTime());

				this.transactionsByDate = transactionsByDate.sort(function (grouping1, grouping2) {
					return grouping1.key - grouping2.key;
				});
			});
	}

	private toDisplayedTransaction(transaction: Transaction): DisplayedTransaction {
		return {
			transactionId: transaction.transactionId,
			accountId: transaction.accountId,
			categoryId: transaction.categoryId,
			datetime: transaction.datetime,
			description: transaction.description,
			amount: transaction.amount,
			dateOnly: new Date(transaction.datetime.toDateString()),
			temporary: transaction.temporary
		};
	}
}
