import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../Models/user.model';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080';
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  currentUser$ = this.currentUserSubject.asObservable();
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
      }
    }
  }

  // LOGIN
  login(email: string, password: string): Observable<string> {
    return this.http
      .post(
        `${this.baseUrl}/auth/login`,
        { email, password },
        { responseType: 'text' }, // because backend returns String token
      )
      .pipe(
        // auth.service.ts (login tap)
        tap((token: string) => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', token);

            // Decode payload
            const payload = JSON.parse(atob(token.split('.')[1]));

            const user: User = {
              id: payload.id, // now available from JWT
              username: payload.sub,
              email: payload.sub,
              role: payload.role,
            };
            console.log(user);
            localStorage.setItem('user', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
        }),
      );
  }

  // SIGN UP
  signup(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users/signup`, user);
  }

  // LOGOUT
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.currentUserSubject.next(null);
  }

  // GET TOKEN
  getToken(): string {
    // Check if we are running in the browser
    if (typeof window === 'undefined') {
      throw new Error(
        'Cannot access token during SSR (server-side rendering).',
      );
    }

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('User is not authenticated. Token not found.');
    }

    return token;
  }

  // AUTH HEADERS
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // CHECK ROLE
  hasRole(role: 'REPORTER' | 'REVIEWER' | 'ADMIN'): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === role;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUsersByRole(role: 'REPORTER' | 'REVIEWER' | 'ADMIN'): Observable<User[]> {
    // Optionally attach auth headers
    // const headers = this.authService.getAuthHeaders();
    return this.http.get<User[]>(`${this.baseUrl}/users/role/${role}`);
    // If using headers: return this.http.get<User[]>(url, { headers });
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }
}
