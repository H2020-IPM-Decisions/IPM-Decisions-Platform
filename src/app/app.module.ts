import { EppoCodeService } from '@app/shared/services/upr/eppo-code.service';
import { MenuComponent } from './core/components/header/menu/menu.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditAccountComponent } from './user/components/account/edit-account/edit-account.component';
import { AccountComponent } from './user/components/account/account.component';
import { CookieModule } from 'ngx-cookie';
import { AppRoutingModule } from './app-routing.module';
import { FooterComponent } from './core/components/footer/footer.component';
import { AppComponent } from './app.component';
import { UserHeaderComponent } from './user/components/user-header/user-header.component';
import { AdminHeaderComponent } from './admin/admin-header/admin-header.component';
import { AdminSxComponent } from './admin/admin-sx/admin-sx.component';
import { AdminBreadcumbsComponent } from './admin/admin-breadcumbs/admin-breadcumbs.component';
import { AccordionsComponent } from './admin/assets/accordions.component';
import { TabsComponent } from './admin/assets/tabs.component';
import { IconsComponent } from './admin/assets/icons.component';
import { DropdownsComponent } from './admin/assets/dropdowns.component';
import { KeepHtmlPipe } from './keep-html.pipe';
import { RunScriptsDirective } from './run-scripts.directive';
import { AdminComponent } from './admin/admin.component';
import { ContentManagementSystemComponent } from './admin/content-management-system/content-management-system.component';
import { AddUserComponent } from './admin/add-user/add-user.component';
import { UserListComponent } from './admin/user-list/user-list.component';
import { UserProfileComponent } from './admin/user-profile/user-profile.component';
import { ManageMetadataComponent } from './admin/manage-metadata/manage-metadata.component';
import { ManageCatalogueComponent } from './admin/manage-catalogue/manage-catalogue.component';
import { CropListComponent } from './user/components/crop/crop-list/crop-list.component';
import { AddCropComponent } from './user/components/crop/add-crop/add-crop.component';
import { ManageCropComponent } from './user/components/crop/manage-crop/manage-crop.component';
import { EditCropComponent } from './user/components/crop/edit-crop/edit-crop.component';
import { PestDiseaseListComponent } from './user/components/pest-disease/pest-disease-list/pest-disease-list.component';
import { ManagePestDiseaseComponent } from './user/components/pest-disease/manage-pest-disease/manage-pest-disease.component';
import { ActionListComponent } from './user/components/pest-disease/action-list/action-list.component';
import { AddActionComponent } from './user/components/pest-disease/action-list/add-action/add-action.component';
import { EditActionComponent } from './user/components/pest-disease/action-list/edit-action/edit-action.component';
import { ObservationListComponent } from './user/components/pest-disease/observation-list/observation-list.component';
import { AddObservationComponent } from './user/components/pest-disease/observation-list/add-observation/add-observation.component';
import { EditObservationComponent } from './user/components/pest-disease/observation-list/edit-observation/edit-observation.component';
import { AddPestDiseaseComponent } from './user/components/pest-disease/add-pest-disease/add-pest-disease.component';
import { AlertComponent } from './user/components/pest-disease/alert/alert.component';
import { DashboardManagerComponent } from './user/components/dashboard-manager/dashboard-manager.component';
import { AddDashboardComponent } from './user/components/dashboard-manager/add-dashboard/add-dashboard.component';
import { EditDashboardComponent } from './user/components/dashboard-manager/edit-dashboard/edit-dashboard.component';
import { DatasourceRepositoryComponent } from './admin/datasource-repository/datasource-repository.component';
import { HomeComponent } from './home/home.component';
import { SourceRepoComponent } from './admin/source-repo/source-repo.component';
import { AdminAccountComponent } from './admin/admin-account/admin-account.component';
import { AdminAccountEditComponent } from './admin/admin-account/admin-account-edit/admin-account-edit.component';
import { AuthModule } from './core/auth/auth.module';
import { HeaderComponent } from './core/components/header/header.component';
import { SiteLogoComponent } from './core/components/header/site-logo/site-logo.component';
import { SiteCorouselComponent } from './core/components/site-corousel/site-corousel.component';
import { HomeMenuComponent } from './core/components/header/home-menu/home-menu.component';
import { AdminAccountMenuComponent } from './core/components/header/admin-account-menu/admin-account-menu.component';
import { SignInComponent } from './core/components/header/sign-in/sign-in.component';
import { ModalComponent } from './admin/assets/modal.component';
import { AdminFooterComponent } from './admin/admin-footer/admin-footer.component';
import { FarmRequestComponent } from './user/components/farm-request/farm-request.component';
import { UserComponent } from './user/user.component';
import { SidebarComponent } from './core/components/sidebar/sidebar.component';
import { ConfirmMailComponent } from './core/components/confirm-mail/confirm-mail.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { UserSxComponent } from './user/components/user-sx/user-sx.component';
import { FarmersAdvisorsArticleComponent } from './farmers-advisors-article/farmers-advisors-article.component';
import { ResearchersArticleComponent } from './researchers-article/researchers-article.component';
import { DevelopersArticleComponent } from './developers-article/developers-article.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from "ngx-bootstrap/popover";
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ToastrModule } from "ngx-toastr";
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FarmShareComponent } from './user/components/farm-share/farm-share.component';
import { SettingsComponent } from './user/components/settings/settings.component';
import { ManageAlertsComponent } from './user/components/manage-alerts/manage-alerts.component';
import { CustomizeDashboardComponent } from './user/components/customize-dashboard/customize-dashboard.component';
import { FarmComponent } from './user/components/farm/farm.component';
import { ManageFarmComponent } from './user/components/farm/manage-farm/manage-farm.component';
import { FieldEditComponent } from './user/components/field/field-edit/field-edit.component';
import { ApplicationPipesModule } from './shared/pipes/application-pipes.module';
import { LoggerModule, NgxLoggerLevel } from "ngx-logger";
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { LanguageSelectorComponent } from './language-selector/language-selector.component';
import { NgxFlagPickerModule } from 'ngx-flag-picker';
import { ResetPasswordComponent } from './core/components/reset-password/reset-password.component';
import { UserInformationPageComponent } from './user/components/user-information-page/user-information-page.component';

