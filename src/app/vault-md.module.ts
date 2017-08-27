import {NgModule} from '@angular/core';
import {MdButtonModule, MdCardModule, MdIconModule, MdInputModule, MdSidenavModule, MdTableModule, MdToolbarModule} from "@angular/material";
import {CdkTableModule} from "@angular/cdk";

const mdImports = [
	MdToolbarModule, MdButtonModule, MdIconModule, MdSidenavModule, MdInputModule, MdCardModule, MdTableModule, CdkTableModule
];

@NgModule({
	imports: mdImports,
	exports: mdImports
})
export class VaultMdModule {
}
