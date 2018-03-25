import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {StorageService} from "../shared/storage.service";
import {Observable} from "rxjs/Observable";
import {Router} from "@angular/router";
import * as jwtDecode from 'jwt-decode';

class AuthToken {
	token: string
}

class Jwt {
	iss: string;
	iat: number;
	exp: number;
	sub: string;
}

class JwtUser extends Jwt {
	userId: number
}

@Injectable()
export class AuthService {
	private readonly authenticateUrl: string = environment.apiBaseUrls.userWs + '/v1/authentication/usernameAndPassword';

	constructor(private http: HttpClient, private router: Router, private storageService: StorageService) {
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
		this.clearAuthToken();
		this.router.navigate(['/login']);
	}

	clearAuthToken(): void {
		this.storageService.clearAuthToken();
	}

	isUserLoggedIn(): boolean {
		return this.getAuthToken() !== null && !this.isAuthTokenExpired();
	}

	getAuthToken(): string {
		return this.storageService.getAuthToken();
	}

	isAuthTokenExpired(): boolean {
		let authToken = this.getAuthToken();

		if (authToken === null)
			return false;

		let authJwt: JwtUser = jwtDecode<JwtUser>(authToken);

		return new Date() >= new Date(authJwt.exp * 1000);
	}
}
