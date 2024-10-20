import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { StocksComponent } from './components/stocks/stocks.component';
import { Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // Main page
  { path: 'stocks', component: StocksComponent, canActivate: [AuthGuard] },  // Authenticated page
  { path: 'login', component: LoginComponent },  // Login page
];

@NgModule({
  declarations: [
    LoginComponent,
    StocksComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: []
})
export class AppModule {}
