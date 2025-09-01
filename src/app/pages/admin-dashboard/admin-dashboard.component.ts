import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { AdminNavbarComponent } from '../../components/admin-navbar/admin-navbar.component';
import { BaseChartDirective, provideCharts } from 'ng2-charts';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

// Register Chart.js controllers, elements, scales, and plugins
Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, AdminNavbarComponent, BaseChartDirective],
  providers: [provideCharts()],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  stats: any = {};
  users: any[] = [];
  loading = true;

  // Pie chart (Chart.js)
  pieChart!: Chart;
  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;
  showPieCanvas = false; // control rendering
  // Bar chart (ng2-charts)
  @ViewChild(BaseChartDirective) barChart?: BaseChartDirective;
  public ordersProductsChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }],
  };
  public ordersProductsChartType: 'bar' = 'bar';
  public ordersProductsChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: { legend: { display: true } },
    scales: { x: {}, y: { beginAtZero: true } },
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    // load stats after view is ready (pieCanvas exists)
    this.loadStats();
  }

  loadStats() {
    // First, ensure users are loaded to compute active/blocked
    this.adminService.getUsers().subscribe({
      next: (users) => {
        this.users = users;

        this.adminService.getStats().subscribe({
          next: (res) => {
            console.log('Stats API response:', res);
            this.stats = res;

            // Compute active and blocked users
            const blockedUsers = this.users.filter((u) => !u.isActive).length;
            const activeUsers = this.users.filter((u) => u.isActive).length;
            // Render pie chart
            this.showPieCanvas = true;
            setTimeout(() => this.renderPieChart(activeUsers, blockedUsers), 0);

            // Update bar chart
            this.ordersProductsChartData = {
              labels: ['Products', 'Orders'],
              datasets: [
                {
                  data: [res.totalProducts || 0, res.totalOrders || 0],
                  backgroundColor: ['#2196F3', '#FF9800'],
                },
              ],
            };
            setTimeout(() => this.barChart?.update(), 0);
          },
          error: (err) => console.error(err),
        });
      },
      error: (err) => console.error(err),
    });
  }

  renderPieChart(activeUsers: number, blockedUsers: number) {
    if (!this.pieCanvas) return;

    // Destroy previous chart if exists
    if (this.pieChart) this.pieChart.destroy();

    console.log('Rendering pie chart:', [activeUsers, blockedUsers]);

    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Active', 'Blocked'],
        datasets: [
          {
            data: [activeUsers, blockedUsers],
            backgroundColor: ['#4CAF50', '#F44336'],
          },
        ],
      },
      options: { responsive: true, plugins: { legend: { display: true } } },
    });
  }

  loadUsers() {
    this.adminService.getUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.loading = false;
      },
      error: (err) => console.error(err),
    });
  }

  toggleUser(userId: string, isActive: boolean) {
    const msg = isActive
      ? 'Do you want to block this user?'
      : 'Do you want to unblock this user?';

    if (!confirm(msg)) return;

    this.adminService.toggleUserStatus(userId).subscribe({
      next: (res) => {
        alert(res.message);
        this.loadUsers();
        this.loadStats(); // refresh charts
      },
      error: (err) => {
        console.error(err);
        alert('Failed to update user status.');
      },
    });
  }
}
