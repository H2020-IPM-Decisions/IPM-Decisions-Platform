import { EditFarmComponent } from './user/components/farm/edit-farm/edit-farm.component';
import { EditAccountComponent } from './user/components/account/edit-account/edit-account.component';
import { AccountComponent } from './user/components/account/account.component';
import { UserComponent } from './user/user.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KeepHtmlPipe } from './keep-html.pipe';
import { RunScriptsDirective } from './run-scripts.directive';
import { AdminComponent } from './admin/admin.component';
import { Routes, RouterModule } from '@angular/router';
import { ContentManagementSystemComponent } from './admin/content-management-system/content-management-system.component';
import { AddUserComponent } from './admin/add-user/add-user.component';
import { UserListComponent } from './admin/user-list/user-list.component';
import { UserProfileComponent } from './admin/user-profile/user-profile.component';
import { DatasetRepositoryComponent } from './admin/dataset-repository/dataset-repository.component';
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
  { path: 'user/account/edit', component: EditAccountComponent }
]

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
    DatasetRepositoryComponent,
    ManageMetadataComponent,
    ManageCatalogueComponent,
    UserComponent,
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
    AlertComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      appRoutes
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
