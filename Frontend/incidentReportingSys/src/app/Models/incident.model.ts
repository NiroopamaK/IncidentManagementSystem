export interface Incident {
  id: number;
  title: string;
  description: string;
  status: string;
  created_by: number;
  assigned_to?: number;
}
