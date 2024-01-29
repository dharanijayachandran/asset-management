import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_CHECKBOX_DEFAULT_OPTIONS, MatCheckboxDefaultOptions, MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MAT_RADIO_DEFAULT_OPTIONS, MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { GlobalModule, PendingChangesGuard } from "global";
import { MainInterceptor } from "../app/main-interceptor";
import { AppRoutingModule, assetRoutingComponent } from './app-routing.module';
import { AppComponent } from './app.component';
import { NumericDirective } from './asset-template/pages/manage-alarm-analog-asset-tag/numeric.directive';
import { ExportFilesToComponent } from './shared/components/export-files-to/export-files-to.component';
import { MatTablePaginatorComponent } from './shared/components/mat-table-paginator/mat-table-paginator.component';
import { MatSortModule } from '@angular/material/sort';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { OrderByAlphabeticalPipe } from './shared/pipe/orderByAlphabetical/order-by-alphabetical.pipe';
@NgModule({
  declarations: [
    AppComponent,
    ExportFilesToComponent,
    MatTablePaginatorComponent,
    NumericDirective,
    assetRoutingComponent,
    OrderByAlphabeticalPipe
  ],
  imports: [
    //Impoted all library/npm packages
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    NgbModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatTreeModule,
    MatMenuModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSortModule,
    MatSelectModule,
    MatRadioModule,
    MatPaginatorModule,
    GlobalModule,
    MaskedTextBoxModule,
    DropDownListModule,
    TreeViewModule,
    AppRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [
    Title,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MainInterceptor,
      multi: true
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    PendingChangesGuard,
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
    },
    { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'check-indeterminate', color: 'primary' } as MatCheckboxDefaultOptions }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
