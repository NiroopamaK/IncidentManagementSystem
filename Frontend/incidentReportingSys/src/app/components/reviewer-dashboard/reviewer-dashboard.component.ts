import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TopNavbarComponent } from '../top-navbar/top-navbar.component';
import { AuthService } from '../../services/auth.service';
import { IncidentService } from '../../services/incident.service';
import { CommentService } from '../../services/comment.service';
import { Incident } from '../../Models/incident.model';
import { User } from '../../Models/user.model';
import { status } from '../../Models/status.model';

@Component({
  selector: 'app-reviewer-dashboard',
  templateUrl: './reviewer-dashboard.component.html',
  styleUrls: ['./reviewer-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TopNavbarComponent],
})
export class ReviewerDashboardComponent implements OnInit {
  // Enum statuses for UI dropdown
  incidentStatuses = Object.values(status);
  filterStatuses = ['ALL', ...this.incidentStatuses];
  selectedStatus: string = 'ALL';

  // Data
  incidents: (Incident & {
    comments: string[];
    commentForm: FormGroup;
    createdByName: string;
  })[] = [];
  expandedIncidents: { [index: number]: boolean } = {};
  currentUser?: User;
  allUsers: User[] = []; // for mapping createdBy to name

  // Pagination
  currentPage = 1;
  itemsPerPage = 5;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private incidentService: IncidentService,
    private commentService: CommentService,
  ) {}

  ngOnInit(): void {
    // Subscribe to current user
    this.authService.currentUser$.subscribe((user) => {
      if (!user?.id) return;
      this.currentUser = user;
      this.loadAllUsers(); // Load all users to map createdBy names
    });
  }

  // Load all users first for name mapping
  loadAllUsers() {
    this.authService.getAllUsers().subscribe({
      next: (users) => {
        this.allUsers = users;
        this.loadAssignedIncidents();
        console.log(this.incidents);
      },
      error: (err) => console.error('Error loading users', err),
    });
  }

  // Load incidents assigned to current user
  loadAssignedIncidents() {
    if (!this.currentUser?.id) return;

    this.incidentService.getIncidentsByAssignee(this.currentUser.id).subscribe({
      next: (data) => {
        this.incidents = data.map((incident) => ({
          ...incident,

          // Keep backend status exactly as-is
          status: incident.status as status,

          // UI-only fields
          comments: [],
          commentForm: this.fb.group({
            message: ['', Validators.required],
          }),
          createdByName:
            this.allUsers.find((u) => u.id === incident.createdBy)?.username ||
            'N/A',
        }));

        this.loadCommentsForIncidents();
      },
      error: (err) => console.error('Error loading incidents', err),
    });
  }

  // Load comments per incident
  loadCommentsForIncidents() {
    this.incidents.forEach((incident) => {
      if (!incident.id) return;
      this.commentService.getCommentsByIncident(incident.id).subscribe({
        next: (comments) =>
          (incident.comments = comments.map((c) => c.message)),
        error: (err) => console.error('Error loading comments', err),
      });
    });
  }

  // Add comment
  addComment(incident: any) {
    if (!incident.commentForm.valid || !this.currentUser?.id) return;

    const newComment = {
      incidentId: incident.id,
      userId: this.currentUser.id,
      message: incident.commentForm.value.message,
    };

    this.commentService.createComment(newComment).subscribe({
      next: () => {
        incident.comments.push(newComment.message);
        incident.commentForm.reset();
      },
      error: (err) => console.error('Error adding comment', err),
    });
  }

  // Update status
  /*
  updateStatus(incident: Incident, newStatus: string) {
    if (!incident.id) return;

    const updatedIncident: Incident = { ...incident, status: newStatus };
    this.incidentService
      .updateIncident(incident.id, updatedIncident)
      .subscribe({
        next: () => (incident.status = newStatus),
        error: (err) => console.error('Error updating status', err),
      });
  }*/

  updateStatus(incident: Incident, newStatus: string) {
    if (!incident.id) return;

    const updatedIncident: Incident = {
      id: incident.id,
      title: incident.title,
      description: incident.description,
      status: newStatus,
      createdBy: incident.createdBy,
      assignedTo: incident.assignedTo,
    };

    this.incidentService
      .updateIncident(incident.id, updatedIncident)
      .subscribe({
        next: () => {
          // Update locally for instant UI reaction
          incident.status = newStatus as status;

          // Force new object reference (ensures filter recalculates)
          this.incidents = [...this.incidents];
        },
        error: (err) => console.error('Error updating status', err),
      });
  }

  // Filter incidents by status
  get filteredIncidents() {
    if (this.selectedStatus === 'ALL') return this.incidents;
    return this.incidents.filter((i) => i.status === this.selectedStatus);
  }

  onFilterChange() {
    this.currentPage = 1;
  }

  // Pagination
  get paginatedIncidents() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredIncidents.slice(start, start + this.itemsPerPage);
  }

  totalPages(): number {
    return Math.ceil(this.filteredIncidents.length / this.itemsPerPage);
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
}
