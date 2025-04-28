export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface DailyAvailability {
  date: string;
  timeSlots: TimeSlot[];
  isFullyBooked: boolean;
  isBlackout: boolean;
}

export type RecurrencePattern = 
  | 'daily'
  | 'weekdays'
  | 'weekends'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'monthly_first'
  | 'monthly_last'
  | 'quarterly'
  | 'yearly';

export interface RecurringSchedule {
  id: string;
  propertyId: string;
  pattern: RecurrencePattern;
  daysOfWeek?: number[]; // 0 = Sunday, 1 = Monday, etc.
  dayOfMonth?: number; // 1-31 for monthly pattern
  startTime: string;
  endTime: string;
  interval: number; // in minutes
  priority: number;
  startDate?: string;
  endDate?: string;
  exceptions?: string[]; // dates to exclude from the pattern
}

export interface AvailabilityRule {
  id: string;
  propertyId: string;
  type: 'blackout' | 'special-hours' | 'holiday';
  date: string;
  startTime?: string;
  endTime?: string;
  priority: number;
  description?: string;
}

export type PropertyAvailability = 'none' | 'low' | 'medium' | 'high';

export interface AvailabilityService {
  setRecurringSchedule(schedule: RecurringSchedule): void;
  setAvailabilityRule(rule: AvailabilityRule): void;
  getAvailability(propertyId: string, date: string): DailyAvailability | null;
  getAvailabilityLevel(propertyId: string, date: string): PropertyAvailability;
  findNextAvailableDate(propertyId: string, startDate: string): string | null;
  regenerateAvailability(propertyId: string): void;
} 