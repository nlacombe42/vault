import {NgModule} from '@angular/core';
import {
	MdButtonModule,
	MdCardModule,
	MdDialogModule,
	MdIconModule,
	MdInputModule,
	MdListModule,
	MdSelectModule,
	MdSidenavModule,
	MdToolbarModule
} from "@angular/material";

const mdImports = [
	MdToolbarModule,
	MdButtonModule,
	MdIconModule,
	MdSidenavModule,
	MdInputModule,
	MdCardModule,
	MdListModule,
	MdSelectModule,
	MdDialogModule
];

@NgModule({
	imports: mdImports,
	exports: mdImports
})
export class VaultMdModule {
}
