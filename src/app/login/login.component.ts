import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Router} from "@angular/router";

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

	constructor(private router: Router, private authService: AuthService) {
	}

	ngOnInit() {
		this.checkIfAuthTokenExpired();
	}

	ngAfterViewInit() {
		this.googleInit();
	}

	private googleInit() {
		gapi.load('auth2', () => {
			this.auth2 = gapi.auth2.init({
				client_id: '885558423234-votp6uh6a3qavatk9h1cnpelt0o9rsos.apps.googleusercontent.com',
				cookiepolicy: 'single_host_origin',
				scope: 'profile email'
			});

			let element = document.getElementById('googleSignIn');

			this.auth2.attachClickHandler(element, {},
				(googleUser) => {
					this.authService.jwtLogin(googleUser.getAuthResponse().id_token).subscribe(() => {
						this.router.navigate(['/budgets']);
					}, () => this.errorMessage = 'Unknown error.');
				}, (errorResponse) => {
					this.errorMessage = 'Unknown error.';
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
