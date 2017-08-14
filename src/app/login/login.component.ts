import {Component, OnInit} from '@angular/core';
import {AuthService} from "../shared/auth.service";

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	username: string;
	password: string;

	constructor(private authService: AuthService) {
	}

	ngOnInit() {
	}

	login(username: string, password: string) {
		this.authService.login(username, password);
	}
}
