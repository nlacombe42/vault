import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DateUtils} from "../shared/date.util";

@Component({
	selector: 'month-picker',
	templateUrl: './month-picker.component.html',
	styleUrls: ['./month-picker.component.scss']
})
export class MonthPickerComponent implements OnInit {
	monthDate: Date = new Date();
	@Output() monthChange = new EventEmitter();

	constructor() {
	}

	ngOnInit() {
	}

	previous() {
		let previousMonth = this.month;
		previousMonth.setMonth(this.month.getMonth() - 1);

		this.month = previousMonth;
	}

	next() {
		let nextMonth = this.month;
		nextMonth.setMonth(this.month.getMonth() + 1);

		this.month = nextMonth;
	}

	@Input()
	get month(): Date {
		return this.monthDate;
	}

	set month(month: Date) {
		this.monthDate = DateUtils.getFirstSecondOfMonth(month);
		this.monthChange.emit(this.monthDate);
	}
}
