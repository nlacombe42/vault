import {Component, OnInit} from '@angular/core';
import {AuthService} from "../shared/auth.service";
import {Router} from "@angular/router";
import {isRestException, RestExceptionErrorCodes} from "../shared/rest-exception.model";

@Component({
	selector: 'login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	username: string;
	password: string;
	errorMessage: string = null;

	constructor(private router: Router, private authService: AuthService) {
	}

	ngOnInit() {
		this.checkIfAuthTokenExpired();
	}

	login(username: string, password: string) {
		this.authService.login(username, password).subscribe(() => {
			this.router.navigate(['/overview']);
		}, (error) => {
			if (isRestException(error) && error.errorCode === RestExceptionErrorCodes.NOT_FOUND) {
				this.errorMessage = 'Username password combination does not match.';
			} else {
				this.errorMessage = 'Unknown error.';
			}
		});
	}

	private checkIfAuthTokenExpired() {
		if (this.authService.isAuthTokenExpired()) {
			this.errorMessage = "Your session expired.";
			this.authService.clearAuthToken();
		}
	}
}
