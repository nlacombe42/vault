import {Injectable} from '@angular/core';

@Injectable()
export class StorageService {

	constructor() {
	}

	setAuthToken(authToken) {
		localStorage.setItem('authToken', authToken);
	}

	getAuthToken(): string {
		return localStorage.getItem('authToken');
	}
}
