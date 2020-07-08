import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {GoogleAuthService} from "../auth/google-auth.service";
import {MatSidenav} from "@angular/material/sidenav";

@Component({
	selector: 'side-menu',
	templateUrl: './side-menu.component.html',
	styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

	@ViewChild(MatSidenav, {static: true}) sideNav;

	constructor(private authService: AuthService, private googleAuthService: GoogleAuthService) {
	}

	ngOnInit() {
	}

	toggle() {
		this.sideNav.toggle();
	}

	logout() {
		this.googleAuthService.logoutGoogleUser().subscribe(() => {
			this.authService.logout();
		}, error => {
			console.error('Error logging out: ', error);
		});
	}
}
