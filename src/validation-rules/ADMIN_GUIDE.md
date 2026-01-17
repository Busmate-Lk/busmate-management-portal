# Admin Guide: Schedule Validation Configuration

This guide explains how to modify schedule validation rules without programming knowledge.

## Quick Start

1. Open the file: `/src/validation-rules/scheduleValidation.ts`
2. Find the `SCHEDULE_VALIDATION_CONFIG` object (starts around line 20)
3. Modify the configuration values as needed
4. Save the file
5. Validation rules are automatically applied

## Configuration Options

### Schedule Name Validation

```typescript
name: {
  required: true,              // Must schedule have a name?
  minLength: 1,                // Minimum characters (1 = at least 1 character)
  maxLength: 100,              // Maximum characters allowed
  errorMessage: 'Schedule name is required',
}
```

**Example Changes:**
- To allow longer names: Change `maxLength: 100` to `maxLength: 200`
- To make name optional: Change `required: true` to `required: false`

---

### Date Validation

```typescript
dates: {
  startDateRequired: true,           // Must schedule have a start date?
  endDateOptional: true,             // Is end date optional?
  endDateMustBeAfterStart: true,     // Must end date be after start date?
  errorMessageStartRequired: 'Start date is required',
  errorMessageEndBeforeStart: 'End date must be after start date',
}
```

**Example Changes:**
- To require end date: Change `endDateOptional: true` to `endDateOptional: false`
- To allow end date before start date: Change `endDateMustBeAfterStart: true` to `false`

---

### Stop Timing Validation

```typescript
stops: {
  minimumStopsRequired: 2,                      // Minimum number of stops (start + end)
  requireStartStopDepartureTime: true,          // Start stop must have departure time?
  requireEndStopArrivalTime: true,              // End stop must have arrival time?
  allowIntermediateStopsWithoutTiming: true,    // Can intermediate stops have no timing?
  allowPartialTimingForIntermediateStops: true, // Can intermediate stops have only arrival OR departure?
  errorMessageMinimumStops: 'At least 2 stops (start and end) are required for a schedule',
  errorMessageStartStopDeparture: 'Start stop must have a departure time',
  errorMessageEndStopArrival: 'End stop must have an arrival time',
}
```

**Current Rules:**
- **Minimum 2 stops required**: Every schedule must have at least a start stop and an end stop
- **Start stop**: MUST have departure time (arrival time is optional)
- **End stop**: MUST have arrival time (departure time is optional)
- **Intermediate stops**: Can exist without any timing, or with partial timing (only arrival OR only departure)

**Example Changes:**
- To require 3 stops minimum: Change `minimumStopsRequired: 2` to `minimumStopsRequired: 3`
- To make start stop arrival time optional: Keep `requireStartStopDepartureTime: true` (no change needed)
- To require timing for all intermediate stops: Change `allowIntermediateStopsWithoutTiming: true` to `false`

---

### Operating Days (Calendar) Validation

```typescript
calendar: {
  requireAtLeastOneOperatingDay: true,  // Must select at least 1 day of week?
  errorMessageNoOperatingDays: 'At least one operating day must be selected',
}
```

**Example Changes:**
- To allow schedules with no operating days: Change `requireAtLeastOneOperatingDay: true` to `false`

---

### Exception Date Validation

```typescript
exceptions: {
  allowDuplicateDates: false,          // Can same date appear twice?
  requireFutureExceptions: false,      // Must exception dates be in future?
  errorMessageDuplicateDate: 'Duplicate exception dates are not allowed',
}
```

**Example Changes:**
- To allow duplicate exception dates: Change `allowDuplicateDates: false` to `true`
- To require future dates only: Change `requireFutureExceptions: false` to `true`

---

## Common Use Cases

### Making Schedule Creation More Flexible

If you want to allow users to save incomplete schedules (drafts):

```typescript
// In SCHEDULE_VALIDATION_CONFIG:
stops: {
  minimumStopsRequired: 0,                // Allow no stops
  requireAtLeastOneStopWithTiming: false, // Don't require timing
  allowStopsWithoutTiming: true,          // Allow stops without timing
  // ... rest of config
}
```

### Enforcing Stricter Rules

If you want to ensure high-quality schedule data:

```typescript
// In SCHEDULE_VALIDATION_CONFIG:
name: {
  required: true,
  minLength: 5,                    // Name must be at least 5 characters
  maxLength: 50,                   // Name limited to 50 characters
  // ... rest of config
},

stops: {
  minimumStopsRequired: 2,         // At least 2 stops required
  requireAtLeastOneStopWithTiming: true,
  allowStopsWithoutTiming: false,  // All stops must have timing
  // ... rest of config
}
```

### Allowing More Flexible Dates

If you want to allow schedules without end dates or past dates:

```typescript
// In SCHEDULE_VALIDATION_CONFIG:
dates: {
  startDateRequired: true,
  endDateOptional: true,
  endDateMustBeAfterStart: false,  // Allow end date before start (unusual but possible)
  // ... rest of config
}
```

## Testing Your Changes

After making changes:

1. Save the file
2. Go to the Schedule Workspace in the application
3. Try creating/editing a schedule
4. Verify that validation messages appear as expected

## Error Messages

All error messages can be customized by editing the `errorMessage` fields in the configuration.

**Example:**
```typescript
errorMessage: 'Schedule name is required',
```

Can be changed to:
```typescript
errorMessage: 'Please enter a name for this schedule',
```

## Need Help?

If you need to add completely new validation rules (not just modify existing ones), contact your development team. They can add new validation functions to the system.

## Safety Tips

1. **Always keep a backup** of the original configuration before making changes
2. **Test changes** in a development environment before applying to production
3. **Use clear error messages** that help users understand what's wrong
4. **Don't modify** the function code below the configuration object unless you're a developer

## Configuration Backup

Before making changes, copy the entire `SCHEDULE_VALIDATION_CONFIG` object to a safe place. You can restore it if something goes wrong.

---

**Last Updated:** January 17, 2026  
**Configuration File:** `/src/validation-rules/scheduleValidation.ts`
