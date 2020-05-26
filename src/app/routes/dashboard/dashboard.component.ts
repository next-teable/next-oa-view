import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  constructor(private http: _HttpClient) {}

  contractPieData = [];
  salesData: any[] = new Array(12).fill({}).map((_i, idx) => ({
    x: `${idx + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200,
  }));

  chartData: any[] = [];

  ngOnInit() {
    // this.http.get('/dashboard/executionContractPie').subscribe(result => {
    //   this.contractPieData = result;
    // });
    // this.total = `12 ${this.contractPieData.length}`;
    // this.total = `&yen ${this.contractPieData.reduce((pre, now) => now.y + pre, 0).toFixed(2)}`;
    for (let i = 0; i < 20; i += 1) {
      this.chartData.push({
        x: new Date().getTime() + 1000 * 60 * 30 * i,
        y1: Math.floor(Math.random() * 100) + 1000,
        y2: Math.floor(Math.random() * 100) + 10,
      });
    }
  }
}
