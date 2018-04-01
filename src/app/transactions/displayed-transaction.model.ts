import {Category} from "../categories/category.model";
import {Transaction} from "./transaction.model";

export class DisplayedTransaction extends Transaction {
	dateOnly: Date;
	category: Category
}
