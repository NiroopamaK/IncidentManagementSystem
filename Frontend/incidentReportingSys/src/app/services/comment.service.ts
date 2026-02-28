// src/app/services/comment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../Models/comment.model';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private baseUrl = 'http://localhost:8080/comments';

  constructor(private http: HttpClient) {}

  // Helper to add Authorization header
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  // Get all comments
  getAllComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.baseUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  // Get comment by ID
  getCommentById(id: number): Observable<Comment> {
    return this.http.get<Comment>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Create a new comment
  createComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(this.baseUrl, comment, {
      headers: this.getAuthHeaders(),
    });
  }

  // Delete comment by ID
  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Get comments by incident ID
  getCommentsByIncident(incidentId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/incident/${incidentId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Get comments by user ID
  getCommentsByUser(userId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/user/${userId}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
