# Data Mappings Guide & Implementation Patterns

## Overview
This comprehensive guide demonstrates how to implement and extend the advanced data mapping system for insurance applications. The system supports:

- **Advanced Input Types**: Specialized inputs (material_percentage, claims_array, state-specific dropdowns)
- **Dynamic Configuration**: State-aware options and conditional field display
- **Complex Validation**: Business rule enforcement with custom validators
- **Hierarchical Organization**: Parent/child groups with template-based dynamic creation
- **Array Data Handling**: Template patterns for repeating data structures
- **Type Safety**: Full TypeScript integration with interface definitions

## Core Implementation Patterns

### 1. State-Specific Configuration
```typescript
'home.construction.roof_type': {
  key: 'home.construction.roof_type',
  label: 'Roof Type',
  inputType: 'dropdown',
  stateSpecificOptions: {
    'FL': [
      { value: 'tile', label: 'Tile' },
      { value: 'metal', label: 'Metal' },
      { value: 'comp_shingle', label: 'Composition Shingle' }
    ],
    'CA': [
      { value: 'tile', label: 'Tile' },
      { value: 'comp_shingle', label: 'Composition Shingle' },
      { value: 'wood_shake', label: 'Wood Shake' }
    ],
    default: [
      { value: 'comp_shingle', label: 'Composition Shingle' },
      { value: 'asphalt', label: 'Asphalt' }
    ]
  },
  dependsOnStateFrom: 'home.property_address.state',
  group: 'construction_details',
  section: 'home',
  order: 15,
  displayCasing: 'title'
}
```

### 2. Material Percentage Input
```typescript
'home.construction.exterior_wall_materials': {
  key: 'home.construction.exterior_wall_materials',
  label: 'Exterior Wall Materials',
  description: 'Specify materials and their coverage percentages',
  inputType: 'material_percentage',
  group: 'construction_details',
  section: 'home',
  order: 20,
  displayCasing: 'title',
  validations: [
    { type: 'custom', message: 'Total percentage cannot exceed 100%' }
  ]
}
```

### 3. Claims Array Configuration
```typescript
'client.claims_history': {
  key: 'client.claims_history',
  label: 'Claims History',
  description: 'Previous insurance claims in the last 5 years',
  inputType: 'claims_array',
  group: 'insurance_history',
  section: 'applicant',
  order: 40,
  displayCasing: 'none'
}
```

### 4. Template-Based Array Fields
```typescript
// Template for any household member
'client.household_members[*].first_name': {
  key: 'client.household_members[*].first_name',
  label: 'First Name',
  inputType: 'text',
  displayCasing: 'title',
  group: 'household_member_template',
  section: 'applicant',
  order: 1,
  required: true
}

// Runtime creates:
// 'client.household_members[0].first_name' -> group: 'household_member_0'
// 'client.household_members[1].first_name' -> group: 'household_member_1'
```

### 5. Conditional Field Display
```typescript
'auto.anti_theft_device_type': {
  key: 'auto.anti_theft_device_type',
  label: 'Anti-Theft Device Type',
  inputType: 'dropdown',
  options: [
    { value: 'passive_disabling', label: 'Passive Disabling Device' },
    { value: 'active_disabling', label: 'Active Disabling Device' },
    { value: 'tracking_device', label: 'Tracking Device' },
    { value: 'alarm', label: 'Alarm System' }
  ],
  conditional: {
    dependsOn: 'auto.has_anti_theft_device',
    when: 'equals',
    value: 'true'
  },
  group: 'vehicle_details',
  section: 'auto',
  order: 25,
  displayCasing: 'title'
}
```

## Advanced Configuration Patterns

### Hierarchical Group Structure
```typescript
export const FIELD_GROUPS: Record<string, FieldGroup> = {
  // Parent group
  'personal_information': {
    id: 'personal_information',
    name: 'Personal Information',
    order: 1,
    description: 'Basic applicant details'
  },
  
  // Child group
  'contact_details': {
    id: 'contact_details',
    name: 'Contact Details',
    order: 2,
    parentGroup: 'personal_information', // Nested under personal_information
    description: 'Phone, email, and address information'
  },
  
  // Template group for dynamic creation
  'household_member_template': {
    id: 'household_member_template',
    name: 'Household Member',
    order: 10,
    isTemplate: true,
    templatePattern: 'client.household_members[*]',
    dynamicNamePattern: 'Household Member {index}'
  }
}
```

