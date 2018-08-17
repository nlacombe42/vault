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
	errorMessage: string;
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
		if (this.auth2.isSignedIn.get()) {
			let googleUser = this.auth2.currentUser.get();

			this.ngZone.run(() => {
				this.loginWithGoogleUser(googleUser);
			});
		} else {
			this.auth2.signIn().then((googleUser) => {
				this.ngZone.run(() => {
					this.loginWithGoogleUser(googleUser);
				});
			}, (errorResponse) => {
				this.ngZone.run(() => {
					this.errorMessage = 'Unknown error. ' + JSON.stringify(errorResponse, undefined, 2);
				});
			});
		}
	}

	private loginWithGoogleUser(googleUser: any) {
		this.authService.jwtLogin(googleUser.getAuthResponse().id_token).subscribe(() => {
			this.router.navigate(['/budgets']);
		}, (errorResponse) => this.errorMessage = 'Unknown error. ' + errorResponse);
	}

	private googleInit() {
		gapi.load('auth2', () => {
			gapi.auth2.init({
				client_id: environment.googleOauthClientId,
				cookiepolicy: 'single_host_origin',
				scope: 'profile email'
			}).then((auth2) => {
				this.ngZone.run(() => {
					this.auth2 = auth2;
				});
			}, (error) => {
				this.ngZone.run(() => {
					this.errorMessage = 'Unknown error. ' + JSON.stringify(error, undefined, 2);
				});
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
