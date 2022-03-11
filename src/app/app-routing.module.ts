import { CustomizeDashboardComponent } from './user/components/customize-dashboard/customize-dashboard.component';
import { ManageAlertsComponent } from './user/components/manage-alerts/manage-alerts.component';
import { DevelopersArticleComponent } from "./developers-article/developers-article.component";
import { ResearchersArticleComponent } from "./researchers-article/researchers-article.component";
import { FarmersAdvisorsArticleComponent } from "./farmers-advisors-article/farmers-advisors-article.component";
import { ConfirmMailComponent } from "./core/components/confirm-mail/confirm-mail.component";
import { AdminAccountEditComponent } from "./admin/admin-account/admin-account-edit/admin-account-edit.component";
import { AdminAccountComponent } from "./admin/admin-account/admin-account.component";
import { SourceRepoComponent } from "./admin/source-repo/source-repo.component";
import { HomeComponent } from "./home/home.component";
import { AddObservationComponent } from "./user/components/pest-disease/observation-list/add-observation/add-observation.component";
import { EditObservationComponent } from "./user/components/pest-disease/observation-list/edit-observation/edit-observation.component";
import { EditActionComponent } from "./user/components/pest-disease/action-list/edit-action/edit-action.component";
import { AddActionComponent } from "./user/components/pest-disease/action-list/add-action/add-action.component";
import { EditDashboardComponent } from "./user/components/dashboard-manager/edit-dashboard/edit-dashboard.component";
import { AddDashboardComponent } from "./user/components/dashboard-manager/add-dashboard/add-dashboard.component";
import { DashboardManagerComponent } from "./user/components/dashboard-manager/dashboard-manager.component";
import { ManagePestDiseaseComponent } from "./user/components/pest-disease/manage-pest-disease/manage-pest-disease.component";
import { AlertComponent } from "./user/components/pest-disease/alert/alert.component";
import { AddPestDiseaseComponent } from "./user/components/pest-disease/add-pest-disease/add-pest-disease.component";
import { PestDiseaseListComponent } from "./user/components/pest-disease/pest-disease-list/pest-disease-list.component";
import { ObservationListComponent } from "./user/components/pest-disease/observation-list/observation-list.component";
import { ActionListComponent } from "./user/components/pest-disease/action-list/action-list.component";
import { CropListComponent } from "./user/components/crop/crop-list/crop-list.component";
import { ManageCropComponent } from "./user/components/crop/manage-crop/manage-crop.component";
import { EditCropComponent } from "./user/components/crop/edit-crop/edit-crop.component";
import { AddCropComponent } from "./user/components/crop/add-crop/add-crop.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AdminComponent } from "./admin/admin.component";
import { ContentManagementSystemComponent } from "./admin/content-management-system/content-management-system.component";
import { AddUserComponent } from "./admin/add-user/add-user.component";
import { UserListComponent } from "./admin/user-list/user-list.component";
import { UserProfileComponent } from "./admin/user-profile/user-profile.component";
import { DatasourceRepositoryComponent } from "./admin/datasource-repository/datasource-repository.component";
import { ManageMetadataComponent } from "./admin/manage-metadata/manage-metadata.component";
import { ManageCatalogueComponent } from "./admin/manage-catalogue/manage-catalogue.component";
import { AccountComponent } from "./user/components/account/account.component";
import { EditAccountComponent } from "./user/components/account/edit-account/edit-account.component";
import { AuthGuard } from "./core/auth/guard/auth.guard";
import { Role } from "./core/auth/enums/role.enum";
import { AdminHeaderComponent } from "./admin/admin-header/admin-header.component";
import { AdminSxComponent } from "./admin/admin-sx/admin-sx.component";
import { AccordionsComponent } from "./admin/assets/accordions.component";
import { AdminBreadcumbsComponent } from "./admin/admin-breadcumbs/admin-breadcumbs.component";
import { DropdownsComponent } from "./admin/assets/dropdowns.component";
import { IconsComponent } from "./admin/assets/icons.component";
import { TabsComponent } from "./admin/assets/tabs.component";
import { ModalComponent } from "./admin/assets/modal.component";
import { AdminFooterComponent } from "./admin/admin-footer/admin-footer.component";
import { LoginComponent } from "./core/auth/pages/login/login.component";
import { SettingsComponent } from './user/components/settings/settings.component';
import { UserComponent } from './user/user.component';
import { ResetPasswordComponent } from './core/components/reset-password/reset-password.component';

