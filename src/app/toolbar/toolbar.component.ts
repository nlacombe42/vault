import {Component, Input, OnInit} from '@angular/core';
import {SideMenuComponent} from "../side-menu/side-menu.component";
import {ImportsService} from "../imports/imports.service";

@Component({
	selector: 'toolbar',
	templateUrl: './toolbar.component.html',
	styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

	@Input() sideMenu: SideMenuComponent | undefined;

	constructor(private importsService: ImportsService) {
	}

	ngOnInit() {
	}

	toggleSideMenu() {
	    if (!this.sideMenu) {
	        return;
        }

		this.sideMenu.toggle();
	}

	isImportInProgress(): boolean {
		return this.importsService.isImportInProgress();
	}
}
