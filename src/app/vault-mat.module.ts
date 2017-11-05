import {NgModule} from '@angular/core';
import {
	MatButtonModule,
	MatCardModule,
	MatCheckboxModule,
	MatDialogModule,
	MatIconModule,
	MatInputModule,
	MatListModule,
	MatSelectModule,
	MatSidenavModule,
	MatToolbarModule
} from "@angular/material";

const MatImports = [
	MatToolbarModule,
	MatButtonModule,
	MatIconModule,
	MatSidenavModule,
	MatInputModule,
	MatCardModule,
	MatListModule,
	MatSelectModule,
	MatDialogModule,
	MatCheckboxModule
];

@NgModule({
	imports: MatImports,
	exports: MatImports
})
export class VaultMatModule {
}
