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

import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = (pdfFonts as any).vfs || (pdfFonts as any).pdfMake?.vfs;
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
    if (!this.summary) return;

    const docDefinition: any = {
      content: [
        { text: 'Seller Report', style: 'header' },
        {
          text: `Generated on: ${new Date().toLocaleString()}`,
          style: 'subheader',
        },
        { text: '\n' },

        {
          table: {
            widths: ['*', '*'],
            body: [
              ['Total Revenue', `Rs ${this.summary.totalRevenue}`],
              ['Total Orders', this.summary.totalOrders],
              ['Total Products', this.summary.totalProducts],
              [
                'Top Product',
                this.summary.topProduct
                  ? `${this.summary.topProduct.name} (${this.summary.topProduct.sold} sold)`
                  : 'N/A',
              ],
            ],
          },
        },

        { text: '\nRecent Orders', style: 'subheader' },
        {
          table: {
            widths: ['auto', '*', 'auto', 'auto', 'auto'],
            body: [
              ['Order ID', 'Product', 'Quantity', 'Total', 'Status'],
              ...this.recentOrders.map((order) => [
                order._id.slice(0, 6) + '...',
                order.items[0]?.name || 'N/A',
                order.items[0]?.quantity || 0,
                `Rs ${
                  (order.items[0]?.price || 0) * (order.items[0]?.quantity || 0)
                }`,
                order.status,
              ]),
            ],
          },
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
      },
    };

    pdfMake.createPdf(docDefinition).download('seller_report.pdf');
  }
}
