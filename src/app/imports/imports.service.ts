import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../shared/storage.service";
import {AutoImportConfig} from "./auto-import-config";
import {DateUtils} from "../shared/date.util";
import {Observable} from "rxjs";
import {Event, EventService, EventType} from "../shared/event.service";

@Injectable()
export class ImportsService {
	private readonly vaultDesjardinsImportUrl: string = environment.apiBaseUrls.vaultImportsWs + '/v1/import/desjardins';
	private readonly minMinutesBetweenImport: number = 60;

	private importObservable: Observable<void> | undefined;

	constructor(private http: HttpClient, private storageService: StorageService, private eventService: EventService) {
		this.eventService.getEventObservableForType(EventType.USER_LOGGED_IN).subscribe(() => {
			this.startAutoImportIfNeeded();
		});
	}

	private startAutoImportIfNeeded() {
		let autoImportConfig = this.storageService.getAutoImportConfig();
		let lastImportInfo = this.storageService.getLastImportInfo();

		if (autoImportConfig.password !== undefined) {
			if (!!autoImportConfig.passwordStorageExpireDate && autoImportConfig.passwordStorageExpireDate <= new Date()) {
				this.stopAutoImports();
			} else if (!lastImportInfo.importDate || DateUtils.addMinutes(lastImportInfo.importDate, this.minMinutesBetweenImport) <= new Date()) {
				this.startImport(autoImportConfig.password);
			}
		}
	}

	startImport(password: string): Observable<void> {
		this.importObservable = this.http.post<void>(this.vaultDesjardinsImportUrl, {importPassword: password});

		this.importObservable.subscribe(() => {
			this.storageService.setLastImportInfo({
				importDate: new Date(),
				errorMessage: undefined
			});
		}, () => {
			this.stopAutoImports();
			this.storageService.setLastImportInfo({
				importDate: new Date(),
				errorMessage: 'Error during import.'
			});
		}, () => {
			this.importObservable = undefined;
			this.eventService.publish(new Event(EventType.TRANSACTION_IMPORT_FINISHED));
		});

		return this.importObservable;
	}

	setAutoImportConfig(password: string, rememberPasswordInSeconds: number): void {
		let autoImportConfig: AutoImportConfig = {
			password: rememberPasswordInSeconds > 0 ? password : undefined,
			passwordStorageExpireDate: rememberPasswordInSeconds > 0 ? DateUtils.addSeconds(new Date(), rememberPasswordInSeconds) : undefined
		};

		this.storageService.setAutoImportConfig(autoImportConfig);
	}

	stopAutoImports(): void {
		this.storageService.clearAutoImportConfig();
	}

	isImportInProgress(): boolean {
		return this.importObservable != undefined;
	}

	getLastImportErrorMessage(): string | undefined {
		return this.storageService.getLastImportInfo().errorMessage;
	}
}
