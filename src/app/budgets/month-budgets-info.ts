import {MonthStats} from "./month-stats.model";
import {Budget, DisplayedBudget} from "./budget.model";

export interface MonthBudgetsInfo {
	monthStats: MonthStats;
	incomeBudgets: Budget[];
	spendingBudgets: Budget[];
	unbudgeted: Budget;
}

export interface DisplayedMonthBudgetsInfo {
	monthStats: MonthStats;
	incomeBudgets: DisplayedBudget[];
	spendingBudgets: DisplayedBudget[];
	unbudgeted: DisplayedBudget;
}
