import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import "rxjs/add/observable/from";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/map";
import {Observable} from "rxjs/Observable";
import {StorageService} from "../shared/storage.service";
import {ImportPassword} from "./import-password";
import {DateUtils} from "../shared/date.util";
import {IntervalObservable} from "rxjs/observable/IntervalObservable";
import "rxjs/add/operator/takeWhile";

@Injectable()
export class ImportsService implements OnInit, OnDestroy {
	private readonly vaultDesjardinsImportUrl: string = environment.apiBaseUrls.vaultImportsWs + '/v1/import/desjardins';
	private readonly importIntervalSeconds: number = 3600;

	private alive: boolean;
	private intervalCreated: boolean;

	constructor(private http: HttpClient, private storageService: StorageService) {
		let importPassword = this.storageService.getImportPassword();

		if (importPassword !== undefined) {
			if (importPassword.passwordStorageExpireDate > new Date()) {
				this.storageService.clearImportPassword();
			} else {
				this.setupAutomaticImport(importPassword);
			}
		}
	}

	ngOnInit(): void {
		this.alive = true;
		this.intervalCreated = false;
	}

	ngOnDestroy(): void {
		this.alive = false;
	}

	import(password: string, rememberPasswordInSeconds: number): Observable<void> {
		let importPassword: ImportPassword = {
			password: password,
			passwordStorageExpireDate: DateUtils.addSeconds(new Date(), rememberPasswordInSeconds)
		};

		return this.setupAutomaticImport(importPassword);
	}

	private setupAutomaticImport(importPassword: ImportPassword): Observable<void> {
		this.storageService.setImportPassword(importPassword);

		if (!this.intervalCreated && importPassword.passwordStorageExpireDate > new Date()) {
			IntervalObservable.create(this.importIntervalSeconds * 1000)
				.takeWhile(() => this.alive)
				.subscribe(() => {
					this.importOnce(importPassword.password);
				});
			this.intervalCreated = true;
		}

		return this.importOnce(importPassword.password);
	}

	private importOnce(password: string): Observable<void> {
		return new Observable<void>(observer => {
			this.http.post<void>(this.vaultDesjardinsImportUrl, {importPassword: password})
				.subscribe(
					() => observer.next(),
					(error) => {
						this.storageService.clearImportPassword();
						observer.error(error);
					},
					()=> observer.complete());
		});
	}
}
