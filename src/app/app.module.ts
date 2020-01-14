import { UserComponent } from './user/user.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KeepHtmlPipe } from './keep-html.pipe';
import { RunScriptsDirective } from './run-scripts.directive';
import { AdminComponent } from './admin/admin.component';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './user/components/account/account.component';
import { EditAccountComponent } from './user/components/account/edit-account/edit-account.component';

const appRoutes: Routes = [
  { path: 'admin', component: AdminComponent },
  { path: 'user', component: UserComponent },
  { path: 'user/account', component: AccountComponent },
  { path: 'user/account/edit', component: EditAccountComponent }

];

@NgModule({
  declarations: [
    AppComponent,
    KeepHtmlPipe,
    RunScriptsDirective,
    AdminComponent,
    UserComponent,
    AccountComponent,
    EditAccountComponent
  ],
  imports: [BrowserModule, RouterModule.forRoot(appRoutes)],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
