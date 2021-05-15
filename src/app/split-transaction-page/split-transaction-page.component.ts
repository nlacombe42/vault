import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute} from "@angular/router";
import {TransactionsService} from "../transactions/transactions.service";
import {DisplayedTransaction} from "../transactions/displayed-transaction.model";
import {Observable} from "rxjs";
import {SplitChildTransactionRequest} from "../shared/vault-ws-server.model";
import {isRestException} from "../shared/rest-exception.model";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
    selector: 'split-transaction-page',
    templateUrl: './split-transaction-page.component.html',
    styleUrls: ['./split-transaction-page.component.scss']
})
export class SplitTransactionPageComponent {

    public transactionObservable: Observable<DisplayedTransaction | undefined>;
    public childTransactions: SplitChildTransactionRequest[];
    public errorMessage: string | undefined;

    private readonly transactionId: number;

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        private transactionsService: TransactionsService,
    ) {
        const transactionIdParam = this.route.snapshot.paramMap.get('transactionId');

        if (!transactionIdParam) {
            throw 'required param transactionId not found';
        }

        this.transactionId = +transactionIdParam;

        this.transactionObservable = this.transactionsService.getTransaction(this.transactionId);
        this.childTransactions = [];
        this.addChildTransaction();
    }

    public splitTransaction(childTransactions: SplitChildTransactionRequest[]) {
        this.transactionsService.splitTransaction({
            transactionId: this.transactionId,
            childTransactions: childTransactions
        }).subscribe({
            complete: () => {
                window.history.go(-2);
            },
            error: error => this.errorMessage = error instanceof HttpErrorResponse && isRestException(error.error) ? error.error.message : 'unknown error'
        });
    }

    public addChildTransaction() {
        this.childTransactions.push(SplitTransactionPageComponent.getDefaultChildTransaction());
    }

    private static getDefaultChildTransaction(): SplitChildTransactionRequest {
        return {
            description: '',
            amount: 0
        };
    }
}
