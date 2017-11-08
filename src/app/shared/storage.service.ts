import {Injectable} from '@angular/core';
import {ImportPassword} from "../imports/import-password";

@Injectable()
export class StorageService {

	constructor() {
	}

	clearAuthToken(): void {
		localStorage.removeItem('authToken');
	}

	setAuthToken(authToken: string): void {
		localStorage.setItem('authToken', authToken);
	}

	getAuthToken(): string {
		return localStorage.getItem('authToken');
	}

	setImportPassword(importPassword: ImportPassword): void {
		localStorage.setItem('importPassword.importPassword', atob(importPassword.password));
		localStorage.setItem('importPassword.passwordStorageExpireTimestamp', importPassword.passwordStorageExpireDate.getTime().toString());
	}

	getImportPassword(): ImportPassword {
		if (localStorage.getItem('importPassword.importPassword') === undefined)
			return undefined;

		return {
			password: btoa(localStorage.getItem('importPassword.importPassword')),
			passwordStorageExpireDate: new Date(localStorage.getItem('importPassword.passwordStorageExpireTimestamp'))
		}
	}

	clearImportPassword(): void {
		localStorage.removeItem('importPassword.importPassword');
		localStorage.removeItem('importPassword.passwordStorageExpireTimestamp');
	}
}
