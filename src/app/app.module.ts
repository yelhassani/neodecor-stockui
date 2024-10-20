import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';  // <-- Import HttpClientModule
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { StockComponent } from './components/stock/stock.component';  // <-- Import StockComponent here
import { AuthGuard } from './guard/auth.guard';
import { AuthService } from './service/auth.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'stocks', component: StockComponent, canActivate: [AuthGuard] },  // <-- Route for StockComponent
  { path: '', redirectTo: '/stocks', pathMatch: 'full' }
];

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,   // <-- Import HttpClientModule
    RouterModule.forRoot(routes),
    LoginComponent,
    StockComponent
  ],
  providers: [
    AuthService,
    AuthGuard
  ],
  bootstrap: []
})
export class AppModule {}
