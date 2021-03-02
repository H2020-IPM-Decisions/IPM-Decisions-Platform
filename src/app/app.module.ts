import { MenuComponent } from './core/components/header/menu/menu.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DssParametersDetailComponent } from './user/components/dss/dss-detail/dss-parameters-detail/dss-parameters-detail.component';
import { EditDssObservationComponent } from './user/components/dss/dss-detail/dss-observation-list/edit-dss-observation/edit-dss-observation.component';
import { DssObservationListComponent } from './user/components/dss/dss-detail/dss-observation-list/dss-observation-list.component';
import { AddDssObservationComponent } from './user/components/dss/dss-detail/dss-observation-list/add-dss-observation/add-dss-observation.component';
import { DssDetailComponent } from './user/components/dss/dss-detail/dss-detail.component';
import { EditFarmComponent } from './user/components/farm/edit-farm/edit-farm.component';
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
import { FarmComponent } from './user/components/farm/farm.component';
import { FarmListComponent } from './user/components/farm/farm-list/farm-list.component';
import { AddFarmComponent } from './user/components/farm/add-farm/add-farm.component';
import { ManageFarmComponent } from './user/components/farm/manage-farm/manage-farm.component';
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
import { DssListComponent } from './user/components/dss/dss-list/dss-list.component';
import { DssUseDashboardComponent } from './user/components/dss/dss-use-dashboard/dss-use-dashboard.component';
import { DssEvaluationDashboardComponent } from './user/components/dss/dss-evaluation-dashboard/dss-evaluation-dashboard.component';
import { DssAdaptationDashboardComponent } from './user/components/dss/dss-adaptation-dashboard/dss-adaptation-dashboard.component';
import { DssIntegrationDashboardComponent } from './user/components/dss/dss-integration-dashboard/dss-integration-dashboard.component';
import { DatasourceRepositoryComponent } from './admin/datasource-repository/datasource-repository.component';
import { HomeComponent } from './home/home.component';
import { DssParametersDescriptionComponent } from './user/components/dss/dss-detail/dss-parameters-description/dss-parameters-description.component';
import { WeatherParametersDetailComponent } from './user/components/dss/dss-detail/dss-parameters-description/weather-parameters-detail/weather-parameters-detail.component';
import { DssInputsDescriptionComponent } from './user/components/dss/dss-detail/dss-inputs-description/dss-inputs-description.component';
import { DssOutputsDescriptionComponent } from './user/components/dss/dss-detail/dss-outputs-description/dss-outputs-description.component';
import { DssPlatformStatusComponent } from './user/components/dss/dss-detail/dss-platform-status/dss-platform-status.component';
import { UpdateParametersComponent } from './user/components/dss/dss-detail/update-parameters/update-parameters.component';
import { DssStatusDetailComponent } from './user/components/dss/dss-detail/dss-platform-status/dss-status-detail/dss-status-detail.component';
import { DssUseDashboardEditComponent } from './user/components/dss/dss-use-dashboard/dss-use-dashboard-edit/dss-use-dashboard-edit.component';
import { SourceRepoComponent } from './admin/source-repo/source-repo.component';
import { AdminAccountComponent } from './admin/admin-account/admin-account.component';
import { AdminAccountEditComponent } from './admin/admin-account/admin-account-edit/admin-account-edit.component';
import { AuthModule } from './core/auth/auth.module';
import { CmsLinkPipe } from './shared/pipes/cms-link.pipe';
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
import { FarmDetailsComponent } from './user/components/farm/farm-details/farm-details.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { UserSxComponent } from './user/components/user-sx/user-sx.component';
import { FarmersAdvisorsArticleComponent } from './farmers-advisors-article/farmers-advisors-article.component';
import { ResearchersArticleComponent } from './researchers-article/researchers-article.component';
import { DevelopersArticleComponent } from './developers-article/developers-article.component';
import { DssSelectionComponent } from '@app/user/components/dss/dss-selection/dss-selection.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from "ngx-bootstrap/popover";
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ToastrModule } from "ngx-toastr";
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FieldAddComponent } from './user/components/field/field-add/field-add.component';
import { FieldEditComponent } from './user/components/field/field-edit/field-edit.component';
import { FarmShareComponent } from './user/components/farm-share/farm-share.component';
import { JsonFormDemoComponent } from './json-form-demo/json-form-demo.component';
import { SettingsComponent } from './user/components/settings/settings.component';
import { ManageWeatherDataSourceComponent } from './user/components/manage-weather-data-source/manage-weather-data-source.component';
import { ManageAlertsComponent } from './user/components/manage-alerts/manage-alerts.component';
import { CustomizeDashboardComponent } from './user/components/customize-dashboard/customize-dashboard.component';

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
    FarmComponent,
    FarmListComponent,
    AddFarmComponent,
    ManageFarmComponent,
    EditFarmComponent,
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
    DssListComponent,
    DssUseDashboardComponent,
    DssEvaluationDashboardComponent,
    DssAdaptationDashboardComponent,
    DssIntegrationDashboardComponent,
    DatasourceRepositoryComponent,
    HomeComponent,
    DssDetailComponent,
    AddDssObservationComponent,
    EditDssObservationComponent,
    DssObservationListComponent,
    DssParametersDescriptionComponent,
    WeatherParametersDetailComponent,
    DssInputsDescriptionComponent,
    DssOutputsDescriptionComponent,
    DssPlatformStatusComponent,
    UpdateParametersComponent,
    DssStatusDetailComponent,
    DssParametersDetailComponent,
    DssUseDashboardEditComponent,
    SourceRepoComponent,
    AdminAccountComponent,
    AdminAccountEditComponent,
    CmsLinkPipe,
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
    FarmDetailsComponent,
    UserSxComponent,
    FarmersAdvisorsArticleComponent,
    ResearchersArticleComponent,
    DevelopersArticleComponent,
    DssSelectionComponent,
    FieldAddComponent,
    FieldEditComponent,
    FarmShareComponent,
    JsonFormDemoComponent,
    SettingsComponent,
    ManageWeatherDataSourceComponent,
    ManageAlertsComponent,
    CustomizeDashboardComponent,
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
    ModalModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
