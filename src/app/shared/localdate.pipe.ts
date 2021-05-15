import {Pipe} from '@angular/core';
import {DatePipe} from "@angular/common";

@Pipe({
    name: 'localdate'
})
export class LocalDatePipe {

    constructor(private datePipe: DatePipe) {
    }

    transform(value: Date): string | null {
        return this.datePipe.transform(value, 'y-MM-dd');
    }
}
