import {MonthStats} from "./month-stats.model";
import {Budget, DisplayedBudget} from "./budget.model";

export class MonthBudgetsInfo {
	monthStats: MonthStats;
	incomeBudgets: Budget[];
	spendingBudgets: Budget[];
	unbudgeted: Budget;
}

export class DisplayedMonthBudgetsInfo {
	monthStats: MonthStats;
	incomeBudgets: DisplayedBudget[];
	spendingBudgets: DisplayedBudget[];
	unbudgeted: DisplayedBudget;
}
