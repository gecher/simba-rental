import { 
  TimeSlot, 
  DailyAvailability, 
  RecurringSchedule, 
  AvailabilityRule,
  PropertyAvailability,
  AvailabilityService 
} from '../types/availability';

export class AvailabilityServiceImpl implements AvailabilityService {
  private schedules: Map<string, RecurringSchedule[]>;
  private rules: Map<string, AvailabilityRule[]>;
  private availability: Map<string, Map<string, DailyAvailability>>;

  constructor() {
    this.schedules = new Map();
    this.rules = new Map();
    this.availability = new Map();
  }

  private getPropertySchedules(propertyId: string): RecurringSchedule[] {
    return this.schedules.get(propertyId) || [];
  }

  private getPropertyRules(propertyId: string): AvailabilityRule[] {
    return this.rules.get(propertyId) || [];
  }

  private getPropertyAvailability(propertyId: string): Map<string, DailyAvailability> {
    if (!this.availability.has(propertyId)) {
      this.availability.set(propertyId, new Map());
    }
    return this.availability.get(propertyId)!;
  }

  setRecurringSchedule(schedule: RecurringSchedule): void {
    const propertySchedules = this.getPropertySchedules(schedule.propertyId);
    const existingIndex = propertySchedules.findIndex(s => s.id === schedule.id);
    
    if (existingIndex >= 0) {
      propertySchedules[existingIndex] = schedule;
    } else {
      propertySchedules.push(schedule);
    }
    
    this.schedules.set(schedule.propertyId, propertySchedules);
    this.regenerateAvailability(schedule.propertyId);
  }

  setAvailabilityRule(rule: AvailabilityRule): void {
    const propertyRules = this.getPropertyRules(rule.propertyId);
    const existingIndex = propertyRules.findIndex(r => r.id === rule.id);
    
    if (existingIndex >= 0) {
      propertyRules[existingIndex] = rule;
    } else {
      propertyRules.push(rule);
    }
    
    this.rules.set(rule.propertyId, propertyRules);
    this.regenerateAvailability(rule.propertyId);
  }

  getAvailability(propertyId: string, date: string): DailyAvailability | null {
    const propertyAvailability = this.getPropertyAvailability(propertyId);
    return propertyAvailability.get(date) || null;
  }

  getAvailabilityLevel(propertyId: string, date: string): PropertyAvailability {
    const availability = this.getAvailability(propertyId, date);
    if (!availability || availability.isBlackout) return 'none';
    
    const availableSlots = availability.timeSlots.filter(slot => slot.available).length;
    const totalSlots = availability.timeSlots.length;
    
    if (availableSlots === 0) return 'none';
    if (availableSlots <= totalSlots * 0.3) return 'low';
    if (availableSlots <= totalSlots * 0.7) return 'medium';
    return 'high';
  }

  findNextAvailableDate(propertyId: string, startDate: string): string | null {
    const propertyAvailability = this.getPropertyAvailability(propertyId);
    const dates = Array.from(propertyAvailability.keys()).sort();
    
    const startIndex = dates.findIndex(date => date >= startDate);
    if (startIndex === -1) return null;
    
    for (let i = startIndex; i < dates.length; i++) {
      const date = dates[i];
      const availability = propertyAvailability.get(date)!;
      
      if (!availability.isBlackout && !availability.isFullyBooked) {
        return date;
      }
    }
    
    return null;
  }

