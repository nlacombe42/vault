
export class Transaction {
	transactionId: number;
	accountId: number;
	categoryId: number;
	datetime: Date;
	description: string;
	amount: number;
	temporary: boolean;
	parentTransactionId: number;
}
