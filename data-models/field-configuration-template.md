# Field Configuration Template & Implementation Guide

## Overview
This guide shows how to expand the field configuration system to handle all your insurance audit fields. The system provides:

- **Field Labels**: User-friendly labels instead of schema names
- **Input Types**: Proper input components (text, number, currency, dropdown, etc.)
- **Formatting**: Currency, phone, percentage, etc. with proper display formatting
- **Validation**: Field-specific validation rules
- **Ordering**: Logical grouping and ordering of fields
- **Styling**: Text casing (title, upper, lower)

## How to Add New Fields

### 1. Basic Text Field Example
```typescript
'applicant.middle_name': {
  key: 'applicant.middle_name',
  label: 'Middle Name',
  inputType: 'text',
  displayCasing: 'title',
  inputCasing: 'title',
  group: 'personal',
  section: 'applicant',
  order: 3,
  required: false
},
```

### 2. Currency Field Example
```typescript
'coverage.personal_property_limit': {
  key: 'coverage.personal_property_limit',
  label: 'Personal Property Coverage Limit',
  description: 'Maximum coverage for personal belongings',
  inputType: 'currency',
  displayCasing: 'none',
  prefix: '$',
  group: 'coverage_preferences',
  section: 'home',
  order: 25,
  required: true,
  validations: [
    { type: 'required', message: 'Personal property coverage is required' },
    { type: 'min', value: 10000, message: 'Minimum coverage is $10,000' },
    { type: 'max', value: 1000000, message: 'Maximum coverage is $1,000,000' }
  ]
},
```

### 3. Dropdown with Options Example
```typescript
'property.construction_type': {
  key: 'property.construction_type',
  label: 'Home Construction Type',
  description: 'Primary construction material of your home',
  inputType: 'dropdown',
  displayCasing: 'title',
  group: 'property_details',
  section: 'home',
  order: 15,
  required: true,
  options: [
    { value: 'frame', label: 'Frame/Wood' },
    { value: 'masonry', label: 'Masonry/Brick' },
    { value: 'concrete', label: 'Concrete' },
    { value: 'steel', label: 'Steel Frame' },
    { value: 'other', label: 'Other' }
  ]
},
```

### 4. Yes/No Boolean Field Example
```typescript
'property.has_swimming_pool': {
  key: 'property.has_swimming_pool',
  label: 'Does the property have a swimming pool?',
  inputType: 'radio',
  displayCasing: 'title',
  group: 'property_details',
  section: 'home',
  order: 50,
  options: [
    { value: 'true', label: 'Yes' },
    { value: 'false', label: 'No' }
  ]
},
```

## Common Insurance Field Patterns

### Driver Information
```typescript
'drivers[0].license_number': {
  key: 'drivers[0].license_number',
  label: 'Driver License Number',
  inputType: 'license',
  displayCasing: 'upper',
  inputCasing: 'upper',
  group: 'drivers',
  section: 'auto',
  order: 10,
  required: true,
  validations: [
    { type: 'required', message: 'License number is required' },
    { type: 'minLength', value: 5, message: 'License number too short' }
  ]
},
```

### Vehicle Information
```typescript
'vehicles[0].year': {
  key: 'vehicles[0].year',
  label: 'Vehicle Year',
  inputType: 'number',
  displayCasing: 'none',
  group: 'vehicle_details',
  section: 'auto',
  order: 1,
  required: true,
  validations: [
    { type: 'required', message: 'Vehicle year is required' },
    { type: 'min', value: 1900, message: 'Year must be 1900 or later' },
    { type: 'max', value: new Date().getFullYear() + 2, message: 'Year cannot be more than 2 years in the future' }
  ]
},
```

### Coverage Limits
```typescript
'coverage.collision_deductible': {
  key: 'coverage.collision_deductible',
  label: 'Collision Deductible',
  inputType: 'dropdown',
  displayCasing: 'none',
  prefix: '$',
  group: 'coverage_preferences',
  section: 'auto',
  order: 40,
  options: [
    { value: '250', label: '$250' },
    { value: '500', label: '$500' },
    { value: '1000', label: '$1,000' },
    { value: '2500', label: '$2,500' }
  ]
},
```

