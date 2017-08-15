import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../shared/auth.service";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {isRestException, RestExceptionErrorCodes} from "../shared/rest-exception.model";

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	@ViewChild(NgForm) loginForm;

	username: string;
	password: string;
	errorMessage: string = null;

	constructor(private router: Router, private authService: AuthService) {
	}

	ngOnInit() {
	}

	login(username: string, password: string) {
		if (!this.loginForm.valid)
			return;

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
}
