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
import { DatasetRepositoryComponent } from './admin/dataset-repository/dataset-repository.component';
import { ManageMetadataComponent } from './admin/manage-metadata/manage-metadata.component';
import { ManageCatalogueComponent } from './admin/manage-catalogue/manage-catalogue.component';
import { UserComponent } from './user/user.component';
import { AccountComponent } from './user/components/account/account.component';
import { EditAccountComponent } from './user/components/account/edit-account/edit-account.component';

const appRoutes: Routes = [
  { path: 'admin', component: AdminComponent },
  { path: 'admin/cms', component: ContentManagementSystemComponent },
  { path: 'admin/add-user', component: AddUserComponent },
  { path: 'admin/user-list', component: UserListComponent },
  { path: 'admin/user-profile', component: UserProfileComponent },
  { path: 'admin/dataset-repo', component: DatasetRepositoryComponent },
  { path: 'admin/manage-metadata', component: ManageMetadataComponent },
  { path: 'admin/manage-catalogue', component: ManageCatalogueComponent },
  { path: 'user', component: UserComponent },
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
  {
    path: 'user/pest-disease/observation-list',
    component: ObservationListComponent
  },
  {
    path: 'user/pest-disease/pest-disease-list',
    component: PestDiseaseListComponent
  },
  { path: 'user/pest-disease/add', component: AddPestDiseaseComponent },
  { path: 'user/pest-disease/alert', component: AlertComponent },
  { path: 'user/pest-disease/manage', component: ManagePestDiseaseComponent },
  { path: 'user/dashboard-manager', component: DashboardManagerComponent },
  { path: 'user/dashboard-manager/add', component: AddDashboardComponent },
  { path: 'user/dashboard-manager/edit', component: EditDashboardComponent },
  { path: 'user/dss/use-dashboard', component: UserComponent },
  { path: 'user/dss/evaluation-dashboard', component: UserComponent },
  { path: 'user/dss/adaptation-dashboard', component: UserComponent },
  { path: 'user/dss/integration-dashboard', component: UserComponent },
  { path: 'user/dss/list', component: UserComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
