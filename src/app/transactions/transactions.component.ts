import {Component, Input, OnInit} from '@angular/core';
import {TransactionsService} from "./transactions.service";
import "rxjs/add/observable/merge";
import {Grouping} from "../shared/array.util";
import {DisplayedTransaction} from "./displayed-transaction.model";

@Component({
	selector: 'transactions',
	templateUrl: './transactions.component.html',
	styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

	transactionsByDate: Grouping<Date, DisplayedTransaction>[];

	private pageNumber: number;
	private readonly pageSize: number = 25;
	private transactionWereSpecified: boolean;

	constructor(private transactionService: TransactionsService) {
		this.transactionsByDate = [];
		this.pageNumber = 0;
		this.transactionWereSpecified = false;
	}

	ngOnInit() {
		if (this.transactionWereSpecified)
			return;

		this.fetchNextTransactionPage();
	}

	fetchNextTransactionPage(): void {
		if (this.transactionWereSpecified)
			return;

		this.transactionService.searchDisplayedTransactionsByDate(this.pageNumber, this.pageSize)
			.subscribe(transactionsByDate => {
				this.transactionsByDate = transactionsByDate;
				this.pageNumber++;
			});
	}

	@Input()
	set transactions(transactions: Grouping<Date, DisplayedTransaction>[]) {
		this.transactionsByDate = transactions;
		this.transactionWereSpecified = transactions !== undefined;
	}
}
