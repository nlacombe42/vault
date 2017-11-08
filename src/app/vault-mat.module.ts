import {NgModule} from '@angular/core';
import {
	MatButtonModule,
	MatCardModule,
	MatCheckboxModule,
	MatDialogModule,
	MatIconModule,
	MatInputModule,
	MatListModule,
	MatProgressSpinnerModule,
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
	MatCheckboxModule,
	MatProgressSpinnerModule
];

@NgModule({
	imports: MatImports,
	exports: MatImports
})
export class VaultMatModule {
}
