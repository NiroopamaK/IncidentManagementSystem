// src/app/services/incident.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Incident } from '../../app/Models/incident.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class IncidentService {
  private API_URL = 'http://localhost:8080/incidents';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  // GET ALL INCIDENTS
  getAllIncidents(): Observable<Incident[]> {
    return this.http.get<Incident[]>(this.API_URL, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  // GET INCIDENT BY ID
  getIncidentById(id: number): Observable<Incident> {
    return this.http.get<Incident>(`${this.API_URL}/${id}`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  // CREATE INCIDENT
  createIncident(incident: Incident): Observable<Incident> {
    return this.http.post<Incident>(this.API_URL, incident, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  // UPDATE INCIDENT
  updateIncident(id: number, incident: Incident): Observable<Incident> {
    return this.http.put<Incident>(`${this.API_URL}/${id}`, incident, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  // DELETE INCIDENT
  deleteIncident(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  // GET INCIDENTS BY STATUS
  getIncidentsByStatus(status: string): Observable<Incident[]> {
    return this.http.get<Incident[]>(`${this.API_URL}/status/${status}`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  // GET INCIDENTS BY CREATOR
  getIncidentsByCreator(userId: number): Observable<Incident[]> {
    return this.http.get<Incident[]>(`${this.API_URL}/createdBy/${userId}`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  // GET INCIDENTS BY ASSIGNEE
  getIncidentsByAssignee(userId: number): Observable<Incident[]> {
    return this.http.get<Incident[]>(`${this.API_URL}/assignedTo/${userId}`, {
      headers: this.authService.getAuthHeaders(),
    });
  }
}
