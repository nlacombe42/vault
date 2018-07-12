import {Component, OnInit} from '@angular/core';
import {ImportsService} from "./imports.service";

@Component({
	selector: 'imports',
	templateUrl: './imports.component.html',
	styleUrls: ['./imports.component.scss']
})
export class ImportsComponent implements OnInit {

	password: string;
	rememberPassword: number;

	constructor(private importsService: ImportsService) {
	}

	ngOnInit() {
	}

	import(): void {
		this.importsService.setAutoImportConfig(this.password, this.rememberPassword);
		this.importsService.startImport(this.password);
	}

	stopAutoImports(): void {
		this.importsService.stopAutoImports();
	}

	getLastImportErrorMessage(): string {
		return this.importsService.getLastImportErrorMessage();
	}

	isImportInProgress(): boolean {
		return this.importsService.isImportInProgress();
	}
}
