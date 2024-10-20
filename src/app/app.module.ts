import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';    // <-- Import ReactiveFormsModule here
import { HttpClientModule } from '@angular/common/http';  // <-- Import HttpClientModule for HTTP requests
import { RouterModule, Routes } from '@angular/router';  // <-- Import RouterModule for routing

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { StockComponent } from './components/stock/stock.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'stocks', component: StockComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }  // Redirect to login by default
];

@NgModule({
  declarations: [
    AppComponent,       // Declare AppComponent
    LoginComponent,     // Declare LoginComponent
    StockComponent      // Declare StockComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,  // <-- Import ReactiveFormsModule for formGroup in forms
    HttpClientModule,     // <-- Import HttpClientModule for HTTP requests
    RouterModule.forRoot(routes)  // Set up RouterModule with routes
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
