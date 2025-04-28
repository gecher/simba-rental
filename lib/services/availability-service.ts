import { DailyAvailability, TimeSlot, RecurringSchedule, AvailabilityRule, PropertyAvailability, AvailabilityLevel } from '../types/availability';

class AvailabilityService {
  private schedules: Map<string, RecurringSchedule[]> = new Map();
  private rules: Map<string, AvailabilityRule[]> = new Map();
  private dailyAvailability: Map<string, DailyAvailability> = new Map();

  // Helper to generate a unique key for daily availability
  private getDailyKey(propertyId: string, date: string): string {
    return `${propertyId}_${date}`;
  }

  // Add or update a recurring schedule
  public setRecurringSchedule(schedule: RecurringSchedule): void {
    const propertySchedules = this.schedules.get(schedule.propertyId) || [];
    const existingIndex = propertySchedules.findIndex(s => s.id === schedule.id);
    
    if (existingIndex >= 0) {
      propertySchedules[existingIndex] = schedule;
    } else {
      propertySchedules.push(schedule);
    }
    
    this.schedules.set(schedule.propertyId, propertySchedules);
    this.regenerateAvailability(schedule.propertyId);
  }

  // Add or update an availability rule
  public setAvailabilityRule(rule: AvailabilityRule): void {
    const propertyRules = this.rules.get(rule.propertyId) || [];
    const existingIndex = propertyRules.findIndex(r => r.id === rule.id);
    
    if (existingIndex >= 0) {
      propertyRules[existingIndex] = rule;
    } else {
      propertyRules.push(rule);
    }
    
    // Sort rules by priority
    propertyRules.sort((a, b) => b.priority - a.priority);
    this.rules.set(rule.propertyId, propertyRules);
    this.regenerateAvailability(rule.propertyId);
  }

  // Get availability for a specific date
  public getAvailability(propertyId: string, date: string): DailyAvailability | null {
    const key = this.getDailyKey(propertyId, date);
    return this.dailyAvailability.get(key) || null;
  }

  // Get availability level for a specific date
  public getAvailabilityLevel(propertyId: string, date: string): PropertyAvailability {
    const availability = this.getAvailability(propertyId, date);
    if (!availability) {
      return {
        propertyId,
        date,
        level: 'none',
        availableSlots: 0,
        totalSlots: 0
      };
    }

    const availableSlots = availability.timeSlots.filter(slot => slot.available).length;
    const totalSlots = availability.timeSlots.length;
    const ratio = availableSlots / totalSlots;

    let level: AvailabilityLevel;
    if (ratio === 0) level = 'none';
    else if (ratio < 0.3) level = 'low';
    else if (ratio < 0.7) level = 'medium';
    else level = 'high';

    return {
      propertyId,
      date,
      level,
      availableSlots,
      totalSlots
    };
  }

  // Find the next available date from a given start date
  public findNextAvailableDate(propertyId: string, startDate: string): string | null {
    const maxDays = 365; // Look up to a year ahead
    let currentDate = new Date(startDate);
    const endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() + maxDays);

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const availability = this.getAvailabilityLevel(propertyId, dateStr);
      
      if (availability.level !== 'none') {
        return dateStr;
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return null;
  }

  // Regenerate availability for a property
  private regenerateAvailability(propertyId: string): void {
    // Clear existing availability for this property
    for (const [key] of this.dailyAvailability) {
      if (key.startsWith(propertyId)) {
        this.dailyAvailability.delete(key);
      }
    }

    const propertySchedules = this.schedules.get(propertyId) || [];
    const propertyRules = this.rules.get(propertyId) || [];

    // Generate availability for the next 90 days
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 90);

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay();

      // Start with base schedule
      let timeSlots: TimeSlot[] = [];
      
      // Apply recurring schedules
      for (const schedule of propertySchedules) {
        if (this.isScheduleApplicable(schedule, dateStr, dayOfWeek)) {
          timeSlots = [...schedule.timeSlots];
          break;
        }
      }

      // Apply rules
      for (const rule of propertyRules) {
        if (this.isRuleApplicable(rule, dateStr)) {
          if (rule.type === 'blackout') {
            timeSlots = timeSlots.map(slot => ({ ...slot, available: false }));
          } else if (rule.type === 'special_hours' && rule.timeSlots) {
            timeSlots = [...rule.timeSlots];
          }
        }
      }

      if (timeSlots.length > 0) {
        const key = this.getDailyKey(propertyId, dateStr);
        this.dailyAvailability.set(key, {
          date: dateStr,
          timeSlots,
          isHoliday: propertyRules.some(r => 
            r.type === 'holiday' && 
            this.isRuleApplicable(r, dateStr)
          )
        });
      }
    }
  }

  private isScheduleApplicable(schedule: RecurringSchedule, date: string, dayOfWeek: number): boolean {
    const scheduleDate = new Date(date);
    const startDate = new Date(schedule.startDate);
    
    if (scheduleDate < startDate) return false;
    if (schedule.endDate && scheduleDate > new Date(schedule.endDate)) return false;
    if (schedule.exceptions?.includes(date)) return false;

    switch (schedule.pattern) {
      case 'daily':
        return true;
      case 'weekdays':
        return dayOfWeek >= 1 && dayOfWeek <= 5;
      case 'weekends':
        return dayOfWeek === 0 || dayOfWeek === 6;
      case 'weekly':
        return schedule.daysOfWeek?.includes(dayOfWeek) ?? false;
      // Add more pattern checks as needed
      default:
        return false;
    }
  }

  private isRuleApplicable(rule: AvailabilityRule, date: string): boolean {
    const ruleDate = new Date(date);
    const startDate = new Date(rule.startDate);
    
    if (ruleDate < startDate) return false;
    if (rule.endDate && ruleDate > new Date(rule.endDate)) return false;
    
    return true;
  }
}

export const availabilityService = new AvailabilityService(); 