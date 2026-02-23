import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TopNavbarComponent } from '../top-navbar/top-navbar.component';

interface Incident {
  title: string;
  status: string;
  description: string;
  assigned_to?: string;
  comments?: string[];
}

@Component({
  selector: 'app-incident-report',
  templateUrl: './incident-report.component.html',
  styleUrls: ['./incident-report.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TopNavbarComponent],
})
export class IncidentReportComponent implements OnInit {
  incidentForm!: FormGroup;
  statuses: string[] = ['Open', 'In Progress', 'Resolved', 'Closed'];

  // Hardcoded incidents
  incidents: Incident[] = [
    {
      title: 'Server down',
      status: 'Open',
      description: 'Server not responding',
      assigned_to: 'N/A',
      comments: ['Urgent', 'Notify IT team'],
    },
    {
      title: 'Login issue',
      status: 'Resolved',
      description: 'Login failed',
      assigned_to: 'Alice',
      comments: ['Password reset', 'Confirmed working'],
    },
    {
      title: 'UI Bug',
      status: 'In Progress',
      description: 'Graphs not loading',
      assigned_to: '',
      comments: ['Frontend team investigating'],
    },
    {
      title: 'Email Issue',
      status: 'Open',
      description: 'Emails not sending',
      assigned_to: '',
      comments: ['Check SMTP'],
    },
    {
      title: 'API Timeout',
      status: 'Resolved',
      description: 'Timeout on API',
      assigned_to: 'Bob',
      comments: ['Fixed timeout issue'],
    },
    {
      title: 'Database lag',
      status: 'In Progress',
      description: 'Queries slow',
      assigned_to: '',
      comments: ['Investigate DB'],
    },
    {
      title: 'Dashboard crash',
      status: 'Open',
      description: 'Dashboard fails on load',
      assigned_to: '',
      comments: ['High priority'],
    },
  ];

  // Track which incidents are expanded
  expandedIncidents: { [index: number]: boolean } = {};

  // Pagination
  currentPage = 1;
  itemsPerPage = 5;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.incidentForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      status: ['', Validators.required],
      created_by: ['', Validators.required],
    });
  }

  // Paginated incidents
  get paginatedIncidents(): Incident[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.incidents.slice(start, start + this.itemsPerPage);
  }

  totalPages(): number {
    return Math.ceil(this.incidents.length / this.itemsPerPage);
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.totalPages()) this.currentPage++;
  }

  submitForm() {
    if (this.incidentForm.valid) {
      const newIncident: Incident = {
        title: this.incidentForm.value.title,
        status: this.incidentForm.value.status,
        description: this.incidentForm.value.description,
        assigned_to: 'N/A',
        comments: [],
      };
      this.incidents.unshift(newIncident);
      this.incidentForm.reset();
      this.currentPage = 1; // show newest on first page
    } else {
      this.incidentForm.markAllAsTouched();
    }
  }

  toggleDetails(index: number) {
    this.expandedIncidents[index] = !this.expandedIncidents[index];
  }

  deleteIncident(index: number) {
    const globalIndex = (this.currentPage - 1) * this.itemsPerPage + index;
    this.incidents.splice(globalIndex, 1);
    delete this.expandedIncidents[globalIndex];
    if (this.currentPage > this.totalPages()) this.currentPage--; // adjust page if needed
  }
}
