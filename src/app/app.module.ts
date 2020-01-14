import { UserComponent } from "./user/user.component";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { KeepHtmlPipe } from "./keep-html.pipe";
import { RunScriptsDirective } from "./run-scripts.directive";
import { AdminComponent } from "./admin/admin.component";
import { Routes, RouterModule } from "@angular/router";
import { AccountComponent } from "./user/components/account/account.component";
import { EditAccountComponent } from "./user/components/account/edit-account/edit-account.component";
import { ContentManagementSystemComponent } from "./admin/content-management-system/content-management-system.component";
import { AddUserComponent } from "./admin/add-user/add-user.component";
import { UserListComponent } from "./admin/user-list/user-list.component";
import { UserProfileComponent } from "./admin/user-profile/user-profile.component";
import { DatasetRepositoryComponent } from "./admin/dataset-repository/dataset-repository.component";
import { ManageMetadataComponent } from "./admin/manage-metadata/manage-metadata.component";
import { ManageCatalogueComponent } from "./admin/manage-catalogue/manage-catalogue.component";

const appRoutes: Routes = [
  { path: "admin", component: AdminComponent },
  { path: "admin/cms", component: ContentManagementSystemComponent },
  { path: "admin/add-user", component: AddUserComponent },
  { path: "admin/user-list", component: UserListComponent },
  { path: "admin/user-profile", component: UserProfileComponent },
  { path: "admin/dataset-repo", component: DatasetRepositoryComponent },
  { path: "admin/manage-metadata", component: ManageMetadataComponent },
  { path: "admin/manage-catalogue", component: ManageCatalogueComponent },
  { path: "admin", component: AdminComponent },
  { path: "user", component: UserComponent },
  { path: "user/account", component: AccountComponent },
  { path: "user/account/edit", component: EditAccountComponent }
];

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
    EditAccountComponent
  ],
  imports: [BrowserModule, RouterModule.forRoot(appRoutes)],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
