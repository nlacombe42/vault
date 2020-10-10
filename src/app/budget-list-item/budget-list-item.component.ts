import {Component, Input} from '@angular/core';

@Component({
	selector: 'budget-list-item',
	templateUrl: './budget-list-item.component.html',
	styleUrls: ['./budget-list-item.component.scss']
})
export class BudgetListItemComponent {

	@Input()
	name: string;

	@Input()
	currentAmount: number;

	@Input()
	plannedMaxAmount: number;

	@Input()
	routerLink: any[];

	@Input()
	income: boolean = false;

	constructor() {
	}
}
