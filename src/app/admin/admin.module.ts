import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BingoAdminComponent } from './bingo-admin/bingo-admin.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthGuard } from '../shared/auth.guard';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { FormFieldsComponent } from './form-field/form-field.component';
import { MaterialModule } from '../shared/material.module';

const routes: Routes = [
  {
    path: '', component: BingoAdminComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
      { path: 'forgotPassword', component: ForgotPasswordComponent, canActivate: [AuthGuard] },
      { path: 'home', component: AdminHomeComponent, canActivate: [AuthGuard] },
    ]
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [ForgotPasswordComponent, RegisterComponent, FormFieldsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ]
})
export class AdminModule {

}
