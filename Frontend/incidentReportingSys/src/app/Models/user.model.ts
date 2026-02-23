export interface User {
  id: number;
  username: string;
  role: 'reporter' | 'reviewer' | 'admin';
}
