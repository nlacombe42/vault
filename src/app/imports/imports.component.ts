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
	importInProgress: boolean;

	constructor(private importsService: ImportsService) {
	}

	ngOnInit() {
		this.importInProgress = false;
	}

	import(): void {
		this.importInProgress = true;
		this.importsService.import(this.password, this.rememberPassword)
			.subscribe(
				undefined,
				() => this.importInProgress = false,
				() => this.importInProgress = false);
	}
}
