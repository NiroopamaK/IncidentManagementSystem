export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  role: 'REPORTER' | 'REVIEWER' | 'ADMIN';
}
