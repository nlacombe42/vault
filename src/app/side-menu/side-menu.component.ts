import {Component, OnInit, ViewChild} from '@angular/core';
import {MdSidenav} from "@angular/material";

@Component({
	selector: 'side-menu',
	templateUrl: './side-menu.component.html',
	styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

	@ViewChild(MdSidenav) sideNav;

	constructor() {
	}

	ngOnInit() {
	}

	toggle() {
		this.sideNav.toggle();
	}
}
