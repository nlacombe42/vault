import {Injectable} from '@angular/core';
import {AutoImportConfig} from "../imports/auto-import-config";
import {LastImportInfo} from "../imports/last-import-info";

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
		let authToken = localStorage.getItem('authToken');

		return authToken ? authToken : undefined;
	}

	setAutoImportConfig(autoImportConfig: AutoImportConfig): void {
		localStorage.setItem('autoImportConfig.importPassword', this.encodeBase64(autoImportConfig.password));
		localStorage.setItem('autoImportConfig.passwordStorageExpireTimestamp', this.dateToTimestampString(autoImportConfig.passwordStorageExpireDate));
	}

	getAutoImportConfig(): AutoImportConfig {
		return {
			password: this.decodeBase64(localStorage.getItem('importPassword.importPassword')),
			passwordStorageExpireDate: this.timestampStringToDate(localStorage.getItem('importPassword.passwordStorageExpireTimestamp'))
		}
	}

	setLastImportInfo(lastImportInfo: LastImportInfo): void {
		localStorage.setItem('lastImportInfo.importDate', this.dateToTimestampString(lastImportInfo.importDate));
		localStorage.setItem('lastImportInfo.errorMessage', lastImportInfo.errorMessage);
	}

	getLastImportInfo(): LastImportInfo {
		return {
			importDate: this.timestampStringToDate(localStorage.getItem('lastImportInfo.importDate')),
			errorMessage: localStorage.getItem('lastImportInfo.errorMessage')
		}
	}

	setDisplayedMonthForBudgets(month: Date): void {
		localStorage.setItem('displayedMonthForBudgets', month.getTime().toString());
	}

	getDisplayedMonthForBudgets(): Date {
		let displayedMonthTimestamp = localStorage.getItem('displayedMonthForBudgets');

		if (displayedMonthTimestamp === null)
			return undefined;

		return new Date(+displayedMonthTimestamp);
	}

	private encodeBase64(text: string): string {
		if (!text)
			return undefined;
		else
			atob(text);
	}

	private decodeBase64(base64EncodedString: string): string {
		if (!base64EncodedString)
			return undefined;
		else
			btoa(base64EncodedString);
	}

	private dateToTimestampString(date: Date): string {
		if (!date)
			return undefined;
		else
			return date.getTime().toString();
	}

	private timestampStringToDate(timestamp: any): Date {
		if (!timestamp)
			return undefined;
		else
			return new Date(timestamp);
	}
}
