import {Component, OnInit} from '@angular/core';
import {ImportsService} from "./imports.service";
import "rxjs/add/operator/finally";

@Component({
	selector: 'imports',
	templateUrl: './imports.component.html',
	styleUrls: ['./imports.component.scss']
})
export class ImportsComponent implements OnInit {

	password: string;
	rememberPassword: number;
	importInProgress: boolean;
	message: string;
	messageClass: string;

	constructor(private importsService: ImportsService) {
	}

	ngOnInit() {
		this.importInProgress = false;
	}

	import(): void {
		this.importInProgress = true;
		this.importsService.import(this.password, this.rememberPassword)
			.finally(() => {
				this.importInProgress = false;
			})
			.subscribe(
				() => {
					this.message = "Import successful.";
					this.messageClass = "message-success";
				},
				() => {
					this.message = "Error during import.";
					this.messageClass = "message-error";
				});
	}
}
