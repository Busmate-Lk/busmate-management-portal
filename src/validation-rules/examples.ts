/**
 * Advanced Schedule Validation Examples
 * 
 * This file shows examples of how to use the validation system
 * and how to extend it for custom requirements.
 */

import { 
  validateSchedule, 
  validateMultipleSchedules,
  areAllSchedulesValid,
  SCHEDULE_VALIDATION_CONFIG 
} from './scheduleValidation';
import { Schedule } from '@/types/ScheduleWorkspaceData';

// ============================================================================
// EXAMPLE 1: Basic Validation
// ============================================================================

export function example1_BasicValidation(schedule: Schedule) {
  const result = validateSchedule(schedule);
  
  if (!result.valid) {
    console.error('Validation failed:', result.errors);
    // Show errors to user
    result.errors.forEach(error => {
      console.log(`- ${error}`);
    });
    return false;
  }
  
  console.log('Schedule is valid!');
  return true;
}

// ============================================================================
// EXAMPLE 2: Validate Multiple Schedules
// ============================================================================

export function example2_MultipleSchedules(schedules: Schedule[]) {
  const results = validateMultipleSchedules(schedules);
  
  // Find invalid schedules
  const invalidSchedules = results.filter(r => !r.result.valid);
  
  if (invalidSchedules.length > 0) {
    console.log(`${invalidSchedules.length} of ${schedules.length} schedules have errors:`);
    
    invalidSchedules.forEach(({ scheduleIndex, scheduleName, result }) => {
      console.log(`\nSchedule ${scheduleIndex + 1}: "${scheduleName}"`);
      result.errors.forEach(error => console.log(`  - ${error}`));
    });
    
    return false;
  }
  
  console.log('All schedules are valid!');
  return true;
}

// ============================================================================
// EXAMPLE 3: Quick Validation Check
// ============================================================================

export function example3_QuickCheck(schedules: Schedule[]) {
  if (areAllSchedulesValid(schedules)) {
    // Proceed with saving
    console.log('All valid, proceeding with save...');
    return true;
  } else {
    // Show error message
    console.error('Some schedules have validation errors');
    return false;
  }
}

// ============================================================================
// EXAMPLE 4: Conditional Validation Based on Schedule Type
// ============================================================================

export function example4_ConditionalValidation(schedule: Schedule) {
  const result = validateSchedule(schedule);
  
  // Basic validation
  if (!result.valid) {
    return { valid: false, errors: result.errors };
  }
  
  // Additional validation for SPECIAL schedules
  if (schedule.scheduleType === 'SPECIAL') {
    const additionalErrors: string[] = [];
    
    // Special schedules must have a description
    if (!schedule.description || schedule.description.trim().length === 0) {
      additionalErrors.push('Special schedules must include a description');
    }
    
    // Special schedules should have exception dates
    if (!schedule.exceptions || schedule.exceptions.length === 0) {
      additionalErrors.push('Special schedules should define exception dates');
    }
    
    if (additionalErrors.length > 0) {
      return {
        valid: false,
        errors: [...result.errors, ...additionalErrors],
      };
    }
  }
  
  return { valid: true, errors: [] };
}

// ============================================================================
// EXAMPLE 5: Custom Business Rules
// ============================================================================

/**
 * Example of adding custom business logic validation
 * that goes beyond the standard configuration
 */
