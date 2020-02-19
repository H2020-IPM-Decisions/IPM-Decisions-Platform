import { TermsComponent } from './core/auth/pages/terms/terms.component';
import { AdminAccountEditComponent } from './admin/admin-account/admin-account-edit/admin-account-edit.component';
import { AdminAccountComponent } from './admin/admin-account/admin-account.component';
import { DssUseDashboardEditComponent } from './user/components/dss/dss-use-dashboard/dss-use-dashboard-edit/dss-use-dashboard-edit.component';
import { SourceRepoComponent } from './admin/source-repo/source-repo.component';
import { DssStatusDetailComponent } from './user/components/dss/dss-detail/dss-platform-status/dss-status-detail/dss-status-detail.component';
import { WeatherParametersDetailComponent } from './user/components/dss/dss-detail/dss-parameters-description/weather-parameters-detail/weather-parameters-detail.component';
import { UpdateParametersComponent } from './user/components/dss/dss-detail/update-parameters/update-parameters.component';
import { DssPlatformStatusComponent } from './user/components/dss/dss-detail/dss-platform-status/dss-platform-status.component';
import { DssParametersDetailComponent } from './user/components/dss/dss-detail/dss-parameters-detail/dss-parameters-detail.component';
import { DssOutputsDescriptionComponent } from './user/components/dss/dss-detail/dss-outputs-description/dss-outputs-description.component';
import { DssInputsDescriptionComponent } from './user/components/dss/dss-detail/dss-inputs-description/dss-inputs-description.component';
import { DssParametersDescriptionComponent } from './user/components/dss/dss-detail/dss-parameters-description/dss-parameters-description.component';