## Field Groups to Consider

### Personal Information
- Name fields (first, middle, last, suffix)
- Date of birth
- SSN (last 4 digits)
- Marital status
- Occupation

### Contact Information
- Email address
- Phone numbers (home, work, mobile)
- Address fields
- Mailing address (if different)

### Insurance History
- Current carrier
- Policy expiration date
- Years with current carrier
- Claims history
- Previous lapses in coverage

### Property Details (Home)
- Property type (single family, condo, etc.)
- Construction type
- Year built
- Square footage
- Number of stories
- Roof type and age
- Heating/cooling systems
- Security features
- Swimming pool
- Other structures

### Coverage Preferences (Home)
- Dwelling coverage
- Personal property
- Liability limits
- Medical payments
- Deductibles
- Optional coverages

### Vehicle Information
- Year, make, model
- VIN
- Mileage
- Vehicle use
- Garaging address
- Safety features
- Anti-theft devices

### Driver Information
- License number
- License state
- Date licensed
- Violations/accidents
- Driver training courses
- Good student discount

### Coverage Preferences (Auto)
- Liability limits
- Comprehensive/collision
- Deductibles
- Uninsured motorist
- Personal injury protection
- Rental reimbursement

## Implementation Steps

1. **Audit Your Current Fields**: Get a complete list of all fields from your API response
2. **Group Similar Fields**: Organize into logical groups
3. **Define Field Properties**: For each field, determine:
   - User-friendly label
   - Input type needed
   - Validation rules
   - Formatting requirements
   - Available options (for dropdowns)
4. **Add to Configuration**: Expand the `FIELD_CONFIGURATIONS` object
5. **Test Incrementally**: Add fields in batches and test

## Sample Implementation Workflow

```typescript
// Example: Adding all driver fields
const driverFields = {
  'drivers[0].first_name': {
    key: 'drivers[0].first_name',
    label: 'Driver First Name',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'drivers',
    section: 'auto',
    order: 1,
    required: true
  },
  
  'drivers[0].date_of_birth': {
    key: 'drivers[0].date_of_birth',
    label: 'Driver Date of Birth',
    inputType: 'date',
    displayCasing: 'none',
    group: 'drivers',
    section: 'auto',
    order: 3,
    required: true
  },
  
  'drivers[0].marital_status': {
    key: 'drivers[0].marital_status',
    label: 'Marital Status',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'drivers',
    section: 'auto',
    order: 5,
    options: [
      { value: 'single', label: 'Single' },
      { value: 'married', label: 'Married' },
      { value: 'divorced', label: 'Divorced' },
      { value: 'widowed', label: 'Widowed' }
    ]
  }
};

// Add to your FIELD_CONFIGURATIONS object
export const FIELD_CONFIGURATIONS: Record<string, FieldConfiguration> = {
  ...existingFields,
  ...driverFields
};
```

## Validation Patterns

### Common Validation Rules
```typescript
// Required field
{ type: 'required', message: 'This field is required' }

// Numeric ranges
{ type: 'min', value: 0, message: 'Value must be positive' }
{ type: 'max', value: 100, message: 'Value cannot exceed 100' }

// String length
{ type: 'minLength', value: 2, message: 'Must be at least 2 characters' }
{ type: 'maxLength', value: 50, message: 'Cannot exceed 50 characters' }

// Pattern matching
{ type: 'pattern', value: '^[A-Z]{2}\\d{6}$', message: 'Invalid license format' }

// Built-in types
{ type: 'email', message: 'Invalid email address' }
{ type: 'phone', message: 'Invalid phone number' }
```

## Next Steps for Your Team

1. **Inventory All Fields**: Create a spreadsheet with all field keys from your API
2. **Define User Labels**: Write user-friendly labels for each field
3. **Categorize Input Types**: Determine the appropriate input type for each field
4. **Gather Dropdown Options**: For fields with limited options, collect all valid values
5. **Set Validation Rules**: Define what makes each field valid
6. **Organize Groups**: Plan the logical grouping and ordering
7. **Implement Incrementally**: Start with one section (e.g., applicant info) and expand

This system will dramatically improve your user experience and data quality! 