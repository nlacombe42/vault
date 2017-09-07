import {Component, OnInit} from '@angular/core';
import {Transaction} from "../shared/transaction.model";
import {TransactionsService} from "../shared/transactions.service";
import "rxjs/add/operator/toArray";
import "rxjs/add/operator/do";
import "rxjs/add/operator/take";
import {MdDialog} from "@angular/material";
import {SelectCategoryDialog} from "../select-category-dialog/select-category-dialog.component";

class DisplayedTransaction extends Transaction {
	dateOnly: Date
}

@Component({
	selector: 'uncategorized-transactions',
	templateUrl: './uncategorized-transactions.component.html',
	styleUrls: ['./uncategorized-transactions.component.scss']
})
export class UncategorizedTransactionsComponent implements OnInit {
	transactions: Transaction[];
	displayedTransactions: DisplayedTransaction[];

	constructor(private transactionService: TransactionsService, private selectCategoryDialog: MdDialog) {
		this.transactions = [];
		this.displayedTransactions = [];
	}

	ngOnInit() {
		this.transactionService.getUncategorizedTransactions()
			.subscribe(transaction => {
				this.transactions.push(transaction);

				this.displayedTransactions.push(this.toDisplayedTransaction(transaction));
			});
	}

	openSelectCategoryDialog() {
		let dialogRef = this.selectCategoryDialog.open(SelectCategoryDialog, {
			width: '250px'
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log('The dialog was closed. result:', result);
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
