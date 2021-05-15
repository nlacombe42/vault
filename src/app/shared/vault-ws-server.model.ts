export interface SplitTransactionRequest {
    transactionId: number;
    childTransactions: SplitChildTransactionRequest[];
}

export interface SplitChildTransactionRequest {
    description: string;
    amount: number;
}
