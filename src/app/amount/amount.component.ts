import {Component, Input, OnInit} from '@angular/core';

@Component({
	selector: 'amount',
	styles: [`
		.amount-green {
			color: #080;
		}
	`],
	template: `
		<span [ngClass]="{'amount-green': amount > 0}">
			{{amount | number:'1.2-2'}}
		</span>
	`
})
export class AmountComponent implements OnInit {

	@Input()
	amount: number;

	constructor() {
	}

	ngOnInit() {
	}
}
