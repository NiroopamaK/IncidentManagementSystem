import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../Models/user.model';

@Component({
  selector: 'app-top-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.css'],
})
export class TopNavbarComponent implements OnInit {
  userName: string = '';
  role: string = '';

  dropdownOpen: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Option 1: Direct getter
    const user = this.authService.currentUser;

    if (user) {
      this.userName = user.username;
      //this.role = user.role;
      this.role = user.role.charAt(0) + user.role.slice(1).toLowerCase();
    }

    // Option 2 (recommended if user can change dynamically)
    this.authService.currentUser$.subscribe((user: User | null) => {
      if (user) {
        this.userName = user.username;
        this.role = user.role;
      }
    });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  editProfile() {
    this.router.navigate(['/profile']);
    this.closeDropdown();
  }

  signOut() {
    this.authService.logout(); // Clear token + user
    this.router.navigate(['']); // Redirect to login
    this.closeDropdown();
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-container')) {
      this.dropdownOpen = false;
    }
  }
}
