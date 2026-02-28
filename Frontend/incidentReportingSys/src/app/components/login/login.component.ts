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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  isSignUp = false;

  loginForm!: FormGroup;
  signupForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  loading: boolean = false;
  signupSuccessMessage: string = '';
  // Show/hide password
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

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

    this.signupForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
          ],
        ],
        confirmPassword: ['', Validators.required],
        role: ['', Validators.required],
      },
      {
        validators: this.passwordsMatchValidator,
      },
    );
  }

  showSignUp() {
    this.isSignUp = true;
    this.errorMessage = '';
    this.signupSuccessMessage = '';
  }

  showLogin() {
    this.isSignUp = false;
    this.errorMessage = '';
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

        if (err.status === 401) {
          this.errorMessage = 'Invalid email or password.';
        } else {
          this.errorMessage = 'Login failed.';
        }

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
        this.signupSuccessMessage =
          'Account created successfully! You can now log in.';
        this.signupForm.reset();
        this.isSignUp = false; // switch to login form
      },
      error: (err) => {
        this.loading = false;

        if (err.status === 409) {
          this.errorMessage = 'Email already exists.';
        } else if (err.status === 400) {
          this.errorMessage = 'Invalid input data.';
        } else {
          this.errorMessage = 'Failed to create account. Please try again.';
        }

        console.error('Signup error:', err);
      },
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get signUpEmail() {
    return this.signupForm.get('email');
  }

  get signupPassword() {
    return this.signupForm.get('password');
  }

  get passwordHasUppercase(): boolean {
    const val = this.signupPassword?.value || '';
    return /[A-Z]/.test(val);
  }

  get passwordHasLowercase(): boolean {
    const val = this.signupPassword?.value || '';
    return /[a-z]/.test(val);
  }

  get passwordHasNumber(): boolean {
    const val = this.signupPassword?.value || '';
    return /\d/.test(val);
  }

  get passwordMinLength(): boolean {
    const val = this.signupPassword?.value || '';
    return val.length >= 8;
  }

  get confirmPassword() {
    return this.signupForm.get('confirmPassword');
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      form.get('confirmPassword')?.setErrors(null);
    }
    return null;
  }
}
