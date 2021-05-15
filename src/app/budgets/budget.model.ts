import {Category} from "../categories/category.model";
import {DisplayedTransaction} from "../transactions/displayed-transaction.model";
import {Grouping} from "../shared/array.util";

export interface Budget {
	budgetId: number;
	categoryId: number | undefined;
	startDate: Date;
	endDate: Date;
	plannedMaxAmount: number;
	currentAmount: number;
	income: boolean;
	investment: boolean;
}

export interface DisplayedBudget extends Budget {
	category: Category | undefined;
}

export interface BudgetWithTransactions extends DisplayedBudget {
	transactionsByDate: Grouping<Date, DisplayedTransaction>[];
}

export interface BudgetUpdateRequest {
	plannedMaxAmount: number;
	income: boolean;
	investment: boolean;
}
