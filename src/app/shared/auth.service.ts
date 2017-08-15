import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {StorageService} from "./storage.service";
import {Observable} from "rxjs/Observable";

class AuthToken {
	token: string
}

@Injectable()
export class AuthService {
	private readonly authenticateUrl: string = environment.apiBaseUrls.userWs + '/v1/authentication/usernameAndPassword';

	constructor(private http: HttpClient, private storageService: StorageService) {
	}

	login(username: string, password: string): Observable<boolean> {
		return new Observable<boolean>((observer) => {
			this.http.post<AuthToken>(this.authenticateUrl, {
				username,
				password
			}).subscribe(response => {
				this.storageService.setAuthToken(response.token);
				observer.next(true);
				observer.complete();
			}, (errorResponse: HttpErrorResponse) => {
				this.storageService.setAuthToken(null);
				observer.error(errorResponse.error);
			});
		});
	}

	logout(): void {
		this.storageService.setAuthToken(null);
	}

	isUserLoggedIn(): boolean {
		return this.getAuthToken() !== null;
	}

	getAuthToken() {
		return this.storageService.getAuthToken();
	}
}
