import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TopNavbarComponent } from '../top-navbar/top-navbar.component';
import { AuthService } from '../../services/auth.service';
import { IncidentService } from '../../services/incident.service';
import { CommentService } from '../../services/comment.service';
import { User } from '../../Models/user.model';
import { Incident } from '../../Models/incident.model';
import { status } from '../../Models/status.model';

@Component({
  selector: 'app-incident-report',
  templateUrl: './incident-report.component.html',
  styleUrls: ['./incident-report.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TopNavbarComponent, FormsModule],
})
export class IncidentReportComponent implements OnInit {
  incidentForm!: FormGroup;
  users: User[] = [];
  incidents: (Incident & {
    comments: string[];
    assignedUserName: string;
    createdUserName: string;
    isEditing?: boolean;
    editForm?: FormGroup;
  })[] = [];
  filteredStatus: string = 'ALL';
  expandedIncidents: { [index: number]: boolean } = {};
  currentUser?: User;

  currentPage = 1;
  itemsPerPage = 5;

  statuses = Object.values(status);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private incidentService: IncidentService,
    private commentService: CommentService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.incidentForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      status: ['', Validators.required],
      assigned_to: ['', Validators.required],
    });

    // Load current user and then load incidents/users
    this.authService.currentUser$.subscribe((user) => {
      if (!user?.id) return;
      this.currentUser = user;
      this.loadUsers();
    });
  }

  // =========================
  // USERS
  // =========================
  loadUsers() {
    this.authService.getUsersByRole('REVIEWER').subscribe({
      next: (data) => {
        this.users = data;
        this.loadIncidents(); // load incidents after users so we can attach usernames
      },
      error: (err) => console.error('Error fetching users', err),
    });
  }

  // =========================
  // INCIDENTS
  // =========================
  loadIncidents() {
    if (!this.currentUser || this.currentUser.id == null) return;

    this.incidentService.getIncidentsByCreator(this.currentUser.id).subscribe({
      next: (data) => {
        this.incidents = data.map((incident) => ({
          ...incident,
          comments: [],
          assignedUserName:
            this.users.find((u) => u.id === incident.assignedTo)?.username ||
            'N/A',
          createdUserName:
            this.users.find((u) => u.id === incident.createdBy)?.username ||
            'N/A',
        }));

        this.loadComments();
      },
      error: (err) => console.error('Error loading incidents', err),
    });
  }

  // =========================
  // COMMENTS
  // =========================
  loadComments() {
    this.incidents.forEach((incident) => {
      if (!incident.id) return;
      this.commentService.getCommentsByIncident(incident.id).subscribe({
        next: (comments) => {
          incident.comments = comments.map((c) => c.message);
          this.cd.detectChanges(); // trigger Angular change detection
        },
        error: (err) =>
          console.error(
            'Error loading comments for incident',
            incident.id,
            err,
          ),
      });
    });
  }

  // =========================
  // CREATE INCIDENT
  // =========================
  submitForm() {
    if (!this.incidentForm.valid || !this.currentUser?.id) return;

    const newIncident: Incident = {
      title: this.incidentForm.value.title,
      description: this.incidentForm.value.description,
      status: this.incidentForm.value.status,
      createdBy: this.currentUser.id,
      assignedTo: Number(this.incidentForm.value.assigned_to),
    };

    this.incidentService.createIncident(newIncident).subscribe({
      next: (incident) => {
        this.incidents.unshift({
          ...incident,
          comments: [],
          assignedUserName:
            this.users.find((u) => u.id === incident.assignedTo)?.username ||
            'N/A',
          createdUserName:
            this.users.find((u) => u.id === incident.createdBy)?.username ||
            'N/A',
        });
        this.incidentForm.reset();
      },
      error: (err) => console.error('Error creating incident', err),
    });
  }

  // =========================
  // PAGINATION & FILTER
  // =========================
  get paginatedIncidents() {
    const filtered =
      this.filteredStatus === 'ALL'
        ? this.incidents
        : this.incidents.filter((i) => i.status === this.filteredStatus);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return filtered.slice(start, start + this.itemsPerPage);
  }

  totalPages() {
    const filtered =
      this.filteredStatus === 'ALL'
        ? this.incidents
        : this.incidents.filter((i) => i.status === this.filteredStatus);
    return Math.ceil(filtered.length / this.itemsPerPage);
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.totalPages()) this.currentPage++;
  }

  toggleDetails(index: number) {
    this.expandedIncidents[index] = !this.expandedIncidents[index];
  }

  // =========================
  // EDIT INCIDENT
  // =========================
  startEdit(incident: any, index?: number) {
    incident.isEditing = true;
    incident.editForm = this.fb.group({
      title: [incident.title, Validators.required],
      description: [incident.description, Validators.required],
    });

    if (index !== undefined) {
      const globalIndex = (this.currentPage - 1) * this.itemsPerPage + index;
      this.expandedIncidents[globalIndex] = true;
    }
  }

  saveEdit(incident: any) {
    if (!incident.editForm?.valid) {
      incident.editForm.markAllAsTouched();
      return;
    }

    const payload: Incident = {
      title: incident.editForm.value.title,
      description: incident.editForm.value.description,
      status: incident.status,
      createdBy: incident.createdBy,
      assignedTo: incident.assignedTo,
    };

    this.incidentService.updateIncident(incident.id, payload).subscribe({
      next: (res) => {
        const index = this.incidents.findIndex((i) => i.id === incident.id);
        if (index !== -1) {
          this.incidents[index] = {
            ...incident,
            ...res,
            isEditing: false,
            editForm: undefined,
          };
        }
      },
      error: (err) => console.error('Error updating incident', err),
    });
  }

  cancelEdit(incident: any) {
    incident.isEditing = false;
    incident.editForm = undefined;
  }

  // =========================
  // DELETE INCIDENT
  // =========================
  deleteIncident(index: number) {
    const incident = this.paginatedIncidents[index];
    if (!incident?.id) return;

    this.incidentService.deleteIncident(incident.id).subscribe({
      next: () => {
        const globalIndex = this.incidents.findIndex(
          (i) => i.id === incident.id,
        );
        this.incidents.splice(globalIndex, 1);
      },
      error: (err) => console.error('Error deleting incident', err),
    });
  }
}
