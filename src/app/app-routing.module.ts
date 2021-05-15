import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {UncategorizedTransactionsComponent} from "./uncategorized-transactions/uncategorized-transactions.component";
import {AuthGuard} from "./auth/auth-guard.service";
import {TransactionsComponent} from "./transactions/transactions.component";
import {BudgetsComponent} from "./budgets/budgets.component";
import {BudgetComponent} from "./budget/budget.component";
import {TransactionComponent} from "./transaction/transaction.component";
import {ImportsComponent} from "./imports/imports.component";
import {CategoriesComponent} from "./categories/categories.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {SplitTransactionPageComponent} from "./split-transaction-page/split-transaction-page.component";

const routes: Routes = [
    {path: '', redirectTo: '/uncategorizedTransactions', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'uncategorizedTransactions', component: UncategorizedTransactionsComponent, canActivate: [AuthGuard]},
    {path: 'transactions', component: TransactionsComponent, canActivate: [AuthGuard]},
    {path: 'budgets', component: BudgetsComponent, canActivate: [AuthGuard]},
    {path: 'budget/:budgetId', component: BudgetComponent, canActivate: [AuthGuard]},
    {path: 'transaction/:transactionId', component: TransactionComponent, canActivate: [AuthGuard]},
    {path: 'split-transaction/:transactionId', component: SplitTransactionPageComponent, canActivate: [AuthGuard]},
    {path: 'imports', component: ImportsComponent, canActivate: [AuthGuard]},
    {path: 'categories', component: CategoriesComponent, canActivate: [AuthGuard]},
    {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
