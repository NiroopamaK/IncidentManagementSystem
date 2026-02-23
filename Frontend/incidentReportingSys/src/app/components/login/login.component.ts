import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  isSignUp = false;

  loginForm!: FormGroup; // ✅ ADD THIS
  signupForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
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
    if (this.loginForm.invalid) return;

    console.log('Login Data:', this.loginForm.value);
  }

  onSignUpSubmit() {
    if (this.signupForm.invalid) return;

    console.log('Sign Up Data:', this.signupForm.value);
  }
}
