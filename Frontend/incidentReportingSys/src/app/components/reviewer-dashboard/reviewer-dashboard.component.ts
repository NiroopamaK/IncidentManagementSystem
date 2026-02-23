import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TopNavbarComponent } from '../top-navbar/top-navbar.component';

interface Incident {
  id: number;
  title: string;
  description: string;
  status: string;
  created_by: { id: number; username: string };
  assigned_to?: { id: number; username: string };
}

interface Comment {
  id: number;
  incident_id: number;
  user: { id: number; username: string };
  message: string;
}

@Component({
  selector: 'app-reviewer-dashboard',
  templateUrl: './reviewer-dashboard.component.html',
  styleUrls: ['./reviewer-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TopNavbarComponent],
})
export class ReviewerDashboardComponent implements OnInit {
  incidents: Incident[] = [];
  commentsMap: { [incidentId: number]: Comment[] } = {};
  expandedIncidents: { [index: number]: boolean } = {};
  commentForms: { [incidentId: number]: FormGroup } = {};

  // Pagination
  currentPage = 1;
  itemsPerPage = 5;

  // Report incident form
  incidentForm!: FormGroup;

  statuses: string[] = ['Open', 'In Progress', 'Resolved', 'Closed'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadIncidents();

    // Initialize report form
    this.incidentForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      status: ['', Validators.required],
      created_by: ['', Validators.required],
    });
  }

  loadIncidents() {
    this.incidents = [
      {
        id: 1,
        title: 'Server down',
        description: 'Server is not responding',
        status: 'Open',
        created_by: { id: 1, username: 'John' },
      },
      {
        id: 2,
        title: 'Login issue',
        description: 'Users cannot login',
        status: 'Resolved',
        created_by: { id: 2, username: 'Alice' },
      },
      {
        id: 3,
        title: 'UI Bug',
        description: 'Graphs are not loading',
        status: 'In Progress',
        created_by: { id: 3, username: 'Bob' },
      },
      {
        id: 4,
        title: 'Email Issue',
        description: 'Emails not sending',
        status: 'Open',
        created_by: { id: 4, username: 'Carol' },
      },
      {
        id: 5,
        title: 'API Timeout',
        description: 'Timeout errors on API',
        status: 'Resolved',
        created_by: { id: 5, username: 'Dave' },
      },
      {
        id: 6,
        title: 'Database lag',
        description: 'Queries are slow',
        status: 'In Progress',
        created_by: { id: 6, username: 'Eve' },
      },
      {
        id: 7,
        title: 'Dashboard crash',
        description: 'Dashboard fails to load',
        status: 'Open',
        created_by: { id: 7, username: 'Frank' },
      },
    ];

    this.commentsMap = {
      1: [
        {
          id: 1,
          incident_id: 1,
          user: { id: 2, username: 'Alice' },
          message: 'Urgent, notify IT team',
        },
      ],
      2: [
        {
          id: 2,
          incident_id: 2,
          user: { id: 1, username: 'John' },
          message: 'Password reset done',
        },
      ],
      3: [
        {
          id: 3,
          incident_id: 3,
          user: { id: 4, username: 'Carol' },
          message: 'Frontend team investigating',
        },
      ],
      4: [],
      5: [],
      6: [],
      7: [],
    };

    // Initialize comment forms for each incident
    this.incidents.forEach((i) => {
      this.commentForms[i.id] = this.fb.group({
        message: ['', Validators.required],
      });
    });
  }

  totalPages(): number {
    return Math.ceil(this.incidents.length / this.itemsPerPage);
  }

  get paginatedIncidents(): Incident[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.incidents.slice(start, start + this.itemsPerPage);
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }
  nextPage() {
    if (this.currentPage < this.totalPages()) this.currentPage++;
  }

  toggleDetails(index: number) {
    const globalIndex = (this.currentPage - 1) * this.itemsPerPage + index;
    this.expandedIncidents[globalIndex] = !this.expandedIncidents[globalIndex];
  }

  addComment(incidentId: number) {
    const form = this.commentForms[incidentId];
    if (!form.valid) return;

    const newComment: Comment = {
      id: Date.now(),
      incident_id: incidentId,
      user: { id: 99, username: 'Reviewer' },
      message: form.value.message,
    };

    if (!this.commentsMap[incidentId]) this.commentsMap[incidentId] = [];
    this.commentsMap[incidentId].push(newComment);

    form.reset();
  }

  submitIncident() {
    if (!this.incidentForm.valid) return;

    const newId = this.incidents.length
      ? Math.max(...this.incidents.map((i) => i.id)) + 1
      : 1;
    const incident: Incident = {
      id: newId,
      title: this.incidentForm.value.title,
      description: this.incidentForm.value.description,
      status: this.incidentForm.value.status,
      created_by: {
        id: newId + 100,
        username: this.incidentForm.value.created_by,
      },
    };

    this.incidents.unshift(incident);
    this.commentsMap[incident.id] = [];
    this.commentForms[incident.id] = this.fb.group({
      message: ['', Validators.required],
    });
    this.incidentForm.reset();
    this.currentPage = 1;
  }
}
