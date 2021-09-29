import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BingoNewGameComponent } from './player/bingo-new-game/bingo-new-game.component';
import { BingoAdminComponent } from './admin/bingo-admin/bingo-admin.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MaterialModule } from './shared/material.module';
import { TrimFirstPipe } from './shared/trim-first.pipe';
import { ConfirmationDialogComponent } from './player/confirmation-dialog/confirmation-dialog.component';
import { BingoResultComponent } from './player/bingo-result/bingo-result.component';
import { LoginComponent } from './admin/login/login.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  { path: '', component: BingoNewGameComponent },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)  },
  { path: '**', component: PageNotFoundComponent }
];
@NgModule({
  declarations: [
    AppComponent,
    BingoNewGameComponent,
    BingoAdminComponent,
    PageNotFoundComponent,
    TrimFirstPipe,
    ConfirmationDialogComponent,
    BingoResultComponent,
    LoginComponent,
    AdminHomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    NgbModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