import { EditDssObservationComponent } from './user/components/dss/dss-detail/dss-observation-list/edit-dss-observation/edit-dss-observation.component';
import { AddDssObservationComponent } from './user/components/dss/dss-detail/dss-observation-list/add-dss-observation/add-dss-observation.component';
import { DssObservationListComponent } from './user/components/dss/dss-detail/dss-observation-list/dss-observation-list.component';
import { DssDetailComponent } from './user/components/dss/dss-detail/dss-detail.component';
import { HomeComponent } from './home/home.component';
import { AddObservationComponent } from './user/components/pest-disease/observation-list/add-observation/add-observation.component';
import { EditObservationComponent } from './user/components/pest-disease/observation-list/edit-observation/edit-observation.component';
import { EditActionComponent } from './user/components/pest-disease/action-list/edit-action/edit-action.component';
import { AddActionComponent } from './user/components/pest-disease/action-list/add-action/add-action.component';
import { DssListComponent } from './user/components/dss/dss-list/dss-list.component';
import { DssIntegrationDashboardComponent } from './user/components/dss/dss-integration-dashboard/dss-integration-dashboard.component';
import { DssAdaptationDashboardComponent } from './user/components/dss/dss-adaptation-dashboard/dss-adaptation-dashboard.component';
import { DssEvaluationDashboardComponent } from './user/components/dss/dss-evaluation-dashboard/dss-evaluation-dashboard.component';
import { DssUseDashboardComponent } from './user/components/dss/dss-use-dashboard/dss-use-dashboard.component';
import { EditDashboardComponent } from './user/components/dashboard-manager/edit-dashboard/edit-dashboard.component';
import { AddDashboardComponent } from './user/components/dashboard-manager/add-dashboard/add-dashboard.component';
import { DashboardManagerComponent } from './user/components/dashboard-manager/dashboard-manager.component';
import { ManagePestDiseaseComponent } from './user/components/pest-disease/manage-pest-disease/manage-pest-disease.component';
import { AlertComponent } from './user/components/pest-disease/alert/alert.component';
import { AddPestDiseaseComponent } from './user/components/pest-disease/add-pest-disease/add-pest-disease.component';
import { PestDiseaseListComponent } from './user/components/pest-disease/pest-disease-list/pest-disease-list.component';
import { ObservationListComponent } from './user/components/pest-disease/observation-list/observation-list.component';
import { ActionListComponent } from './user/components/pest-disease/action-list/action-list.component';
import { CropListComponent } from './user/components/crop/crop-list/crop-list.component';
import { ManageCropComponent } from './user/components/crop/manage-crop/manage-crop.component';
import { EditCropComponent } from './user/components/crop/edit-crop/edit-crop.component';
import { AddCropComponent } from './user/components/crop/add-crop/add-crop.component';
import { ManageFarmComponent } from './user/components/farm/manage-farm/manage-farm.component';
import { FarmListComponent } from './user/components/farm/farm-list/farm-list.component';
import { AddFarmComponent } from './user/components/farm/add-farm/add-farm.component';
import { EditFarmComponent } from './user/components/farm/edit-farm/edit-farm.component';
import { FarmComponent } from './user/components/farm/farm.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { ContentManagementSystemComponent } from './admin/content-management-system/content-management-system.component';
import { AddUserComponent } from './admin/add-user/add-user.component';
import { UserListComponent } from './admin/user-list/user-list.component';
import { UserProfileComponent } from './admin/user-profile/user-profile.component';
import { DatasourceRepositoryComponent } from './admin/datasource-repository/datasource-repository.component';
import { ManageMetadataComponent } from './admin/manage-metadata/manage-metadata.component';
import { ManageCatalogueComponent } from './admin/manage-catalogue/manage-catalogue.component';
import { AccountComponent } from './user/components/account/account.component';
import { EditAccountComponent } from './user/components/account/edit-account/edit-account.component';
import { LoginComponent } from './core/auth/pages/login/login.component';
import { RegisterComponent } from './core/auth/pages/register/register.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'admin', component: AdminComponent },
  { path: 'admin/account', component: AdminAccountComponent },
  { path: 'admin/account/edit', component: AdminAccountEditComponent },
  { path: 'admin/cms', component: ContentManagementSystemComponent },
  { path: 'admin/add-user', component: AddUserComponent },
  { path: 'admin/user-list', component: UserListComponent },
  { path: 'admin/user-profile', component: UserProfileComponent },
  { path: 'admin/datasource-repo', component: DatasourceRepositoryComponent },
  { path: 'admin/manage-metadata', component: ManageMetadataComponent },
  { path: 'admin/manage-catalogue', component: ManageCatalogueComponent },
  { path: 'admin/source-repo', component: SourceRepoComponent },
  { path: 'user/account', component: AccountComponent },
  { path: 'user/account/edit', component: EditAccountComponent },
  { path: 'user/farm', component: FarmComponent },
  { path: 'user/farm/edit', component: EditFarmComponent },
  { path: 'user/farm/add', component: AddFarmComponent },
  { path: 'user/farm/list', component: FarmListComponent },
  { path: 'user/farm/manage', component: ManageFarmComponent },
  { path: 'user/crop/add', component: AddCropComponent },
  { path: 'user/crop/edit', component: EditCropComponent },
  { path: 'user/crop/manage', component: ManageCropComponent },
  { path: 'user/crop/list', component: CropListComponent },
  { path: 'user/pest-disease/action-list', component: ActionListComponent },
  { path: 'user/pest-disease/action-list/add', component: AddActionComponent },
  { path: 'user/pest-disease/action-list/edit', component: EditActionComponent },
  {
    path: 'user/pest-disease/observation-list',
    component: ObservationListComponent
  },
  {
    path: 'user/pest-disease/pest-disease-list',
    component: PestDiseaseListComponent
  },
  {
    path: 'user/pest-disease/observation-list/edit',
    component: EditObservationComponent
  },
  {
    path: 'user/pest-disease/observation-list/add',
    component: AddObservationComponent
  },
  { path: 'user/pest-disease/add', component: AddPestDiseaseComponent },
  { path: 'user/pest-disease/alert', component: AlertComponent },
  { path: 'user/pest-disease/manage', component: ManagePestDiseaseComponent },
  { path: 'user/dashboard-manager', component: DashboardManagerComponent },
  { path: 'user/dashboard-manager/add', component: AddDashboardComponent },
  { path: 'user/dashboard-manager/edit', component: EditDashboardComponent },
  { path: 'user/dss/use-dashboard', component: DssUseDashboardComponent },
  { path: 'user/dss/use-dashboard/edit', component: DssUseDashboardEditComponent },
  { path: 'user/dss/evaluation-dashboard', component: DssEvaluationDashboardComponent },
  { path: 'user/dss/adaptation-dashboard', component: DssAdaptationDashboardComponent },
  { path: 'user/dss/integration-dashboard', component: DssIntegrationDashboardComponent },
  { path: 'user/dss/list', component: DssListComponent },
  { path: 'user/dss/details', component: DssDetailComponent },
  { path: 'user/dss/details/observation-list', component: DssObservationListComponent },
  { path: 'user/dss/details/observation-list/add', component: AddDssObservationComponent },
  { path: 'user/dss/details/observation-list/edit', component: EditDssObservationComponent },
  { path: 'user/dss/details/parameters-description', component: DssParametersDescriptionComponent },
  { path: 'user/dss/details/parameters-description/weather-parameters-detail', component: WeatherParametersDetailComponent },
  { path: 'user/dss/details/inputs-description', component: DssInputsDescriptionComponent },
  { path: 'user/dss/details/outputs-description', component: DssOutputsDescriptionComponent },
  { path: 'user/dss/details/parameters-detail', component: DssParametersDetailComponent },
  { path: 'user/dss/details/platform-status/dss-status-detail', component: DssStatusDetailComponent },
  { path: 'user/dss/details/platform-status', component: DssPlatformStatusComponent },
  { path: 'user/dss/details/update-parameters', component: UpdateParametersComponent },
  {path: 'register', component: RegisterComponent},
  {path: 'register/terms', component: TermsComponent},
  {path: 'login', component: LoginComponent}

  
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
