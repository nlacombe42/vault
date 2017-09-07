import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {VaultComponent} from './vault.component';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {SideMenuComponent} from './side-menu/side-menu.component';
import {OverviewComponent} from './overview/overview.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {VaultRoutingModule} from "./shared/vault-routing.module";
import {LoginComponent} from './login/login.component';
import {AuthGuard} from "./shared/auth-guard.service";
import {AuthService} from "./shared/auth.service";
import {VaultMdModule} from "./vault-md.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthInterceptor} from "./shared/auth-interceptor";
import {FormsModule} from "@angular/forms";
import {StorageService} from "./shared/storage.service";
import {TransactionsService} from "./shared/transactions.service";
import {LocalDatePipe} from "./shared/localdate.pipe";
import {AmountComponent} from "./amount/amount.component";
import {CategoriesService} from "./shared/categories.service";
import {GroupByPipe} from "./shared/group-by.pipe";
import {UncategorizedTransactionsComponent} from "./uncategorized-transactions/uncategorized-transactions.component";
import {SelectCategoryDialog} from "./select-category-dialog/select-category-dialog.component";


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
		SelectCategoryDialog,
		LocalDatePipe,
		GroupByPipe
	],
	entryComponents: [
		SelectCategoryDialog
	],
	imports: [
		BrowserModule, BrowserAnimationsModule, HttpClientModule, FormsModule, VaultRoutingModule, VaultMdModule
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptor,
			multi: true
		},
		AuthGuard, AuthService, StorageService, TransactionsService, CategoriesService
	],
	bootstrap: [VaultComponent]
})
export class VaultModule {
}
