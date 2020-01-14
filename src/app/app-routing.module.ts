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
  { path: 'user/farm', component: UserComponent },
  { path: 'user/farm/edit', component: UserComponent },
  { path: 'user/farm/add', component: UserComponent },
  { path: 'user/farm/list', component: UserComponent },
  { path: 'user/farm/manage', component: UserComponent },
  { path: 'user/crop/add', component: UserComponent },
  { path: 'user/crop/edit', component: UserComponent },
  { path: 'user/crop/manage', component: UserComponent },
  { path: 'user/crop/list', component: UserComponent },
  { path: 'user/pest-disease/action-list', component: UserComponent },
  { path: 'user/pest-disease/observation-list', component: UserComponent },
  { path: 'user/pest-disease/pest-disease-list', component: UserComponent },
  { path: 'user/pest-disease/add', component: UserComponent },
  { path: 'user/pest-disease/alert', component: UserComponent },
  { path: 'user/pest-disease/manage', component: UserComponent },
  { path: 'user/dashboard-manager', component: UserComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
