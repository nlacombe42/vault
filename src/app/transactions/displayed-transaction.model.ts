import {Category} from "../categories/category.model";
import {Transaction} from "./transaction.model";

export interface DisplayedTransaction extends Transaction {
	dateOnly: Date;
	category: Category | undefined
}
