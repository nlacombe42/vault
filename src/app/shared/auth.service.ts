import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {StorageService} from "./storage.service";

class AuthToken {
	token: string
}

@Injectable()
export class AuthService {
	private readonly authenticateUrl: string = environment.apiBaseUrls.userWs + '/v1/authentication/usernameAndPassword';

	constructor(private router: Router, private http: HttpClient, private storageService: StorageService) {
	}

	login(username: string, password: string) {
		this.http.post<AuthToken>(this.authenticateUrl, {
			username,
			password
		}).subscribe(response => {
			this.storageService.setAuthToken(response.token);
			this.router.navigate(['/overview']);
		}, (errorResponse: HttpErrorResponse) => {
			this.storageService.setAuthToken(null);
			console.error('Error getting authentication', errorResponse.error);
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