  private isScheduleApplicable(schedule: RecurringSchedule, date: string, dayOfWeek: number): boolean {
    const scheduleDate = new Date(date);
    const startDate = schedule.startDate ? new Date(schedule.startDate) : null;
    const endDate = schedule.endDate ? new Date(schedule.endDate) : null;
    
    // Check date range
    if (startDate && scheduleDate < startDate) return false;
    if (endDate && scheduleDate > endDate) return false;
    
    // Check exceptions
    if (schedule.exceptions?.includes(date)) return false;

    // Check pattern
    switch (schedule.pattern) {
      case 'daily':
        return true;
        
      case 'weekdays':
        return dayOfWeek >= 1 && dayOfWeek <= 5;
        
      case 'weekends':
        return dayOfWeek === 0 || dayOfWeek === 6;
        
      case 'weekly':
        return schedule.daysOfWeek?.includes(dayOfWeek) ?? false;
        
      case 'biweekly': {
        if (!schedule.startDate) return false;
        const start = new Date(schedule.startDate);
        const diffTime = Math.abs(scheduleDate.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays % 14 === 0 && (schedule.daysOfWeek?.includes(dayOfWeek) ?? false);
      }
        
      case 'monthly': {
        if (!schedule.dayOfMonth) return false;
        return scheduleDate.getDate() === schedule.dayOfMonth;
      }
        
      case 'monthly_first': {
        return scheduleDate.getDate() === 1;
      }
        
      case 'monthly_last': {
        const lastDay = new Date(scheduleDate.getFullYear(), scheduleDate.getMonth() + 1, 0).getDate();
        return scheduleDate.getDate() === lastDay;
      }
        
      case 'quarterly': {
        if (!schedule.startDate) return false;
        const start = new Date(schedule.startDate);
        const monthDiff = (scheduleDate.getFullYear() - start.getFullYear()) * 12 + 
                         (scheduleDate.getMonth() - start.getMonth());
        return monthDiff % 3 === 0 && scheduleDate.getDate() === start.getDate();
      }
        
      case 'yearly': {
        if (!schedule.startDate) return false;
        const start = new Date(schedule.startDate);
        return scheduleDate.getMonth() === start.getMonth() && 
               scheduleDate.getDate() === start.getDate();
      }
        
      default:
        return false;
    }
  }

  regenerateAvailability(propertyId: string): void {
    const propertyAvailability = this.getPropertyAvailability(propertyId);
    propertyAvailability.clear();

    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + 90); // Generate for 90 days ahead

    for (let date = new Date(today); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dateString = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay();

      // Get applicable schedules for this date
      const applicableSchedules = this.getPropertySchedules(propertyId)
        .filter(schedule => this.isScheduleApplicable(schedule, dateString, dayOfWeek))
        .sort((a, b) => b.priority - a.priority);

      // Get applicable rules for this date
      const applicableRules = this.getPropertyRules(propertyId)
        .filter(rule => rule.date === dateString)
        .sort((a, b) => b.priority - a.priority);

      // Generate time slots based on schedules
      const timeSlots: TimeSlot[] = [];
      for (const schedule of applicableSchedules) {
        const startTime = new Date(`${dateString}T${schedule.startTime}`);
        const endTime = new Date(`${dateString}T${schedule.endTime}`);

        while (startTime < endTime) {
          const slotEndTime = new Date(startTime);
          slotEndTime.setMinutes(startTime.getMinutes() + schedule.interval);

          if (slotEndTime <= endTime) {
            timeSlots.push({
              startTime: startTime.toTimeString().slice(0, 5),
              endTime: slotEndTime.toTimeString().slice(0, 5),
              available: true
            });
          }

          startTime.setMinutes(startTime.getMinutes() + schedule.interval);
        }
      }

      // Apply rules to time slots
      const blackoutRule = applicableRules.find(rule => rule.type === 'blackout');
      const isBlackout = !!blackoutRule;

      if (!isBlackout && timeSlots.length > 0) {
        // Apply special hours rules
        const specialHoursRules = applicableRules.filter(rule => rule.type === 'special-hours');
        for (const rule of specialHoursRules) {
          if (rule.startTime && rule.endTime) {
            timeSlots.forEach(slot => {
              if (slot.startTime < rule.startTime! || slot.endTime > rule.endTime!) {
                slot.available = false;
              }
            });
          }
        }

        // Apply holiday rules
        const holidayRules = applicableRules.filter(rule => rule.type === 'holiday');
        if (holidayRules.length > 0) {
          timeSlots.forEach(slot => {
            slot.available = false;
          });
        }
      }

      propertyAvailability.set(dateString, {
        date: dateString,
        timeSlots: timeSlots,
        isFullyBooked: timeSlots.every(slot => !slot.available),
        isBlackout: isBlackout
      });
    }
  }
} 