### Complex Data Structures

#### Material Percentage Interface
```typescript
export interface MaterialPercentage {
  material: string;    // The material type (e.g., "Paint", "Hardwood")
  percentage: number;  // Percentage of coverage (0-100)
}

// Validation helper
export const validateMaterialPercentages = (materials: MaterialPercentage[]): ValidationResult => {
  if (!materials || materials.length === 0) return { isValid: true };
  
  const totalPercentage = materials.reduce((sum, item) => sum + (item.percentage || 0), 0);
  
  if (totalPercentage > 100) {
    return { isValid: false, message: 'Total percentage cannot exceed 100%' };
  }
  
  // Check for duplicate materials
  const materialNames = materials.map(item => item.material);
  const uniqueMaterials = new Set(materialNames);
  if (materialNames.length !== uniqueMaterials.size) {
    return { isValid: false, message: 'Cannot have duplicate materials' };
  }
  
  return { isValid: true };
};
```

#### Insurance Claims Interface
```typescript
export interface InsuranceClaim {
  description: string;
  date: string;
  amount: number;
  type: string; // 40+ predefined claim types
  is_catastrophe_loss: boolean;
}

// Claims field schema
export const CLAIMS_FIELD_SCHEMA = {
  description: {
    label: 'Claim Description',
    inputType: 'textarea',
    required: false,
    placeholder: 'Describe what happened...'
  },
  date: {
    label: 'Claim Date',
    inputType: 'date',
    required: false
  },
  amount: {
    label: 'Claim Amount',
    inputType: 'currency',
    required: false,
    prefix: '$',
    validations: [
      { type: 'min', value: 0, message: 'Amount cannot be negative' }
    ]
  },
  type: {
    label: 'Claim Type',
    inputType: 'dropdown',
    required: false,
    options: [
      { value: 'Fire', label: 'Fire' },
      { value: 'Water Damage', label: 'Water Damage' },
      { value: 'Theft/Burglary', label: 'Theft/Burglary' },
      { value: 'Hail', label: 'Hail' },
      { value: 'Wind', label: 'Wind' },
      // ... 35+ more claim types
    ]
  },
  is_catastrophe_loss: {
    label: 'Catastrophe Loss',
    inputType: 'radio',
    required: false,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  }
};
```

#### Prior Insurance Carriers
```typescript
export interface PriorCarrier {
  carrier: string;
  policy_number: string;
  premium: string;
  term_start_date: string;
  term_end_date: string;
}

export const PRIOR_CARRIERS_FIELD_SCHEMA = {
  carrier: {
    label: 'Insurance Carrier',
    inputType: 'text',
    required: false,
    placeholder: 'e.g., State Farm, Allstate, GEICO'
  },
  policy_number: {
    label: 'Policy Number',
    inputType: 'text',
    required: false,
    placeholder: 'Enter policy number'
  },
  premium: {
    label: 'Annual Premium',
    inputType: 'currency',
    required: false,
    prefix: '$',
    validations: [
      { type: 'min', value: 0, message: 'Premium cannot be negative' }
    ]
  },
  term_start_date: {
    label: 'Policy Start Date',
    inputType: 'date',
    required: false
  },
  term_end_date: {
    label: 'Policy End Date',
    inputType: 'date',
    required: false
  }
};
```

## Helper Functions & Utilities

### State-Specific Option Resolution
```typescript
export const getStateSpecificOptions = (
  fieldKey: string, 
  auditData: any
): DropdownOption[] => {
  const fieldConfig = FIELD_CONFIGURATIONS[fieldKey];
  
  if (!fieldConfig?.stateSpecificOptions || !fieldConfig.dependsOnStateFrom) {
    return fieldConfig?.options || [];
  }
  
  const stateCode = getNestedValue(auditData, fieldConfig.dependsOnStateFrom);
  
  if (stateCode && fieldConfig.stateSpecificOptions[stateCode]) {
    return fieldConfig.stateSpecificOptions[stateCode];
  }
  
  return fieldConfig.stateSpecificOptions.default;
};
```