@NgModule({
  declarations: [
    ConfirmMailComponent,
    AdminFooterComponent,
    AccordionsComponent,
    ModalComponent,
    TabsComponent,
    IconsComponent,
    DropdownsComponent,
    AdminSxComponent,
    AdminBreadcumbsComponent,
    AppComponent,
    KeepHtmlPipe,
    RunScriptsDirective,
    AdminComponent,
    ContentManagementSystemComponent,
    AddUserComponent,
    UserListComponent,
    UserProfileComponent,
    DatasourceRepositoryComponent,
    ManageMetadataComponent,
    ManageCatalogueComponent,
    AccountComponent,
    EditAccountComponent,
    CropListComponent,
    AddCropComponent,
    ManageCropComponent,
    EditCropComponent,
    PestDiseaseListComponent,
    ManagePestDiseaseComponent,
    ActionListComponent,
    AddActionComponent,
    EditActionComponent,
    ObservationListComponent,
    AddObservationComponent,
    EditObservationComponent,
    AddPestDiseaseComponent,
    AlertComponent,
    FooterComponent,
    DashboardManagerComponent,
    AddDashboardComponent,
    EditDashboardComponent,
    DatasourceRepositoryComponent,
    HomeComponent,
    SourceRepoComponent,
    AdminAccountComponent,
    AdminAccountEditComponent,
    HeaderComponent,
    HomeMenuComponent,
    AdminAccountMenuComponent,
    SiteLogoComponent,
    SignInComponent,
    SiteCorouselComponent,
    AdminHeaderComponent,
    UserHeaderComponent,
    FarmRequestComponent,
    MenuComponent,
    UserComponent,
    SidebarComponent,
    ConfirmMailComponent,
    UserSxComponent,
    FarmersAdvisorsArticleComponent,
    ResearchersArticleComponent,
    DevelopersArticleComponent,
    FarmShareComponent,
    SettingsComponent,
    ManageAlertsComponent,
    CustomizeDashboardComponent,
    FarmComponent,
    ManageFarmComponent,
    FieldEditComponent,
    LanguageSelectorComponent,
    ResetPasswordComponent,
    UserInformationPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CookieModule.forRoot(),
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    PopoverModule.forRoot(),
    MDBBootstrapModule.forRoot(),
    ToastrModule.forRoot(),
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    AuthModule,
    ModalModule.forRoot(),
    ApplicationPipesModule.forRoot(),
    LoggerModule.forRoot({level: NgxLoggerLevel.ERROR, serverLogLevel: NgxLoggerLevel.OFF}),
    // ngx-translate and the loader module
    HttpClientModule,
    TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    }),
    CarouselModule,
    NgxFlagPickerModule
  ],
  providers: [EppoCodeService],
  bootstrap: [AppComponent],
})
export class AppModule {}
// TODO https://pumpingco.de/blog/environment-variables-angular-docker/

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient,"/i18n/",".json");
}