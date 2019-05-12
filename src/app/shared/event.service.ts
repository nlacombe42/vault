import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {filter, map} from "rxjs/operators";

export enum EventType {
	USER_LOGGED_IN = 'userLoggedIn',
	TRANSACTION_IMPORT_FINISHED = 'transactionImportFinished'
}

export class Event {
	constructor(public eventType: EventType) {}
}

@Injectable()
export class EventService {
	private eventSubject: Subject<Event>;

	constructor() {
		this.eventSubject = new Subject();
	}

	publish(event: Event): void {
		this.eventSubject.next(event);
	}

	getEventObservableForType(eventType: EventType): Observable<Event> {
		return this.eventSubject.asObservable()
			.pipe(filter(event => event.eventType === eventType));
	}
}
