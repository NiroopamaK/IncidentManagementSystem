import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { IncidentReportComponent } from './components/incident-report/incident-report.component';
import { ReviewerDashboardComponent } from './components/reviewer-dashboard/reviewer-dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'reportIncident', component: IncidentReportComponent },
  { path: 'reviewerDashboard', component: ReviewerDashboardComponent },
  { path: 'adminDashboard', component: AdminDashboardComponent },
];
