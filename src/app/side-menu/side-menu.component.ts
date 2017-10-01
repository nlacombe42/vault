import {Component, OnInit, ViewChild} from '@angular/core';
import {MdSidenav} from "@angular/material";
import {AuthService} from "../shared/auth.service";

@Component({
	selector: 'side-menu',
	templateUrl: './side-menu.component.html',
	styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

	@ViewChild(MdSidenav) sideNav;

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
