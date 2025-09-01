import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SellerNavbarComponent } from '../../components/seller Navbar/seller-navbar.component';
import { SellerService } from '../../services/seller.service';
import { UserService } from '../../services/user.service';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule, SellerNavbarComponent, RouterModule],
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller-dashboard.component.css'],
})
export class SellerDashboardComponent implements OnInit, AfterViewInit {
  summary: any = null;
  recentOrders: any[] = [];
  loading = true;
  error: string | null = null;

  @ViewChild('salesCanvas') salesCanvas!: ElementRef<HTMLCanvasElement>;
  salesChart!: Chart;
  showSalesCanvas = false;

  constructor(
    private router: Router,
    private sellerService: SellerService,
    private userService: UserService
  ) {}

  ngOnInit() {
    const sellerId = this.userService.getUserId();
    if (!sellerId) {
      this.error = 'No seller is logged in';
      this.loading = false;
      return;
    }

    this.sellerService.getSellerSummary(sellerId).subscribe({
      next: (data) => {
        this.summary = data;
        this.fetchRecentOrders();
        this.loading = false;
        this.showSalesCanvas = true;

        setTimeout(() => {
          if (this.salesCanvas && this.summary.productSales) {
            this.renderSalesChart();
          }
        }, 50);
      },
      error: () => {
        this.error = 'Failed to load seller stats';
        this.loading = false;
      },
    });
  }

  ngAfterViewInit() {
    if (this.summary?.productSales) {
      this.renderSalesChart();
    }
  }

  renderSalesChart() {
    if (!this.salesCanvas) return;

    if (this.salesChart) this.salesChart.destroy();

    const labels = Object.keys(this.summary.productSales);
    const data = Object.values(this.summary.productSales).map((v) => Number(v)); // <-- cast to number[]

    this.salesChart = new Chart(this.salesCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Units Sold',
            data, // now correctly typed as number[]
            backgroundColor: '#28a98b',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Sales per Product' },
        },
        scales: { y: { beginAtZero: true } },
      },
    });
  }

  fetchRecentOrders() {
    const sellerId = this.userService.getUserId();
    this.sellerService.getRecentOrders(sellerId!).subscribe((orders) => {
      this.recentOrders = orders.slice(0, 5);
    });
  }

  navigateTo(path: string) {
    this.router.navigate(['/' + path]);
  }

  downloadReport() {
    const sellerId = this.userService.getUserId();
    if (!sellerId) return;

    this.sellerService.exportSellerReport(sellerId).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'seller_report.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