export function example5_CustomBusinessRules(schedule: Schedule) {
  const errors: string[] = [];
  
  // Standard validation first
  const standardValidation = validateSchedule(schedule);
  if (!standardValidation.valid) {
    errors.push(...standardValidation.errors);
  }
  
  // Custom business rule 1: Peak hour schedules must have more frequent stops
  if (schedule.name.toLowerCase().includes('peak')) {
    const avgTimeBetweenStops = calculateAverageTimeBetweenStops(schedule);
    if (avgTimeBetweenStops > 30) { // 30 minutes
      errors.push('Peak hour schedules must have stops at least every 30 minutes');
    }
  }
  
  // Custom business rule 2: Weekend schedules should have different timing
  if (schedule.calendar.saturday || schedule.calendar.sunday) {
    const hasWeekdayService = schedule.calendar.monday || schedule.calendar.tuesday || 
                              schedule.calendar.wednesday || schedule.calendar.thursday || 
                              schedule.calendar.friday;
    
    if (hasWeekdayService) {
      // This schedule runs both weekdays and weekends - might want to warn
      errors.push('Consider creating separate schedules for weekday and weekend service');
    }
  }
  
  // Custom business rule 3: Long routes must have minimum stops
  const routeDistance = estimateRouteDistance(schedule);
  if (routeDistance > 50 && schedule.scheduleStops.length < 5) {
    errors.push('Long-distance routes (>50km) should have at least 5 stops');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// Helper function for custom validation
function calculateAverageTimeBetweenStops(schedule: Schedule): number {
  // Implementation would calculate time differences between stops
  // This is a placeholder
  return 20; // minutes
}

// Helper function for custom validation
function estimateRouteDistance(schedule: Schedule): number {
  // Implementation would calculate route distance
  // This is a placeholder
  return 45; // kilometers
}

// ============================================================================
// EXAMPLE 6: Validation with Warnings (Non-blocking)
// ============================================================================

export function example6_WithWarnings(schedule: Schedule) {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Standard validation
  const result = validateSchedule(schedule);
  errors.push(...result.errors);
  
  // Add warnings (non-blocking issues)
  if (!schedule.description || schedule.description.trim().length === 0) {
    warnings.push('Consider adding a description to help identify this schedule');
  }
  
  if (schedule.effectiveEndDate && !schedule.effectiveEndDate) {
    warnings.push('No end date specified - schedule will run indefinitely');
  }
  
  const hasWeekendService = schedule.calendar.saturday || schedule.calendar.sunday;
  if (!hasWeekendService) {
    warnings.push('No weekend service scheduled');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    canProceedWithWarnings: errors.length === 0 && warnings.length > 0,
  };
}

// ============================================================================
// EXAMPLE 7: Reading Current Configuration
// ============================================================================

export function example7_DisplayCurrentRules() {
  console.log('Current Schedule Validation Rules:');
  console.log('==================================');
  
  console.log('\nName Rules:');
  console.log(`- Required: ${SCHEDULE_VALIDATION_CONFIG.name.required}`);
  console.log(`- Min Length: ${SCHEDULE_VALIDATION_CONFIG.name.minLength}`);
  console.log(`- Max Length: ${SCHEDULE_VALIDATION_CONFIG.name.maxLength}`);
  
  console.log('\nStop Rules:');
  console.log(`- Minimum Stops: ${SCHEDULE_VALIDATION_CONFIG.stops.minimumStopsRequired}`);
  console.log(`- Require Timing: ${!SCHEDULE_VALIDATION_CONFIG.stops.allowIntermediateStopsWithoutTiming}`);
  
  console.log('\nCalendar Rules:');
  console.log(`- Require Operating Day: ${SCHEDULE_VALIDATION_CONFIG.calendar.requireAtLeastOneOperatingDay}`);
  
  // This could be used to build an admin UI showing current rules
}

// ============================================================================
// EXAMPLE 8: Batch Validation for Import
// ============================================================================

export function example8_BatchImportValidation(schedules: Schedule[]) {
  const results = {
    total: schedules.length,
    valid: 0,
    invalid: 0,
    errors: [] as Array<{ schedule: string; errors: string[] }>,
  };
  
  schedules.forEach((schedule, index) => {
    const validation = validateSchedule(schedule);
    
    if (validation.valid) {
      results.valid++;
    } else {
      results.invalid++;
      results.errors.push({
        schedule: schedule.name || `Schedule ${index + 1}`,
        errors: validation.errors,
      });
    }
  });
  
  return results;
}

// ============================================================================
// EXAMPLE 9: Field-Specific Validation
// ============================================================================

export function example9_ValidateSpecificField(
  schedule: Schedule, 
  field: 'name' | 'dates' | 'stops' | 'calendar'
) {
  // This could be used for real-time validation as user types
  const errors: string[] = [];
  
  switch (field) {
    case 'name':
      if (!schedule.name.trim()) {
        errors.push(SCHEDULE_VALIDATION_CONFIG.name.errorMessage);
      }
      break;
      
    case 'dates':
      if (!schedule.effectiveStartDate) {
        errors.push(SCHEDULE_VALIDATION_CONFIG.dates.errorMessageStartRequired);
      }
      break;
      
    case 'stops':
      if (schedule.scheduleStops.length < SCHEDULE_VALIDATION_CONFIG.stops.minimumStopsRequired) {
        errors.push(SCHEDULE_VALIDATION_CONFIG.stops.errorMessageMinimumStops);
      }
      break;
      
    case 'calendar':
      const hasDay = Object.values(schedule.calendar).some(day => day === true);
      if (!hasDay) {
        errors.push(SCHEDULE_VALIDATION_CONFIG.calendar.errorMessageNoOperatingDays);
      }
      break;
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