const appRoutes: Routes = [
  { path: "", component: HomeComponent },
  {
    path: "admin",
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin], claims: [] },
  },
  { path: "login", component: LoginComponent },
  {
    path: "farmer-advisor-article",
    component: FarmersAdvisorsArticleComponent,
  },
  { path: "research-article", component: ResearchersArticleComponent },
  { path: "coding-article", component: DevelopersArticleComponent },
  { path: "confirmemail", component: ConfirmMailComponent },
  { path: "resetpassword", component: ResetPasswordComponent },
  {
    path: "admin/account",
    component: AdminAccountComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin], claims: [] },
  },
  {
    path: "admin/admin-header",
    component: AdminHeaderComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin], claims: [] },
  },
  {
    path: "admin/admin-footer",
    component: AdminFooterComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin], claims: [] },
  },
  {
    path: "admin/admin-sx",
    component: AdminSxComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin], claims: [] },
  },
  {
    path: "admin/admin-breadcumbs",
    component: AdminBreadcumbsComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin], claims: [] },
  },
  {
    path: "admin/assets/accordions",
    component: AccordionsComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin], claims: [] },
  },
  {
    path: "admin/assets/dropdowns",
    component: DropdownsComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin], claims: [] },
  },
  {
    path: "admin/assets/icons",
    component: IconsComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin], claims: [] },
  },
  {
    path: "admin/assets/tabs",
    component: TabsComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin], claims: [] },
  },
  {
    path: "admin/assets/modal",
    component: ModalComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin], claims: [] },
  },
  {
    path: "admin/account/edit",
    component: AdminAccountEditComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin], claims: [] },
  },
  {
    path: "admin/cms",
    component: ContentManagementSystemComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin], claims: [] },
  },
  {
    path: "admin/add-user",
    component: AddUserComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin], claims: [] },
  },
  {
    path: "admin/user-list",
    component: UserListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin], claims: [] },
  },
  {
    path: "admin/user-profile",
    component: UserProfileComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin], claims: [] },
  },
  {
    path: "admin/datasource-repo",
    component: DatasourceRepositoryComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin], claims: [] },
  },
  {
    path: "admin/manage-metadata",
    component: ManageMetadataComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin], claims: [] },
  },
  {
    path: "admin/manage-catalogue",
    component: ManageCatalogueComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin], claims: [] },
  },
  {
    path: "admin/source-repo",
    component: SourceRepoComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin], claims: [] },
  },
  {
    path: "user/account",
    component: AccountComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/account/edit",
    component: EditAccountComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/settings/manage-alerts",
    component: ManageAlertsComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/settings/customize-dashboard",
    component: CustomizeDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user",
    component: UserComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
    children:[
      {
        path: '',
        redirectTo: 'farm',
        pathMatch: 'prefix'
      },
      {
        path: 'farm',
        loadChildren: () => import('./user/components/farm/farm.module').then(m => m.FarmModule)
      },
      {
        path: 'dss',
        loadChildren: () => import('./user/components/dss/dss-selection.module').then(m => m.DssSelectionModule)
      }
    ]
  },
  {
    path: "user/settings",
    component: SettingsComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
    children:[
      {   
        path: 'manage-weather',
        loadChildren: () => import('./user/components/manage-weather-data-source/manage-weather-data-source.module').then(m => m.EffectorManageWeatherDataSourceModule)
      }
    ]
  },
  {
    path: "user/crop/add",
    component: AddCropComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/crop/edit",
    component: EditCropComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/crop/manage",
    component: ManageCropComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/crop/list",
    component: CropListComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/pest-disease/action-list",
    component: ActionListComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/pest-disease/action-list/add",
    component: AddActionComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/pest-disease/action-list/edit",
    component: EditActionComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/pest-disease/observation-list",
    component: ObservationListComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/pest-disease/pest-disease-list",
    component: PestDiseaseListComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/pest-disease/observation-list/edit",
    component: EditObservationComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/pest-disease/observation-list/add",
    component: AddObservationComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/pest-disease/add",
    component: AddPestDiseaseComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/pest-disease/alert",
    component: AlertComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/pest-disease/manage",
    component: ManagePestDiseaseComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/dashboard-manager",
    component: DashboardManagerComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/dashboard-manager/add",
    component: AddDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/dashboard-manager/edit",
    component: EditDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
