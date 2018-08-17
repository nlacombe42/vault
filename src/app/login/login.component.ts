import {AfterViewInit, Component, NgZone, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";

declare const gapi: any;

@Component({
	selector: 'login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
	username: string;
	password: string;
	errorMessage: string = null;
	private auth2: any;

	constructor(private ngZone: NgZone, private router: Router, private authService: AuthService) {
	}

	ngOnInit() {
		this.checkIfAuthTokenExpired();
	}

	ngAfterViewInit() {
		this.googleInit();
	}

	googleSignIn() {
		this.auth2.signIn().then((googleUser) => {
			this.ngZone.run(() => {
				this.authService.jwtLogin(googleUser.getAuthResponse().id_token).subscribe(() => {
					this.router.navigate(['/budgets']);
				}, () => this.errorMessage = 'Unknown error.');
			});
		}, (errorResponse) => {
			this.ngZone.run(() => {
				this.errorMessage = 'Unknown error.';
			});
		});
	}

	private googleInit() {
		gapi.load('auth2', () => {
			this.auth2 = gapi.auth2.init({
				client_id: environment.googleOauthClientId,
				cookiepolicy: 'single_host_origin',
				scope: 'profile email'
			});
		});
	}

	private checkIfAuthTokenExpired() {
		if (this.authService.isAuthTokenExpired()) {
			this.errorMessage = "Your session expired.";
			this.authService.clearAuthToken();
		}
	}
}
