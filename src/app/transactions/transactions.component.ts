import {Component, OnInit} from '@angular/core';
import {TransactionsService} from "./transactions.service";
import "rxjs/add/operator/toArray";
import "rxjs/add/operator/do";
import "rxjs/add/operator/take";
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

	constructor(private transactionService: TransactionsService) {
		this.transactionsByDate = [];
		this.pageNumber = 0;
	}

	ngOnInit() {
		this.fetchMoreTransactions();
	}

	fetchMoreTransactions() {
		this.transactionService.searchDisplayedTransactionsByDate(this.pageNumber, this.pageSize)
			.subscribe(transactionsByDate => {
				this.transactionsByDate = transactionsByDate;
				this.pageNumber++;
			});
	}
}
