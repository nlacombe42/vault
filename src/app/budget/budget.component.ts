import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
	selector: 'budget',
	templateUrl: './budget.component.html',
	styleUrls: ['./budget.component.scss']
})
export class BudgetComponent implements OnInit {

	budgetId: number;

	constructor(private route: ActivatedRoute) {
	}

	ngOnInit() {
		this.budgetId = +this.route.snapshot.paramMap.get('budgetId');
	}
}
