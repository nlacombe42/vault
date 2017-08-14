import {Component, Input, OnInit} from '@angular/core';
import {SideMenuComponent} from "../side-menu/side-menu.component";

@Component({
	selector: 'toolbar',
	templateUrl: './toolbar.component.html',
	styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

	@Input() sideMenu: SideMenuComponent;

	constructor() {
	}

	ngOnInit() {
	}

	toggleSideMenu() {
		this.sideMenu.toggle();
	}
}
