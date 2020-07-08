import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../shared/storage.service";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {catchError, map} from "rxjs/operators";
import {JwtHelperService} from "@auth0/angular-jwt";

class AuthToken {
	token: string
}

@Injectable()
export class AuthService {
	private readonly jwtAuthenticateUrl: string = environment.apiBaseUrls.userWs + '/v1/authentication/jwt';

	constructor(private http: HttpClient, private router: Router, private storageService: StorageService) {
	}

	jwtLogin(jwt: string): Observable<void> {
		return this.http.post<AuthToken>(this.jwtAuthenticateUrl, {
			token: jwt
		}).pipe(
			map(response => {
				this.storageService.setAuthToken(response.token);
				return;
			}),
			catchError(errorResponse => {
				this.storageService.clearAuthToken();
				throw errorResponse.error;
			})
		);
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

		if (!authToken)
			return false;

		let helper = new JwtHelperService();
		let expirationDate = helper.getTokenExpirationDate(authToken);

		return new Date() >= expirationDate;
	}
}
