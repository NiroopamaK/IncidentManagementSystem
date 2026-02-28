import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TopNavbarComponent } from '../top-navbar/top-navbar.component';
import { AuthService } from '../../services/auth.service';
import { IncidentService } from '../../services/incident.service';
import { CommentService } from '../../services/comment.service';
import { User } from '../../Models/user.model';
import { status } from '../../Models/status.model';
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
  filteredUsers: User[] = [];
  incidents: (Incident & {
    createdUserName: string;
    assignedUserName: string;
    comments: string[];
  })[] = [];
  filteredIncidents: typeof this.incidents = [];

  // Toggle view
  showUsers = false;

  // Filters
  statusFilterForm!: FormGroup;
  roleFilterForm!: FormGroup;

  // Pagination
  currentPage = 1;
  itemsPerPage = 5;

  // Expanded incidents
  expandedIncidents: { [id: number]: boolean } = {};

  statuses = ['All', status.open, status.in_progress, status.resolved];
  roles: ('All' | 'REPORTER' | 'REVIEWER' | 'ADMIN')[] = [
    'All',
    'REPORTER',
    'REVIEWER',
    'ADMIN',
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private incidentService: IncidentService,
    private commentService: CommentService,
    private cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    // Initialize forms
    this.statusFilterForm = this.fb.group({ status: ['All'] });
    this.roleFilterForm = this.fb.group({ role: ['All'] });

    if (isPlatformBrowser(this.platformId)) {
      this.loadUsers();
      this.loadIncidents();

      // Filters
      this.statusFilterForm.get('status')?.valueChanges.subscribe((value) => {
        this.applyIncidentFilter(value);
        this.currentPage = 1;
      });

      this.roleFilterForm.get('role')?.valueChanges.subscribe((value) => {
        this.applyUserFilter(value);
        this.currentPage = 1;
      });
    }
  }

  // ================= VIEW TOGGLES =================
  showUserView() {
    this.showUsers = true;
    this.currentPage = 1;
  }

  showIncidentView() {
    this.showUsers = false;
    this.currentPage = 1;
  }

  // ================= USERS =================
  loadUsers() {
    this.authService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = [...this.users];
        // After users load, update incident usernames
        this.updateIncidentUsernames();
      },
      error: (err) => console.error('Error loading users', err),
    });
  }

  applyUserFilter(role: string) {
    this.filteredUsers =
      role === 'All'
        ? [...this.users]
        : this.users.filter((u) => u.role === role);
  }

  get paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredUsers.slice(start, start + this.itemsPerPage);
  }

  // ================= INCIDENTS =================
  loadIncidents() {
    this.incidentService.getAllIncidents().subscribe({
      next: (data) => {
        this.incidents = data.map((incident) => ({
          ...incident,
          comments: [],
          createdUserName: '', // will fill after users load
          assignedUserName: '',
        }));
        this.filteredIncidents = [...this.incidents];
        this.loadComments();
        this.updateIncidentUsernames(); // try to set names immediately if users exist
      },
      error: (err) => console.error('Error loading incidents', err),
    });
  }

  applyIncidentFilter(status: string) {
    this.filteredIncidents =
      status === 'All'
        ? [...this.incidents]
        : this.incidents.filter((i) => i.status === status);
  }

  get paginatedIncidents() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredIncidents.slice(start, start + this.itemsPerPage);
  }

  // ================= COMMENTS =================
  loadComments() {
    this.incidents.forEach((incident) => {
      if (!incident.id) return;
      this.commentService.getCommentsByIncident(incident.id).subscribe({
        next: (comments) => {
          incident.comments = comments.map((c) => c.message);
          this.cd.detectChanges();
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

  // ================= UPDATE USERNAMES =================
  updateIncidentUsernames() {
    this.incidents.forEach((incident) => {
      incident.createdUserName =
        this.users.find((u) => u.id === incident.createdBy)?.username ||
        'Loading...';
      incident.assignedUserName =
        this.users.find((u) => u.id === incident.assignedTo)?.username ||
        'Loading...';
    });
  }

  // ================= INCIDENT DETAILS =================
  toggleDetails(incidentId: number) {
    this.expandedIncidents[incidentId] = !this.expandedIncidents[incidentId];
  }

  // ================= PAGINATION =================
  totalPages(): number {
    const items = this.showUsers ? this.filteredUsers : this.filteredIncidents;
    return Math.ceil(items.length / this.itemsPerPage);
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.totalPages()) this.currentPage++;
  }
}
