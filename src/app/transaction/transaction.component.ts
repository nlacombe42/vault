import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {TransactionsService} from "../transactions/transactions.service";
import {DisplayedTransaction} from "../transactions/displayed-transaction.model";
import {Category} from "../shared/category.model";
import {CategoriesService} from "../shared/categories.service";
import {Transaction} from "../transactions/transaction.model";

@Component({
	selector: 'transaction',
	templateUrl: './transaction.component.html',
	styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {

	transaction: DisplayedTransaction;
	selectedCategoryId: string | number;
	categories: Category[];

	constructor(private route: ActivatedRoute, private transactionsService: TransactionsService,
				private categoriesService: CategoriesService) {
		this.categories = [];
	}

	ngOnInit() {
		let transactionId: number = +this.route.snapshot.paramMap.get('transactionId');
		this.transactionsService.getTransaction(transactionId)
			.subscribe(transaction => {
				this.transaction = transaction;
				this.selectedCategoryId = this.transaction.category === undefined ? 'uncategorized' : this.transaction.category.categoryId;
			});
		this.categoriesService.getUserCategories()
			.subscribe(category => this.categories.push(category),
				undefined,
				() => this.categories = this.categories.splice(0));
	}

	categorizeTransaction(transaction: Transaction, categoryId: string | number): void {
		if (typeof categoryId === 'number')
			this.transactionsService.categorize(transaction.transactionId, categoryId).subscribe();
	}
}
