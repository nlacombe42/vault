import {Pipe} from '@angular/core';
import {DatePipe} from "@angular/common";

@Pipe({
	name: 'localdate'
})
export class LocalDatePipe extends DatePipe {
	transform(date: Date, term: string): any {
		return super.transform(date, 'y-MM-dd');
	}
}
