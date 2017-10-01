import {Component, OnInit} from '@angular/core';
import {MdDialog} from "@angular/material";
import {AddBudgetDialogComponent, AddBudgetDialogConfig} from "../add-budget-dialog/add-budget-dialog.component";

@Component({
	selector: 'budgets',
	templateUrl: './budgets.component.html',
	styleUrls: ['./budgets.component.scss']
})
export class BudgetsComponent implements OnInit {
	monthDisplayed: Date;

	constructor(public dialog: MdDialog) {
		this.monthDisplayed = new Date();
	}

	ngOnInit() {
	}

	showAddBudgetDialog() {
		let addBudgetDialogConfig: AddBudgetDialogConfig = {
			month: this.monthDisplayed
		};

		let dialog = this.dialog.open(AddBudgetDialogComponent, {
			panelClass: 'fullscreen-dialog',
			data: addBudgetDialogConfig
		});

		dialog.afterClosed().subscribe(result => {
			console.log('The dialog was closed with result: ', result);
		});
	}
}
