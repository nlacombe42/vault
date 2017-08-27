import {Pipe} from '@angular/core';
import {DatePipe} from "@angular/common";

@Pipe({
	name: 'localdate'
})
export class LocalDatePipe extends DatePipe {
	transform(dates: Date, term: string): any {
		return super.transform(dates, 'y-MM-dd');
	}
}
