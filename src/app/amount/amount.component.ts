import {Component, Input, OnInit} from '@angular/core';

@Component({
	selector: 'amount',
	templateUrl: './amount.component.html',
	styleUrls: ['./amount.component.scss']
})
export class AmountComponent implements OnInit {

	@Input()
	amount: number = 0;

	constructor() {
	}

	ngOnInit() {
	}
}
