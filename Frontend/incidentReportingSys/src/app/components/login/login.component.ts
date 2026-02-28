import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../Models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  isSignUp = false;

  loginForm!: FormGroup; // ✅ ADD THIS
  signupForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(2)]],
    });

    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      role: ['', Validators.required],
    });
  }

  showSignUp() {
    this.isSignUp = true;
  }

  showLogin() {
    this.isSignUp = false;
  }

  onSubmit() {
    console.log('clicked');
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe({
      next: () => {
        this.loading = false;

        const user = this.authService.currentUser;

        if (!user) return;

        switch (user.role) {
          case 'ADMIN':
            this.router.navigate(['/adminDashboard']);
            break;

          case 'REVIEWER':
            this.router.navigate(['/reviewerDashboard']);
            break;

          case 'REPORTER':
            this.router.navigate(['/reportIncident']);
            break;

          default:
            this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Invalid email or password';
        console.error(err);
      },
    });
  }

  onSignUpSubmit() {
    console.log('clicked');
    console.log('Form value:', this.signupForm.value);
    console.log('Form valid?', this.signupForm.valid);
    if (this.signupForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      username: this.signupForm.value.username,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password,
      role: this.signupForm.value.role,
    };

    console.log('Sign Up Payload:', payload); // check console

    this.authService.signup(payload).subscribe({
      next: (user) => {
        this.loading = false;
        this.successMessage =
          'Account created successfully! You can now log in.';
        this.signupForm.reset();
        this.isSignUp = false; // switch to login form
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err?.error?.message || 'Failed to create account. Please try again.';
        console.error('Signup error:', err);
      },
    });
  }
}
