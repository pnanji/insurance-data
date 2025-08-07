# Data Model System - Implementation Overview

## Problem
Insurance data systems often struggle with transforming technical schema data into user-friendly interfaces. Common issues include:
- **Technical field names**: Schema keys like "is_student_over_100_miles" instead of readable labels
- **Generic input types**: Free-form text everywhere instead of specialized inputs
- **Inconsistent formatting**: No standardized display of currency, phone numbers, dates
- **Complex validation**: Manual validation without reusable rules
- **Poor organization**: Fields appear in schema order rather than logical user flow
- **State dependencies**: No way to handle state-specific options or conditional fields

## Solution Overview
The **TypeScript-based data mapping system** transforms insurance schema properties into comprehensive UI configurations. This system provides:

✅ **Smart property mapping** with user-friendly labels and descriptions  
✅ **Specialized input types** (currency, phone, material percentages, claims arrays, etc.)  
✅ **Advanced validation** with insurance-specific business rules  
✅ **State-aware configurations** with state-specific dropdown options  
✅ **Hierarchical organization** with parent/child group relationships  
✅ **Dynamic field support** for arrays and conditional properties  
✅ **Template-based patterns** for handling repeating data structures  

## Core Components

### 1. `data-mappings.ts`
The comprehensive mapping system featuring:
- **Advanced TypeScript interfaces** for all data types
- **Specialized input types** (material_percentage, claims_array, etc.)
- **State-specific configurations** with fallback options
- **Validation helpers** for complex business rules
- **Hierarchical group structure** with template support
- **Dynamic field resolution** for array-based data

### 2. **Advanced Data Structures**
- **MaterialPercentage**: Handles construction material coverage percentages
- **InsuranceClaim**: Comprehensive claim data with categorization
- **PriorCarrier**: Insurance history with policy details
- **StateSpecificOptions**: Dynamic options based on location
- **FieldGroup**: Hierarchical organization with parent/child relationships

### 3. **Intelligent Field Resolution**
- **Template matching** for array fields using `[*]` notation
- **Dynamic group creation** based on data structure
- **State-aware option resolution** for location-dependent fields
- **Hierarchical field organization** with automatic sorting

## Advanced Features

### State-Aware Configuration
```typescript
// State-specific dropdown options
'home.construction.roof_type': {
  label: 'Roof Type',
  inputType: 'dropdown',
  stateSpecificOptions: {
    'FL': [{ value: 'tile', label: 'Tile' }, { value: 'metal', label: 'Metal' }],
    'CA': [{ value: 'tile', label: 'Tile' }, { value: 'comp_shingle', label: 'Composition Shingle' }],
    default: [{ value: 'comp_shingle', label: 'Composition Shingle' }]
  },
  dependsOnStateFrom: 'home.property_address.state'
}
```

### Complex Data Structures
```typescript
// Material percentage validation
export const validateMaterialPercentages = (materials: MaterialPercentage[]): ValidationResult => {
  const totalPercentage = materials.reduce((sum, item) => sum + (item.percentage || 0), 0);
  if (totalPercentage > 100) {
    return { isValid: false, message: 'Total percentage cannot exceed 100%' };
  }
  return { isValid: true };
};

// Insurance claims with comprehensive categorization
export interface InsuranceClaim {
  description: string;
  date: string;
  amount: number;
  type: string; // 40+ predefined claim types
  is_catastrophe_loss: boolean;
}
```

### Hierarchical Organization
```typescript
// Parent/child group relationships
export interface FieldGroup {
  id: string;
  name: string;
  order: number;
  parentGroup?: string;        // Nested group support
  isTemplate?: boolean;        // Dynamic group creation
  templatePattern?: string;    // Array field patterns
  dynamicNamePattern?: string; // Runtime naming
}
```

### Template-Based Field Mapping
```typescript
// Handle array fields with templates
'client.household_members[*].first_name': {
  label: 'First Name',
  inputType: 'text',
  group: 'household_member_template'
}

// Runtime resolution creates:
// 'client.household_members[0].first_name' -> 'household_member_0'
// 'client.household_members[1].first_name' -> 'household_member_1'
```

## Implementation Strategy

### Phase 1: Schema Analysis
1. **Analyze JSON schemas** in `data-schemas/` folder
2. **Identify property patterns** and relationships
3. **Map complex structures** (arrays, nested objects, state dependencies)
4. **Document business rules** and validation requirements

### Phase 2: Configuration Development
1. **Start with core properties** (applicant, basic coverage)
2. **Implement specialized input types** (currency, percentages, claims)
3. **Configure state-specific options** for location-dependent fields
4. **Set up hierarchical groups** with parent/child relationships
5. **Create templates** for array-based data structures

### Phase 3: Advanced Features
1. **Implement dynamic group creation** for runtime data
2. **Configure conditional field display** based on other values
3. **Set up validation helpers** for complex business rules
4. **Test template resolution** for array fields

## System Benefits

### Advanced User Experience
- **Context-aware interfaces** that adapt to state and data
- **Specialized input controls** for insurance-specific data types
- **Dynamic form generation** based on data structure
- **Intelligent validation** with business rule enforcement
- **Hierarchical organization** that mirrors user mental models

### Data Integrity
- **State-specific validation** ensures location-appropriate data
- **Complex business rules** enforced automatically
- **Array data handling** with structured validation
- **Material percentage validation** ensuring totals don't exceed 100%
- **Claims categorization** with predefined types

### System Architecture
- **TypeScript type safety** prevents configuration errors
- **Template-based scalability** for handling dynamic data
- **Hierarchical organization** supports complex data relationships
- **State management integration** for dynamic option resolution
- **Extensible framework** for adding new input types and validations

## Real-World Examples

### State-Specific Configuration
```
Before: Generic "Roof Type" dropdown for all states
After: Florida shows Tile/Metal options, California shows Tile/Composition Shingle, 
       other states show standard options based on state property
```

### Complex Data Validation
```
Before: Free text for construction materials
After: Structured MaterialPercentage[] with validation ensuring:
       - No duplicate materials
       - Total percentage ≤ 100%
       - Proper material categorization
```

### Dynamic Structure Handling
```
Before: Fixed form structure regardless of data
After: Dynamic group creation for:
       - Multiple household members
       - Multiple vehicles  
       - Variable claim history
       - Flexible coverage options
```

## Getting Started

1. **Explore the current mappings** in `data-mappings.ts`
2. **Understand the schema structure** from `data-schemas/` folder
3. **Review specialized input types** and their validation rules
4. **Study template patterns** for array-based fields
5. **Test state-specific configurations** with sample data

This system provides enterprise-level insurance data management with the flexibility to handle complex, state-dependent, and dynamic data structures while maintaining type safety and data integrity. 