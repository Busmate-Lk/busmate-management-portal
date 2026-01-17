# Validation Rules Directory

This directory contains all validation rules for the BusMate application. Validation rules are organized by domain to make them easy to find, update, and maintain.

## Purpose

- **Centralized Validation Logic**: All validation rules are kept in one place, separate from business logic
- **Easy to Update**: Admins can modify validation rules without touching functional code
- **Configurable**: Validation rules can be easily adjusted based on business requirements
- **Maintainable**: Clear structure makes it easy to add new validations or modify existing ones

## Structure

```
validation-rules/
├── README.md                    # This file
├── scheduleValidation.ts        # Schedule-related validation rules
├── routeValidation.ts          # Route-related validation rules (future)
├── stopValidation.ts           # Stop-related validation rules (future)
└── types.ts                    # Common validation types and interfaces
```

## How to Use

### Importing Validations

```typescript
import { validateSchedule } from '@/validation-rules/scheduleValidation';

const result = validateSchedule(scheduleData);
if (!result.valid) {
  console.error('Validation errors:', result.errors);
}
```

### Adding New Validation Rules

1. Open the appropriate validation file (e.g., `scheduleValidation.ts`)
2. Add or modify rules in the configuration object
3. Rules are automatically applied during validation

### Modifying Existing Rules

Simply update the configuration values in the validation files. No need to touch functional code.

## Best Practices

1. **Keep Rules Declarative**: Define rules as configuration rather than imperative code
2. **Add Clear Error Messages**: Each rule should have a user-friendly error message
3. **Document Requirements**: Add comments explaining why each rule exists
4. **Test Changes**: Always test validation changes before deploying

## For Admins

To modify validation behavior:
1. Navigate to the appropriate validation file
2. Update the rule configuration
3. Save the file
4. Changes will be automatically applied

No programming knowledge required to adjust basic rules like minimum lengths, required fields, etc.
