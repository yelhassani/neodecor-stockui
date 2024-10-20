import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = 'http://localhost:8080/api/stocks';  // Update with your backend URL

  constructor(private http: HttpClient) {}

  // Method to fetch all stocks
  findAllStocks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);  // JWT will be attached via AuthInterceptor
  }
}
