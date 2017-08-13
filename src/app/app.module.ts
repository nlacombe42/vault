import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {MdButtonModule, MdIconModule, MdSidenavModule, MdToolbarModule} from "@angular/material";

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule, MdToolbarModule, MdButtonModule, MdIconModule, MdSidenavModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {
}
