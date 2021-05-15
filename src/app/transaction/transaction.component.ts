import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute} from "@angular/router";
import {TransactionsService} from "../transactions/transactions.service";
import {DisplayedTransaction} from "../transactions/displayed-transaction.model";
import {Category} from "../categories/category.model";
import {CategoriesService} from "../categories/categories.service";
import {Transaction} from "../transactions/transaction.model";

@Component({
	selector: 'transaction',
	templateUrl: './transaction.component.html',
	styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {

	transaction: DisplayedTransaction | undefined;
	selectedCategoryId: string | number | undefined;
	categories: Category[];

	constructor(private route: ActivatedRoute, private location: Location,
				private transactionsService: TransactionsService,
				private categoriesService: CategoriesService) {

		this.categories = [];
	}

	ngOnInit() {
        const transactionIdParam = this.route.snapshot.paramMap.get('transactionId');

        if (!transactionIdParam) {
            throw 'required param transactionId not found';
        }

        let transactionId: number = + transactionIdParam;
		this.transactionsService.getTransaction(transactionId)
			.subscribe(transaction => {
				this.transaction = transaction;
				this.selectedCategoryId = this.transaction.category === undefined ? 'uncategorized' : this.transaction.category.categoryId;
			});
		this.categoriesService.getUserCategories()
			.subscribe(category => this.categories.push(category),
				undefined,
				() => this.categories = this.categories.sort(((a, b) => b.numberOfUses - a.numberOfUses)));
	}

	categorizeTransaction(transaction: Transaction, categoryId: string | number): void {
		if (typeof categoryId === 'number')
			this.transactionsService.categorize(transaction.transactionId, categoryId).subscribe();
	}

	deleteTransaction(transaction: Transaction) {
		this.transactionsService.deleteTransaction(transaction.transactionId)
			.subscribe(undefined, undefined, () => {
				this.location.back();
			});
	}
}
