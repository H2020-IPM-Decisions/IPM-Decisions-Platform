import { ForgetPasswordComponent } from './core/auth/pages/forget-password/forget-password.component';
import { RegisterComponent } from './core/auth/pages/register/register.component';
import { LoginComponent } from './core/auth/pages/login/login.component';
import { FooterComponent } from './core/components/footer/footer.component';
import { TermsComponent } from './core/auth/pages/terms/terms.component';
import { DssParametersDetailComponent } from './user/components/dss/dss-detail/dss-parameters-detail/dss-parameters-detail.component';
import { EditDssObservationComponent } from './user/components/dss/dss-detail/dss-observation-list/edit-dss-observation/edit-dss-observation.component';
import { DssObservationListComponent } from './user/components/dss/dss-detail/dss-observation-list/dss-observation-list.component';
import { AddDssObservationComponent } from './user/components/dss/dss-detail/dss-observation-list/add-dss-observation/add-dss-observation.component';
import { DssDetailComponent } from './user/components/dss/dss-detail/dss-detail.component';
import { EditFarmComponent } from './user/components/farm/edit-farm/edit-farm.component';
import { EditAccountComponent } from './user/components/account/edit-account/edit-account.component';
import { AccountComponent } from './user/components/account/account.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { AdminHeaderComponent } from './admin/admin-header/admin-header.component';
import { UserHeaderComponent } from './user/components/user-header/user-header.component';

@NgModule({
  declarations: [
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
    AdminHeaderComponent,
    UserHeaderComponent,
    LoginComponent,
    RegisterComponent,
    ForgetPasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
