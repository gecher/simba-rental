import { useState, useEffect, useCallback } from 'react';
import { availabilityService } from '../services/availability-service';
import { DailyAvailability, TimeSlot, RecurringSchedule, AvailabilityRule, PropertyAvailability } from '../types/availability';

export function useAvailability(propertyId: string) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availability, setAvailability] = useState<DailyAvailability | null>(null);
  const [availabilityLevel, setAvailabilityLevel] = useState<PropertyAvailability | null>(null);

  // Fetch availability for the selected date
  useEffect(() => {
    if (selectedDate && propertyId) {
      const dailyAvailability = availabilityService.getAvailability(propertyId, selectedDate);
      const level = availabilityService.getAvailabilityLevel(propertyId, selectedDate);
      
      setAvailability(dailyAvailability);
      setAvailabilityLevel(level);
    }
  }, [selectedDate, propertyId]);

  // Set recurring schedule
  const setRecurringSchedule = useCallback((schedule: RecurringSchedule) => {
    availabilityService.setRecurringSchedule(schedule);
    if (selectedDate) {
      const dailyAvailability = availabilityService.getAvailability(propertyId, selectedDate);
      const level = availabilityService.getAvailabilityLevel(propertyId, selectedDate);
      
      setAvailability(dailyAvailability);
      setAvailabilityLevel(level);
    }
  }, [propertyId, selectedDate]);

  // Set availability rule
  const setAvailabilityRule = useCallback((rule: AvailabilityRule) => {
    availabilityService.setAvailabilityRule(rule);
    if (selectedDate) {
      const dailyAvailability = availabilityService.getAvailability(propertyId, selectedDate);
      const level = availabilityService.getAvailabilityLevel(propertyId, selectedDate);
      
      setAvailability(dailyAvailability);
      setAvailabilityLevel(level);
    }
  }, [propertyId, selectedDate]);

  // Find next available date
  const findNextAvailableDate = useCallback((startDate: string) => {
    return availabilityService.findNextAvailableDate(propertyId, startDate);
  }, [propertyId]);

  // Check if a specific time slot is available
  const isTimeSlotAvailable = useCallback((time: string): boolean => {
    if (!availability) return false;
    const slot = availability.timeSlots.find(s => s.startTime === time);
    return slot?.available ?? false;
  }, [availability]);

  // Get all available time slots for the selected date
  const getAvailableTimeSlots = useCallback((): TimeSlot[] => {
    if (!availability) return [];
    return availability.timeSlots.filter(slot => slot.available);
  }, [availability]);

  return {
    selectedDate,
    setSelectedDate,
    availability,
    availabilityLevel,
    setRecurringSchedule,
    setAvailabilityRule,
    findNextAvailableDate,
    isTimeSlotAvailable,
    getAvailableTimeSlots,
  };
} 