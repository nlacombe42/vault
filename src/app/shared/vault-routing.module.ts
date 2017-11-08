import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {OverviewComponent} from "../overview/overview.component";
import {PageNotFoundComponent} from "../page-not-found/page-not-found.component";
import {LoginComponent} from "../login/login.component";
import {AuthGuard} from "../auth/auth-guard.service";
import {TransactionsComponent} from "../transactions/transactions.component";
import {BudgetsComponent} from "../budgets/budgets.component";
import {ImportsComponent} from "../imports/imports.component";

const vaultRoutes: Routes = [
	{path: '', redirectTo: '/overview', pathMatch: 'full'},
	{path: 'login', component: LoginComponent},
	{path: 'overview', component: OverviewComponent, canActivate: [AuthGuard]},
	{path: 'transactions', component: TransactionsComponent, canActivate: [AuthGuard]},
	{path: 'budgets', component: BudgetsComponent, canActivate: [AuthGuard]},
	{path: 'imports', component: ImportsComponent, canActivate: [AuthGuard]},
	{path: '**', component: PageNotFoundComponent}
];

@NgModule({
	imports: [
		RouterModule.forRoot(vaultRoutes)
	],
	exports: [
		RouterModule
	]
})
export class VaultRoutingModule {
}
