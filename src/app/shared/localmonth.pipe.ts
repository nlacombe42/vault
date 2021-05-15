import {Pipe} from '@angular/core';
import {DatePipe} from "@angular/common";

@Pipe({
    name: 'localmonth'
})
export class LocalMonthPipe {

    constructor(private datePipe: DatePipe) {
    }

    transform(date: Date): any {
        return this.datePipe.transform(date, 'y-MM');
    }
}
