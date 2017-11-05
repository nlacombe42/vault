import {MonthStats} from "./month-stats.model";
import {Budget} from "./budget.model";

export class MonthBudgetsInfo {
	monthStats: MonthStats;
	incomeBudgets: Budget[];
	spendingBudgets: Budget[];
	unbudgeted: Budget;
}
