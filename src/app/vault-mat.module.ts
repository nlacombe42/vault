import {NgModule} from '@angular/core';
import {
	MatButtonModule,
	MatCardModule,
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
	MatDialogModule
];

@NgModule({
	imports: MatImports,
	exports: MatImports
})
export class VaultMatModule {
}
