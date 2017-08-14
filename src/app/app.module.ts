import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {MdButtonModule, MdIconModule, MdSidenavModule, MdToolbarModule} from "@angular/material";
import {ToolbarComponent} from './toolbar/toolbar.component';
import {SideMenuComponent} from './side-menu/side-menu.component';

@NgModule({
	declarations: [
		AppComponent,
		ToolbarComponent,
		SideMenuComponent
	],
	imports: [
		BrowserModule, MdToolbarModule, MdButtonModule, MdIconModule, MdSidenavModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {
}
