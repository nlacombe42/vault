import {Component, Input} from '@angular/core';

@Component({
	selector: 'budget-list-item',
	templateUrl: './budget-list-item.component.html',
	styleUrls: ['./budget-list-item.component.scss']
})
export class BudgetListItemComponent {

	@Input()
	name: string = '';

	@Input()
	currentAmount: number = 0;

	@Input()
	plannedMaxAmount: number = 0;

	@Input()
	routerLink: any[] = [];

	@Input()
	income: boolean = false;

	constructor() {
	}
}
