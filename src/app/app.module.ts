import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ToolbarComponent} from "./toolbar/toolbar.component";
import {SideMenuComponent} from "./side-menu/side-menu.component";
import {UncategorizedTransactionsComponent} from "./uncategorized-transactions/uncategorized-transactions.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {LoginComponent} from "./login/login.component";
import {AmountComponent} from "./amount/amount.component";
import {TransactionsComponent} from "./transactions/transactions.component";
import {BudgetsComponent} from "./budgets/budgets.component";
import {MonthPickerComponent} from "./month-picker/month-picker.component";
import {AddBudgetDialogComponent} from "./add-budget-dialog/add-budget-dialog.component";
import {BudgetProgressComponent} from "./budget-progress/budget-progress.component";
import {ImportsComponent} from "./imports/imports.component";
import {CategoryDropdownComponent} from "./category-dropdown/category-dropdown.component";
import {CategoriesComponent} from "./categories/categories.component";
import {LocalDatePipe} from "./shared/localdate.pipe";
import {LocalMonthPipe} from "./shared/localmonth.pipe";
import {BudgetListItemComponent} from "./budget-list-item/budget-list-item.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {AuthInterceptor} from "./auth/auth-interceptor";
import {DatePipe} from "@angular/common";
import {AuthGuard} from "./auth/auth-guard.service";
import {AuthService} from "./auth/auth.service";
import {StorageService} from "./shared/storage.service";
import {TransactionsService} from "./transactions/transactions.service";
import {CategoriesService} from "./categories/categories.service";
import {BudgetsService} from "./budgets/budgets.service";
import {ImportsService} from "./imports/imports.service";
import {GoogleAuthService} from "./auth/google-auth.service";
import {EventService} from "./shared/event.service";
import {VaultMatModule} from "./vault-mat.module";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {BudgetComponent} from "./budget/budget.component";
import {TransactionComponent} from "./transaction/transaction.component";
import {SplitTransactionPageComponent} from "./split-transaction-page/split-transaction-page.component";

@NgModule({
    declarations: [
        AppComponent,
        ToolbarComponent,
        SideMenuComponent,
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
        BudgetComponent,
        TransactionComponent,
        CategoryDropdownComponent,
        CategoriesComponent,
        LocalDatePipe,
        LocalMonthPipe,
        BudgetListItemComponent,
        SplitTransactionPageComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        InfiniteScrollModule,
        VaultMatModule,
    ],
    entryComponents: [
        AddBudgetDialogComponent,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        DatePipe,
        AuthGuard,
        AuthService,
        StorageService,
        TransactionsService,
        CategoriesService,
        BudgetsService,
        ImportsService,
        GoogleAuthService,
        EventService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
