export interface MonthBudgetCreationRequest {
	categoryId: number;
	month: string;
	plannedMaxAmount: number;
	income: boolean;
	investment: boolean;
}
