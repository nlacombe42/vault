import {Category} from "../categories/category.model";
import {DisplayedTransaction} from "../transactions/displayed-transaction.model";
import {Grouping} from "../shared/array.util";

export class Budget {
	budgetId: number;
	categoryId: number;
	startDate: Date;
	endDate: Date;
	plannedMaxAmount: number;
	currentAmount: number;
	income: boolean;
	investment: boolean;
}

export class DisplayedBudget extends Budget {
	category: Category;
}

export class BudgetWithTransactions extends DisplayedBudget {
	transactionsByDate: Grouping<Date, DisplayedTransaction>[];
}

export class BudgetUpdateRequest {
	plannedMaxAmount: number;
	income: boolean;
	investment: boolean;
}
