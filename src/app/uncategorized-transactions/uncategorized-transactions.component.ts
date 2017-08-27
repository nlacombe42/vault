import {Component, OnInit} from '@angular/core';
import {Transaction} from "../shared/transaction.model";
import {TransactionsService} from "../shared/transactions.service";
import {DataSource} from "@angular/cdk";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/toArray";
import "rxjs/add/operator/do";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import "rxjs/add/operator/take";

@Component({
	selector: 'uncategorized-transactions',
	templateUrl: './uncategorized-transactions.component.html',
	styleUrls: ['./uncategorized-transactions.component.scss']
})
export class UncategorizedTransactionsComponent implements OnInit {

	displayedColumns = ['datetime', 'description', 'amount'];
	dataSource: ExampleDataSource;
	dataChange: BehaviorSubject<Transaction[]> = new BehaviorSubject<Transaction[]>([]);

	constructor(private transactionService: TransactionsService) {
		this.dataSource = new ExampleDataSource(this.dataChange);
	}

	ngOnInit() {
		this.transactionService.getUncategorizedTransactions().take(25).toArray()
			.subscribe(transactions => {
				this.dataChange.next(transactions);
			});
	}
}

class ExampleDataSource extends DataSource<Transaction> {
	constructor(private dataChange: BehaviorSubject<Transaction[]>) {
		super();
	}

	connect(): Observable<Transaction[]> {
		return this.dataChange;
	}

	disconnect() {
	}
}
