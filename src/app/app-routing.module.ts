import { CustomizeDashboardComponent } from './user/components/customize-dashboard/customize-dashboard.component';
import { ManageAlertsComponent } from './user/components/manage-alerts/manage-alerts.component';
import { ManageWeatherDataSourceComponent } from './user/components/manage-weather-data-source/manage-weather-data-source.component';
import { JsonFormDemoComponent } from './json-form-demo/json-form-demo.component';
import { DevelopersArticleComponent } from "./developers-article/developers-article.component";
import { ResearchersArticleComponent } from "./researchers-article/researchers-article.component";
import { FarmersAdvisorsArticleComponent } from "./farmers-advisors-article/farmers-advisors-article.component";
import { ConfirmMailComponent } from "./core/components/confirm-mail/confirm-mail.component";
import { AdminAccountEditComponent } from "./admin/admin-account/admin-account-edit/admin-account-edit.component";
import { AdminAccountComponent } from "./admin/admin-account/admin-account.component";
import { SourceRepoComponent } from "./admin/source-repo/source-repo.component";
import { DssUseDashboardEditComponent } from "./user/components/dss/dss-use-dashboard/dss-use-dashboard-edit/dss-use-dashboard-edit.component";
import { DssStatusDetailComponent } from "./user/components/dss/dss-detail/dss-platform-status/dss-status-detail/dss-status-detail.component";
import { WeatherParametersDetailComponent } from "./user/components/dss/dss-detail/dss-parameters-description/weather-parameters-detail/weather-parameters-detail.component";
import { UpdateParametersComponent } from "./user/components/dss/dss-detail/update-parameters/update-parameters.component";
import { DssPlatformStatusComponent } from "./user/components/dss/dss-detail/dss-platform-status/dss-platform-status.component";
import { DssParametersDetailComponent } from "./user/components/dss/dss-detail/dss-parameters-detail/dss-parameters-detail.component";
import { DssOutputsDescriptionComponent } from "./user/components/dss/dss-detail/dss-outputs-description/dss-outputs-description.component";
import { DssInputsDescriptionComponent } from "./user/components/dss/dss-detail/dss-inputs-description/dss-inputs-description.component";
import { DssParametersDescriptionComponent } from "./user/components/dss/dss-detail/dss-parameters-description/dss-parameters-description.component";
import { EditDssObservationComponent } from "./user/components/dss/dss-detail/dss-observation-list/edit-dss-observation/edit-dss-observation.component";
import { AddDssObservationComponent } from "./user/components/dss/dss-detail/dss-observation-list/add-dss-observation/add-dss-observation.component";
import { DssObservationListComponent } from "./user/components/dss/dss-detail/dss-observation-list/dss-observation-list.component";
import { DssDetailComponent } from "./user/components/dss/dss-detail/dss-detail.component";
import { HomeComponent } from "./home/home.component";
import { AddObservationComponent } from "./user/components/pest-disease/observation-list/add-observation/add-observation.component";
import { EditObservationComponent } from "./user/components/pest-disease/observation-list/edit-observation/edit-observation.component";
import { EditActionComponent } from "./user/components/pest-disease/action-list/edit-action/edit-action.component";
import { AddActionComponent } from "./user/components/pest-disease/action-list/add-action/add-action.component";
import { DssListComponent } from "./user/components/dss/dss-list/dss-list.component";
import { DssIntegrationDashboardComponent } from "./user/components/dss/dss-integration-dashboard/dss-integration-dashboard.component";
import { DssAdaptationDashboardComponent } from "./user/components/dss/dss-adaptation-dashboard/dss-adaptation-dashboard.component";
import { DssEvaluationDashboardComponent } from "./user/components/dss/dss-evaluation-dashboard/dss-evaluation-dashboard.component";
import { DssUseDashboardComponent } from "./user/components/dss/dss-use-dashboard/dss-use-dashboard.component";
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
import { ManageFarmComponent } from "./user/components/farm/manage-farm/manage-farm.component";
import { FarmListComponent } from "./user/components/farm/farm-list/farm-list.component";
import { AddFarmComponent } from "./user/components/farm/add-farm/add-farm.component";
import { EditFarmComponent } from "./user/components/farm/edit-farm/edit-farm.component";
import { FarmComponent } from "./user/components/farm/farm.component";
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
import { FarmRequestComponent } from "./user/components/farm-request/farm-request.component";
import { FarmDetailsComponent } from "./user/components/farm/farm-details/farm-details.component";
import { DssSelectionComponent } from "@app/user/components/dss/dss-selection/dss-selection.component";
import { FieldAddComponent } from './user/components/field/field-add/field-add.component';
import { FieldEditComponent } from './user/components/field/field-edit/field-edit.component';
import { SettingsComponent } from './user/components/settings/settings.component';

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
  { path: "json-schema-demo", component: JsonFormDemoComponent },
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
    path: "user/settings",
    component: SettingsComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/settings/manage-weather",
    component: ManageWeatherDataSourceComponent,
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
    path: "user/farm",
    component: FarmComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/farm-request",
    component: FarmRequestComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/farm/edit",
    component: EditFarmComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/farm/add",
    component: AddFarmComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/farm/list",
    component: FarmListComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/farm/manage",
    component: ManageFarmComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/farm/details",
    component: FarmDetailsComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/field/add",
    component: FieldAddComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/field/edit",
    component: FieldEditComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/dss/selection",
    component: DssSelectionComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
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
  },
  {
    path: "user/dss/use-dashboard",
    component: DssUseDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/dss/use-dashboard/edit",
    component: DssUseDashboardEditComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/dss/evaluation-dashboard",
    component: DssEvaluationDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/dss/adaptation-dashboard",
    component: DssAdaptationDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/dss/integration-dashboard",
    component: DssIntegrationDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/dss/list",
    component: DssListComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/dss/details",
    component: DssDetailComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/dss/details/observation-list",
    component: DssObservationListComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/dss/details/observation-list/add",
    component: AddDssObservationComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/dss/details/observation-list/edit",
    component: EditDssObservationComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/dss/details/parameters-description",
    component: DssParametersDescriptionComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/dss/details/parameters-description/weather-parameters-detail",
    component: WeatherParametersDetailComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/dss/details/inputs-description",
    component: DssInputsDescriptionComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/dss/details/outputs-description",
    component: DssOutputsDescriptionComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/dss/details/parameters-detail",
    component: DssParametersDetailComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/dss/details/platform-status/dss-status-detail",
    component: DssStatusDetailComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/dss/details/platform-status",
    component: DssPlatformStatusComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
  {
    path: "user/dss/details/update-parameters",
    component: UpdateParametersComponent,
    canActivate: [AuthGuard],
    data: { roles: [], claims: ["developer", "farmer", "advisor"] },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
