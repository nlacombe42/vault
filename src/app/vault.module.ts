import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {VaultComponent} from './vault.component';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {SideMenuComponent} from './side-menu/side-menu.component';
import {OverviewComponent} from './overview/overview.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {VaultRoutingModule} from "./shared/vault-routing.module";
import {LoginComponent} from './login/login.component';
import {AuthGuard} from "./auth/auth-guard.service";
import {AuthService} from "./auth/auth.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthInterceptor} from "./auth/auth-interceptor";
import {StorageService} from "./shared/storage.service";
import {TransactionsService} from "./transactions/transactions.service";
import {LocalDatePipe} from "./shared/localdate.pipe";
import {AmountComponent} from "./amount/amount.component";
import {CategoriesService} from "./shared/categories.service";
import {UncategorizedTransactionsComponent} from "./uncategorized-transactions/uncategorized-transactions.component";
import {TransactionsComponent} from "./transactions/transactions.component";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {BudgetsComponent} from "./budgets/budgets.component";
import {MonthPickerComponent} from "./month-picker/month-picker.component";
import {LocalMonthPipe} from "./shared/localmonth.pipe";
import {AddBudgetDialogComponent} from "./add-budget-dialog/add-budget-dialog.component";
import {BudgetsService} from "./budgets/budgets.service";
import {BudgetProgressComponent} from "./budget-progress/budget-progress.component";
import {DatePipe} from "@angular/common";
import {VaultMatModule} from "./vault-mat.module";
import {FormsModule} from "@angular/forms";
import {ImportsComponent} from "./imports/imports.component";
import {ImportsService} from "./imports/imports.service";

@NgModule({
	declarations: [
		VaultComponent,
		ToolbarComponent,
		SideMenuComponent,
		OverviewComponent,
		UncategorizedTransactionsComponent,
		PageNotFoundComponent,
		LoginComponent,
		AmountComponent,
		TransactionsComponent,
		BudgetsComponent,
		MonthPickerComponent,
		AddBudgetDialogComponent,
		BudgetProgressComponent,
		ImportsComponent,
		LocalDatePipe,
		LocalMonthPipe
	],
	imports: [
		BrowserModule, BrowserAnimationsModule, HttpClientModule, FormsModule, VaultRoutingModule, VaultMatModule,
		InfiniteScrollModule
	],
	entryComponents: [
		AddBudgetDialogComponent
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptor,
			multi: true
		},
		DatePipe,
		AuthGuard, AuthService, StorageService, TransactionsService, CategoriesService, BudgetsService, ImportsService
	],
	bootstrap: [VaultComponent]
})
export class VaultModule {
}
