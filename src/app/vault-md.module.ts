import {NgModule} from '@angular/core';
import {
	MdButtonModule,
	MdCardModule,
	MdIconModule,
	MdInputModule,
	MdSidenavModule,
	MdToolbarModule
} from "@angular/material";

const mdImports = [
	MdToolbarModule, MdButtonModule, MdIconModule, MdSidenavModule, MdInputModule, MdCardModule
];

@NgModule({
	imports: mdImports,
	exports: mdImports
})
export class VaultMdModule {
}
