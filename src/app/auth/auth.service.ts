import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../shared/storage.service";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import * as jwtDecode from 'jwt-decode';
import {catchError, map} from "rxjs/operators";
import {throwError} from "rxjs/internal/observable/throwError";

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
				return throwError(errorResponse.error);
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

		let authJwt: JwtUser = jwtDecode<JwtUser>(authToken);

		return new Date() >= new Date(authJwt.exp * 1000);
	}
}
