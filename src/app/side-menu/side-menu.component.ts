import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from "@angular/material";
import {AuthService} from "../auth/auth.service";

@Component({
	selector: 'side-menu',
	templateUrl: './side-menu.component.html',
	styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

	@ViewChild(MatSidenav) sideNav;

	constructor(private authService: AuthService) {
	}

	ngOnInit() {
	}

	toggle() {
		this.sideNav.toggle();
	}

	logout() {
		this.authService.logout();
	}
}