### Template Field Resolution
```typescript
export const getFieldConfigForDataField = (dataFieldKey: string): FieldConfiguration | null => {
  // First try exact match
  if (FIELD_CONFIGURATIONS[dataFieldKey]) {
    return FIELD_CONFIGURATIONS[dataFieldKey];
  }
  
  // Then try template matching for array fields
  for (const [templateKey, config] of Object.entries(FIELD_CONFIGURATIONS)) {
    if (templateKey.includes('[*]')) {
      const pattern = templateKey.replace(/\[(\*|\d+)\]/g, '\\[\\d+\\]');
      const regex = new RegExp(`^${pattern}$`);
      
      if (regex.test(dataFieldKey)) {
        const indexMatch = dataFieldKey.match(/\[(\d+)\]/);
        const index = indexMatch ? parseInt(indexMatch[1]) : 0;
        
        return {
          ...config,
          key: dataFieldKey,
          group: config.group?.replace('_template', `_${index}`) || config.group
        };
      }
    }
  }
  
  return null;
};
```

### Dynamic Group Creation
```typescript
export const createDynamicGroups = (data: any, templateGroups: FieldGroup[]): FieldGroup[] => {
  const dynamicGroups: FieldGroup[] = [];
  
  templateGroups.forEach(template => {
    if (!template.isTemplate || !template.templatePattern) return;
    
    if (template.templatePattern === 'client.household_members[*]') {
      const householdMembers = data.client?.household_members || [];
      
      householdMembers.forEach((member: any, index: number) => {
        dynamicGroups.push({
          id: `household_member_${index}`,
          name: `Household Member ${index + 1}`,
          order: template.order + index,
          parentGroup: template.parentGroup,
          description: `Information for household member ${index + 1}`
        });
      });
    }
    
    if (template.templatePattern === 'auto.vehicles[*]') {
      const vehicles = data.auto?.vehicles || [];
      
      vehicles.forEach((vehicle: any, index: number) => {
        dynamicGroups.push({
          id: `vehicle_${index}`,
          name: `Vehicle ${index + 1}`,
          order: template.order + index,
          parentGroup: template.parentGroup,
          description: `Information for vehicle ${index + 1}`
        });
      });
    }
  });
  
  return dynamicGroups;
};
```

### Hierarchical Group Building
```typescript
export const buildGroupHierarchy = (flatGroups: Record<string, FieldGroup>, dynamicGroups: FieldGroup[] = []) => {
  const allGroups = [...Object.values(flatGroups), ...dynamicGroups];
  const topLevel: FieldGroup[] = [];
  const hierarchy: Record<string, FieldGroup[]> = {};
  
  // Initialize hierarchy for all potential parent groups
  allGroups.forEach(group => {
    if (!group.parentGroup) {
      topLevel.push(group);
      hierarchy[group.id] = [];
    }
  });
  
  // Add children to their parents
  allGroups.forEach(group => {
    if (group.parentGroup && hierarchy[group.parentGroup]) {
      hierarchy[group.parentGroup].push(group);
    }
  });
  
  // Sort everything by order
  topLevel.sort((a, b) => a.order - b.order);
  Object.keys(hierarchy).forEach(parentId => {
    hierarchy[parentId].sort((a, b) => a.order - b.order);
  });
  
  return { topLevel, hierarchy };
};
```

## Implementation Guidelines

### Best Practices
1. **Use state-specific configurations** for location-dependent fields
2. **Implement proper validation** for complex data structures
3. **Leverage template patterns** for array-based data
4. **Organize fields hierarchically** for better user experience
5. **Test dynamic group creation** with sample data

### Common Patterns
- **State dropdowns**: Always include `dependsOnStateFrom` property
- **Array fields**: Use `[*]` notation for templates
- **Complex validation**: Implement custom validation functions
- **Hierarchical groups**: Use `parentGroup` for nested organization
- **Conditional fields**: Use `conditional` property for show/hide logic

### Performance Considerations
- **Lazy load options** for large datasets
- **Cache state resolutions** to avoid repeated calculations
- **Optimize template matching** for large array configurations
- **Use memoization** for expensive validation functions

This advanced system provides enterprise-level insurance data management with sophisticated field mapping, validation, and organization capabilities while maintaining type safety and extensibility.