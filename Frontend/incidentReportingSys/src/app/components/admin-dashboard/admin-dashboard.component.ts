import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TopNavbarComponent } from '../top-navbar/top-navbar.component';
import { User } from '../../Models/user.model';
import { Incident } from '../../Models/incident.model';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TopNavbarComponent],
})
export class AdminDashboardComponent implements OnInit {
  users: User[] = [];
  incidents: Incident[] = [];

  filteredIncidents: Incident[] = [];
  statusFilterForm!: FormGroup;

  statuses: string[] = ['All', 'Open', 'In Progress', 'Resolved', 'Closed'];
  expandedIncidents: { [id: number]: boolean } = {};

  // Pagination
  currentPage = 1;
  itemsPerPage = 5;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadData();

    this.statusFilterForm = this.fb.group({ status: ['All'] });
    this.applyFilter('All');

    this.statusFilterForm.get('status')?.valueChanges.subscribe((value) => {
      this.applyFilter(value);
      this.currentPage = 1;
    });
  }

  loadData() {
    // Hardcoded users
    this.users = [
      { id: 1, username: 'John', role: 'reporter' },
      { id: 2, username: 'Alice', role: 'reviewer' },
      { id: 3, username: 'Bob', role: 'reporter' },
      { id: 4, username: 'Carol', role: 'reviewer' },
      { id: 5, username: 'Dave', role: 'reporter' },
    ];

    // Hardcoded incidents using IDs
    this.incidents = [
      {
        id: 1,
        title: 'Server down',
        description: 'Server not responding',
        status: 'Open',
        created_by: 1,
        assigned_to: 2,
      },
      {
        id: 2,
        title: 'Login issue',
        description: 'Login fails',
        status: 'Resolved',
        created_by: 3,
        assigned_to: 4,
      },
      {
        id: 3,
        title: 'UI Bug',
        description: 'Graphs not loading',
        status: 'In Progress',
        created_by: 5,
        assigned_to: 2,
      },
      {
        id: 4,
        title: 'API Timeout',
        description: 'API timeouts frequently',
        status: 'Closed',
        created_by: 1,
        assigned_to: 4,
      },
      {
        id: 5,
        title: 'Email Issue',
        description: 'Emails not sending',
        status: 'Open',
        created_by: 3,
        assigned_to: 2,
      },
      {
        id: 6,
        title: 'Database lag',
        description: 'Queries are slow',
        status: 'In Progress',
        created_by: 5,
      },
      {
        id: 7,
        title: 'Dashboard crash',
        description: 'Dashboard fails to load',
        status: 'Open',
        created_by: 1,
      },
    ];
  }

  getUsername(userId?: number) {
    return this.users.find((u) => u.id === userId)?.username || 'N/A';
  }

  get totalIssues(): number {
    return this.incidents.length;
  }
  get totalReporters(): number {
    return this.users.filter((u) => u.role === 'reporter').length;
  }
  get totalReviewers(): number {
    return this.users.filter((u) => u.role === 'reviewer').length;
  }

  applyFilter(status: string) {
    this.filteredIncidents =
      status === 'All'
        ? [...this.incidents]
        : this.incidents.filter((i) => i.status === status);
  }

  toggleDetails(incidentId: number) {
    this.expandedIncidents[incidentId] = !this.expandedIncidents[incidentId];
  }

  totalPages(): number {
    return Math.ceil(this.filteredIncidents.length / this.itemsPerPage);
  }

  get paginatedIncidents(): Incident[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredIncidents.slice(start, start + this.itemsPerPage);
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }
  nextPage() {
    if (this.currentPage < this.totalPages()) this.currentPage++;
  }
}
