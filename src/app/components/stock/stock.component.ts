import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';  // Import HttpClientModule for HTTP requests
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StockService } from '../../service/stock.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
  standalone: true,   // <-- Mark this component as standalone
  imports: [
    CommonModule,
    HttpClientModule,  // Required for making HTTP requests
    RouterModule
  ],
  providers: [
    StockService  // Provide StockService if needed
  ]
})
export class StockComponent {
  stocks: any[] = [];  // Array to store stock data

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.stockService.findAllStocks().subscribe(
      (data: any[]) => {
        this.stocks = data;
      },
      error => {
        console.error('Error fetching stocks', error);
      }
    );
  }
}
