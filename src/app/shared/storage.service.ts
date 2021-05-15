import {Injectable} from '@angular/core';
import {AutoImportConfig} from "../imports/auto-import-config";
import {LastImportInfo} from "../imports/last-import-info";
import {getValueOrThrowIfFalsy} from "./lang.util";

@Injectable()
export class StorageService {

	private static AUTO_IMPORT_CONFIG_PASSWORD_KEY = "autoImportConfig.importPassword";
	private static AUTO_IMPORT_CONFIG_EXPIRY_KEY = "autoImportConfig.passwordStorageExpireTimestamp";
	private static LAST_IMPORT_DATE_KEY = "lastImportInfo.importDate";
	private static LAST_IMPORT_MESSAGE_KEY = "lastImportInfo.errorMessage";

	constructor() {
	}

	clearAuthToken(): void {
		localStorage.removeItem('authToken');
	}

	setAuthToken(authToken: string): void {
		localStorage.setItem('authToken', authToken);
	}

	getAuthToken(): string | undefined {
		let authToken = localStorage.getItem('authToken');

		return authToken ? authToken : undefined;
	}

	setAutoImportConfig(autoImportConfig: AutoImportConfig): void {
		localStorage.setItem(StorageService.AUTO_IMPORT_CONFIG_PASSWORD_KEY, JSON.stringify(this.encodeBase64(autoImportConfig.password)));
		localStorage.setItem(StorageService.AUTO_IMPORT_CONFIG_EXPIRY_KEY, JSON.stringify(this.dateToTimestampString(autoImportConfig.passwordStorageExpireDate)));
	}

	getAutoImportConfig(): AutoImportConfig {
		return {
			password: this.decodeBase64(getValueOrThrowIfFalsy(StorageService.parseJsonThrowOnFalsy(localStorage.getItem(StorageService.AUTO_IMPORT_CONFIG_PASSWORD_KEY)))),
			passwordStorageExpireDate: this.timestampStringToDate(StorageService.parseJsonThrowOnFalsy(localStorage.getItem(StorageService.AUTO_IMPORT_CONFIG_EXPIRY_KEY)))
		}
	}

	clearAutoImportConfig(): void {
		localStorage.removeItem(StorageService.AUTO_IMPORT_CONFIG_PASSWORD_KEY);
		localStorage.removeItem(StorageService.AUTO_IMPORT_CONFIG_EXPIRY_KEY);
	}

	setLastImportInfo(lastImportInfo: LastImportInfo): void {
		localStorage.setItem(StorageService.LAST_IMPORT_DATE_KEY, JSON.stringify(this.dateToTimestampString(lastImportInfo.importDate)));
		localStorage.setItem(StorageService.LAST_IMPORT_MESSAGE_KEY, JSON.stringify(lastImportInfo.errorMessage));
	}

	getLastImportInfo(): LastImportInfo {
		return {
			importDate: this.timestampStringToDate(StorageService.parseJsonThrowOnFalsy(localStorage.getItem(StorageService.LAST_IMPORT_DATE_KEY))),
			errorMessage: this.getTextOrUndefined(StorageService.parseJsonThrowOnFalsy(localStorage.getItem(StorageService.LAST_IMPORT_MESSAGE_KEY)))
		}
	}

	setDisplayedMonthForBudgets(month: Date): void {
		localStorage.setItem('displayedMonthForBudgets', month.getTime().toString());
	}

	getDisplayedMonthForBudgets(): Date | undefined {
		let displayedMonthTimestamp = localStorage.getItem('displayedMonthForBudgets');

		if (displayedMonthTimestamp === null)
			return undefined;

		return new Date(+displayedMonthTimestamp);
	}

	private getTextOrUndefined(text: any): string | undefined {
		if (!text)
			return undefined;

		return text === 'undefined' ? undefined : text;
	}

	private encodeBase64(text: string | undefined): string | undefined {
		return text ? this.stringToHexString(text) : undefined;
	}

	private decodeBase64(base64EncodedString: string | undefined): string | undefined {
		return base64EncodedString ? this.hexStringToString(base64EncodedString) : undefined;
	}

	private dateToTimestampString(date: Date | undefined): string | undefined {
		return date ? date.getTime().toString() : undefined;
	}

	private timestampStringToDate(timestamp: any): Date | undefined {
		return timestamp ? new Date(+timestamp) : undefined;
	}

	private stringToHexString(text: string): string {
		let hex: string;
		let result = "";

		for (let i=0; i<text.length; i++) {
			hex = text.charCodeAt(i).toString(16);
			result += ("000"+hex).slice(-4);
		}

		return result
	}

	private hexStringToString(hexString: string): string {
		let hexes = hexString.match(/.{1,4}/g) || [];
		let back = "";

		for(let j = 0; j<hexes.length; j++) {
			back += String.fromCharCode(parseInt(hexes[j], 16));
		}

		return back;
	}

	private static parseJsonThrowOnFalsy(json: string | null): any {
	    if (!json) {
	        throw 'argument is falsy';
        }

	    return JSON.parse(json);
    }
}
