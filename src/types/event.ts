export interface Event {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  recurrence: 'Single' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
}
