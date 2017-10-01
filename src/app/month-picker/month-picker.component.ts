import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
	selector: 'month-picker',
	templateUrl: './month-picker.component.html',
	styleUrls: ['./month-picker.component.scss']
})
export class MonthPickerComponent implements OnInit {
	monthDate: Date;
	@Output() monthChange = new EventEmitter();

	constructor() {
	}

	ngOnInit() {
	}

	@Input()
	get month() {
		return this.monthDate;
	}

	set month(month) {
		this.monthDate = month;
		this.monthChange.emit(this.monthDate);
	}
}
