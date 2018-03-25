import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../shared/storage.service";
import {AutoImportConfig} from "./auto-import-config";
import {DateUtils} from "../shared/date.util";
import {Observable} from "rxjs/Observable";
import {catchError, mergeMap} from "rxjs/operators";
import 'rxjs/add/observable/throw';

@Injectable()
export class ImportsService {
	private readonly vaultDesjardinsImportUrl: string = environment.apiBaseUrls.vaultImportsWs + '/v1/import/desjardins';
	private readonly minMinutesBetweenImport: number = 60;

	private importObservable: Observable<void>;

	constructor(private http: HttpClient, private storageService: StorageService) {
		let autoImportConfig = this.storageService.getAutoImportConfig();
		let lastImportInfo = this.storageService.getLastImportInfo();

		if (autoImportConfig.password !== undefined) {
			if (autoImportConfig.passwordStorageExpireDate > new Date()) {
				this.stopAutoImports();
			} else if (!lastImportInfo.importDate || DateUtils.addMinutes(lastImportInfo.importDate, this.minMinutesBetweenImport) < new Date()) {
				this.startImport(autoImportConfig.password);
			}
		}
	}

	startImport(password: string): Observable<void> {
		this.importObservable = this.http.post<void>(this.vaultDesjardinsImportUrl, {importPassword: password})
			.pipe(mergeMap(() => {
					this.storageService.setLastImportInfo({
						importDate: new Date(),
						errorMessage: undefined
					});
					this.importObservable = undefined;
					return Observable.of();
				}),
				catchError((error) => {
					this.stopAutoImports();
					this.storageService.setLastImportInfo({
						importDate: new Date(),
						errorMessage: 'Error during import.'
					});
					this.importObservable = undefined;
					return Observable.throw(error);
				}));

		this.importObservable.subscribe();

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
		this.storageService.setAutoImportConfig({
			password: undefined,
			passwordStorageExpireDate: undefined
		});
	}

	isImportInProgress(): boolean {
		return this.importObservable != undefined;
	}

	getLastImportErrorMessage(): string {
		return this.storageService.getLastImportInfo().errorMessage;
	}
}
