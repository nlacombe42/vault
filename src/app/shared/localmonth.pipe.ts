import {Pipe} from '@angular/core';
import {DatePipe} from "@angular/common";

@Pipe({
	name: 'localmonth'
})
export class LocalMonthPipe extends DatePipe {
	transform(date: Date, term: string): any {
		return super.transform(date, 'y-MM');
	}
}
