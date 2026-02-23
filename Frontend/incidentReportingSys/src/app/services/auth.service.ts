import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
//import { User } from '../Models/user.model';
import { Users } from '../Models/users.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private users: Users[] = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    },
    {
      id: 2,
      username: 'reporter',
      email: 'user@example.com',
      password: 'user1234',
      role: 'reporter',
    },
    {
      id: 3,
      username: 'reviewer',
      email: 'reviewer@example.com',
      password: 'rev1234',
      role: 'reviewer',
    },
  ];

  private currentUserSubject = new BehaviorSubject<Users | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {}

  login(email: string, password: string): Observable<Users | null> {
    const user = this.users.find(
      (u) => u.email === email && u.password === password,
    );
    if (user) this.currentUserSubject.next(user);
    return of(user || null);
  }

  signup(
    email: string,
    password: string,
    role: 'admin' | 'reporter' | 'reviewer',
  ): Observable<Users> {
    const exists = this.users.find((u) => u.email === email);
    if (exists) throw new Error('Email already exists');

    const newUser: Users = {
      id: this.users.length + 1,
      username: email.split('@')[0],
      email,
      password,
      role,
    };

    this.users.push(newUser);
    this.currentUserSubject.next(newUser);
    return of(newUser);
  }

  logout() {
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): Users | null {
    return this.currentUserSubject.value;
  }
}
