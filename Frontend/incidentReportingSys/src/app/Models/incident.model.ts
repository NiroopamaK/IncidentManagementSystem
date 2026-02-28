export interface Incident {
  id?: number;
  title: string;
  description: string;
  status: string;
  createdBy: number;
  assignedTo: number;
  comments?: string[];
}
