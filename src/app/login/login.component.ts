import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Router} from "@angular/router";
import {GoogleAuthService, GoogleUser} from "../auth/google-auth.service";
import {EventService, Event, EventType} from "../shared/event.service";

@Component({
	selector: 'login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
	errorMessage: string | undefined;

	constructor(private googleAuthService: GoogleAuthService,
				private router: Router,
				private authService: AuthService,
				private eventService: EventService) {
	}

	ngOnInit() {
		this.checkIfAuthTokenExpired();
	}

	ngAfterViewInit() {
		this.googleAuthService.isUserLoggedInGoogle().subscribe(userLoggedInGoogle => {
			if (userLoggedInGoogle) {
				this.googleAuthService.getCurrentGoogleUser().subscribe(googleUser => {
					this.loginWithGoogleUser(googleUser);
				}, error => {
					this.errorMessage = 'Unknown error. ' + JSON.stringify(error, undefined, 2);
				});
			}
		}, error => {
			this.errorMessage = 'Unknown error. ' + JSON.stringify(error, undefined, 2);
		});
	}

	googleSignIn() {
		this.googleAuthService.loginGoogleUser().subscribe(googleUser => {
			this.loginWithGoogleUser(googleUser);
		}, error => {
			this.errorMessage = 'Unknown error. ' + JSON.stringify(error, undefined, 2);
		});
	}

	private loginWithGoogleUser(googleUser: GoogleUser) {
		this.authService.jwtLogin(googleUser.jwt).subscribe(() => {
			this.eventService.publish(new Event(EventType.USER_LOGGED_IN));
			this.router.navigate(['/budgets']);
		}, (errorResponse) => this.errorMessage = 'Unknown error. ' + errorResponse);
	}

	private checkIfAuthTokenExpired() {
		if (this.authService.isAuthTokenExpired()) {
			this.errorMessage = "Your session expired.";
			this.authService.clearAuthToken();
		}
	}
}
