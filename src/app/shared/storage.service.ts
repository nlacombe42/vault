import {Injectable} from '@angular/core';

@Injectable()
export class StorageService {

	constructor() {
	}

	clearAuthToken() {
		localStorage.removeItem('authToken');
	}

	setAuthToken(authToken) {
		localStorage.setItem('authToken', authToken);
	}

	getAuthToken(): string {
		return localStorage.getItem('authToken');
	}
}
