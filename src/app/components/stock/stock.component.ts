import { Component, OnInit } from '@angular/core';
import { StockService } from '../../service/stock.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
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