// Field Configuration System for Insurance Audit Fields
// This file defines how schema field keys map to their UI presentation properties

export type FieldInputType = 
  | 'text'
  | 'number' 
  | 'currency'
  | 'percentage'
  | 'phone'
  | 'email'
  | 'date'
  | 'dropdown'
  | 'multiselect'
  | 'textarea'
  | 'radio'
  | 'checkbox'
  | 'zip'
  | 'ssn'
  | 'license'
  | 'vin'
  | 'address'
  | 'material_percentage' 
  | 'claims_array'; 

export type TextCasing = 'title' | 'upper' | 'lower' | 'sentence' | 'none';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// NEW: State-specific dropdown configuration
export interface StateSpecificOptions {
  [stateCode: string]: DropdownOption[];
  default: DropdownOption[]; // Fallback options if state not found (required)
}

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'phone' | 'custom';
  value?: any;
  message?: string;
}

// NEW: Interface for material with percentage
export interface MaterialPercentage {
  material: string;    // The material type (e.g., "Paint", "Hardwood")
  percentage: number;  // Percentage of coverage (0-100)
}

// NEW: Interface for insurance claims
export interface InsuranceClaim {
  description: string;
  date: string;
  amount: number;
  type: string;
  is_catastrophe_loss: boolean;
}

// NEW: Interface for prior insurance carriers
export interface PriorCarrier {
  carrier: string;
  policy_number: string;
  premium: string;
  term_start_date: string;
  term_end_date: string;
}

// NEW: Validation helper for material percentages
export const validateMaterialPercentages = (materials: MaterialPercentage[]): { isValid: boolean; message?: string } => {
  if (!materials || materials.length === 0) {
    return { isValid: true }; // Allow empty arrays
  }
  
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

// NEW: Field schemas for claims array
export const CLAIMS_FIELD_SCHEMA = {
  description: {
    label: 'Claim Description',
    inputType: 'textarea' as FieldInputType,
    required: false,
    placeholder: 'Describe what happened...'
  },
  date: {
    label: 'Claim Date',
    inputType: 'date' as FieldInputType,
    required: false
  },
  amount: {
    label: 'Claim Amount',
    inputType: 'currency' as FieldInputType,
    required: false,
    prefix: '$',
    validations: [
      { type: 'min', value: 0, message: 'Amount cannot be negative' }
    ]
  },
  type: {
    label: 'Claim Type',
    inputType: 'dropdown' as FieldInputType,
    required: false,
    options: [
      { value: 'Contamination', label: 'Contamination' },
      { value: 'Damage to Property of Others', label: 'Damage to Property of Others' },
      { value: 'Dog Bite (Liability)', label: 'Dog Bite (Liability)' },
      { value: 'Earth Movement', label: 'Earth Movement' },
      { value: 'Earthquake', label: 'Earthquake' },
      { value: 'Extended Coverage Perils', label: 'Extended Coverage Perils' },
      { value: 'Fire', label: 'Fire' },
      { value: 'Flood', label: 'Flood' },
      { value: 'Freezing Water (Inc. Burst Pipes)', label: 'Freezing Water (Inc. Burst Pipes)' },
      { value: 'Hail', label: 'Hail' },
      { value: 'Liability (All Other)', label: 'Liability (All Other)' },
      { value: 'Lightning', label: 'Lightning' },
      { value: 'Medical Payments', label: 'Medical Payments' },
      { value: 'Mysterious Disappearance', label: 'Mysterious Disappearance' },
      { value: 'Mysterious Disappearance (Scheduled Property)', label: 'Mysterious Disappearance (Scheduled Property)' },
      { value: 'Other', label: 'Other' },
      { value: 'Physical Damage (All Other)', label: 'Physical Damage (All Other)' },
      { value: 'Slip/Fall (Liability)', label: 'Slip/Fall (Liability)' },
      { value: 'Smoke', label: 'Smoke' },
      { value: 'Theft/Burglary', label: 'Theft/Burglary' },
      { value: 'Theft Scheduled Property', label: 'Theft Scheduled Property' },
      { value: 'Vandalism/Malicious Mischief', label: 'Vandalism/Malicious Mischief' },
      { value: 'Water Craft', label: 'Water Craft' },
      { value: 'Water Damage', label: 'Water Damage' },
      { value: 'Wind', label: 'Wind' },
      { value: 'Workers Compensation', label: 'Workers Compensation' }
    ]
  },
  is_catastrophe_loss: {
    label: 'Catastrophe Loss',
    inputType: 'radio' as FieldInputType,
    required: false,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  }
};

// NEW: Field schemas for prior carriers array
export const PRIOR_CARRIERS_FIELD_SCHEMA = {
  carrier: {
    label: 'Insurance Carrier',
    inputType: 'text' as FieldInputType,
    required: false,
    placeholder: 'e.g., State Farm, Allstate, GEICO'
  },
  policy_number: {
    label: 'Policy Number',
    inputType: 'text' as FieldInputType,
    required: false,
    placeholder: 'Enter policy number'
  },
  premium: {
    label: 'Annual Premium',
    inputType: 'currency' as FieldInputType,
    required: false,
    prefix: '$',
    validations: [
      { type: 'min', value: 0, message: 'Premium cannot be negative' }
    ]
  },
  term_start_date: {
    label: 'Policy Start Date',
    inputType: 'date' as FieldInputType,
    required: false
  },
  term_end_date: {
    label: 'Policy End Date',
    inputType: 'date' as FieldInputType,
    required: false
  }
};

// NEW: Field schemas for auto violations/claims array
export const VIOLATIONS_CLAIMS_FIELD_SCHEMA = {
  driver_name: {
    label: 'Driver Name',
    inputType: 'text' as FieldInputType,
    required: true,
    placeholder: 'Full name of driver'
  },
  date: {
    label: 'Date',
    inputType: 'date' as FieldInputType,
    required: true
  },
  code: {
    label: 'Violation/Claim Code',
    inputType: 'text' as FieldInputType,
    required: true,
    placeholder: 'e.g., SP01, AT01, COMP'
  },
  amount_paid: {
    label: 'Amount Paid',
    inputType: 'currency' as FieldInputType,
    required: false,
    prefix: '$',
    placeholder: 'Amount paid for violation fine or claim',
    validations: [
      { type: 'min', value: 0, message: 'Amount cannot be negative' }
    ]
  }
};

export interface FieldGroup {
  id: string;
  name: string;
  order: number;
  description?: string;
  defaultOpen?: boolean;
  
  // NEW: Hierarchy support
  parentGroup?: string;        // ID of parent group
  
  // Dynamic group templates
  isTemplate?: boolean;        // This group creates dynamic instances
  templatePattern?: string;    // Pattern to match array fields
  dynamicNamePattern?: string; // How to name dynamic groups
}

export interface FieldConfiguration {
  // Basic Properties
  key: string;                    // Schema field key (e.g., "applicant.first_name")
  label: string;                  // User-friendly label
  description?: string;           // Help text or tooltip
  
  // Input Properties
  inputType: FieldInputType;      // Type of input component
  placeholder?: string;           // Placeholder text
  options?: DropdownOption[];     // For dropdown/select fields (static options)
  stateSpecificOptions?: StateSpecificOptions; // NEW: State-dependent options
  dependsOnStateFrom?: string;    // NEW: Which field contains the state (e.g., "client.current_address.state")
  
  // Formatting Properties
  displayCasing: TextCasing;      // How to format the display value
  inputCasing?: TextCasing;       // How to format while typing (optional)
  prefix?: string;                // For currency ($), percentage (%), etc.
  suffix?: string;                // For units (sq ft, miles, etc.)
  
  // Validation
  validations?: ValidationRule[]; // Validation rules
  required?: boolean;             // Quick required flag
  
  // Organization
  group?: string;                 // Group ID this field belongs to
  order: number;                  // Order within its group/section
  section: 'applicant' | 'home' | 'auto'; // Which main section
  
  // Display Properties
  hidden?: boolean;               // Hide from UI
  readonly?: boolean;             // Read-only field
  conditional?: {                 // Show/hide based on other fields
    dependsOn: string;
    when: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
    value: any;
  };
  
  // Formatting Functions (for complex cases)
  customFormatter?: string;       // Reference to a custom formatter function
  customValidator?: string;       // Reference to a custom validator function
}

// Shared state options for all state dropdown fields
export const US_STATE_OPTIONS: DropdownOption[] = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'DC', label: 'District of Columbia' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' }
];

// Helper function to normalize state values from API data
export const normalizeStateValue = (stateValue: string | null | undefined): string | null => {
  if (!stateValue) return null;
  
  const normalizedInput = stateValue.trim().toLowerCase();
  
  // If it's already a 2-letter abbreviation, return uppercase
  if (normalizedInput.length === 2) {
    const upperValue = normalizedInput.toUpperCase();
    // Verify it's a valid state abbreviation
    if (US_STATE_OPTIONS.find(option => option.value === upperValue)) {
      return upperValue;
    }
  }
  
  // Try to find by full state name (case-insensitive)
  const matchedState = US_STATE_OPTIONS.find(option => 
    option.label.toLowerCase() === normalizedInput
  );
  
  return matchedState ? matchedState.value : null;
};

// Helper function to get display label for a state value
export const getStateDisplayLabel = (stateValue: string | null | undefined): string => {
  if (!stateValue) return '';
  
  const normalizedValue = normalizeStateValue(stateValue);
  if (!normalizedValue) return stateValue || '';
  
  const matchedState = US_STATE_OPTIONS.find(option => option.value === normalizedValue);
  return matchedState ? matchedState.label : stateValue || '';
};

// Define field groups with single-level structure under each section
export const FIELD_GROUPS: Record<string, FieldGroup> = {
  // APPLICANT SECTION GROUPS
  personal_information: {
    id: 'personal_information',
    name: 'Personal Information',
    order: 1,
    description: 'Basic personal details and contact information',
    defaultOpen: true
  },
  
  address: {
    id: 'address',
    name: 'Address',
    order: 2,
    description: 'Current and previous address information',
    defaultOpen: true
  },
  
  education_employment: {
    id: 'education_employment',
    name: 'Education & Employment',
    order: 3,
    description: 'Educational background and employment details',
    defaultOpen: true
  },
  
  driver_information: {
    id: 'driver_information',
    name: 'Driver Information',
    order: 4,
    description: 'Driver license and training information',
    defaultOpen: true
  },
  
  special_circumstances: {
    id: 'special_circumstances',
    name: 'Special Circumstances',
    order: 5,
    description: 'Additional personal circumstances',
    defaultOpen: false
  },

  internal_information: {
    id: 'internal_information',
    name: 'Internal Information',
    order: 6,
    description: 'Agency and assignment information',
    defaultOpen: false
  },
  
  household_member_template: {
    id: 'household_member_template',
    name: 'Household Members',
    order: 7,
    isTemplate: true,
    templatePattern: 'client.household_members[*]',
    dynamicNamePattern: 'Household Member {index + 1}',
    defaultOpen: false
  },

  // HOME SECTION GROUPS (ordered by sequence)
  general_property: {
    id: 'general_property',
    name: 'General Information',
    order: 1,
    description: 'Basic property characteristics',
    defaultOpen: true
  },
  
  exterior: {
    id: 'exterior',
    name: 'Exterior',
    order: 2,
    description: 'Building materials and construction type',
    defaultOpen: true
  },

  interior: {
    id: 'interior',
    name: 'Interior',
    order: 3,
    description: 'Interior finishes and features',
    defaultOpen: true
  },
  
  utility_systems: {
    id: 'utility_systems',
    name: 'Utilities & Systems',
    order: 4,
    description: 'Heating, cooling, electrical, and plumbing',
    defaultOpen: true
  },
  
  safety_security: {
    id: 'safety_security',
    name: 'Safety & Security',
    order: 5,
    description: 'Security systems and safety features',
    defaultOpen: true
  },

  property_features_risks: {
    id: 'property_features_risks',
    name: 'Property Features & Risks',
    order: 6,
    description: 'Swimming pools, trampolines, dogs, and other risk factors',
    defaultOpen: false
  },

  current_coverages: {
    id: 'current_coverages',
    name: 'Coverage & Deductibles',
    order: 7,
    description: 'Current insurance coverage amounts and deductibles',
    defaultOpen: true
  },
  
  current_endorsements: {
    id: 'current_endorsements',
    name: 'Current Endorsements',
    order: 8,
    description: 'Current policy endorsements and additional coverages',
    defaultOpen: false
  },

  financial_interests: {
    id: 'financial_interests',
    name: 'Financial Interests',
    order: 9,
    description: 'Mortgages and other financial interests',
    defaultOpen: false
  },

  additional_interests_template: {
    id: 'additional_interests_template',
    name: 'Additional Interest',
    order: 9.5,
    isTemplate: true,
    templatePattern: 'home.additional_interests[*]',
    dynamicNamePattern: 'Additional Interest {index + 1}',
    defaultOpen: false
  },

  insurance_history: {
    id: 'insurance_history',
    name: 'Insurance History',
    order: 10,
    description: 'Current carrier details and prior insurance carriers',
    defaultOpen: false
  },

  claims_history: {
    id: 'claims_history',
    name: 'Claims History',
    order: 11,
    description: 'Previous claims in the last 5 years',
    defaultOpen: false
  },

  wind_mitigation: {
    id: 'wind_mitigation',
    name: 'Wind Mitigation',
    order: 12,
    description: 'Wind mitigation inspection details and ratings',
    defaultOpen: false
  },

  flood_coverage: {
    id: 'flood_coverage',
    name: 'Flood Coverage',
    order: 13,
    description: 'Flood insurance coverage details and zone information',
    defaultOpen: false
  },

  roof_coverage: {
    id: 'roof_coverage',
    name: 'Roof Coverage',
    order: 14,
    description: 'Roof-specific coverage and replacement costs',
    defaultOpen: false
  },

  // AUTO SECTION GROUPS
  auto_policy_information: {
    id: 'auto_policy_information',
    name: 'Policy Information',
    order: 1,
    description: 'General auto policy preferences and settings',
    defaultOpen: true
  },

  violations_claims: {
    id: 'violations_claims',
    name: 'Violations & Claims',
    order: 2,
    description: 'Driver violations and insurance claims history',
    defaultOpen: false
  },

  vehicle_template: {
    id: 'vehicle_template',
    name: 'Vehicle',
    order: 3,
    isTemplate: true,
    templatePattern: 'auto.vehicles[*]',
    dynamicNamePattern: 'Vehicle {index + 1}',
    defaultOpen: true
  },

  vehicle_details: {
    id: 'vehicle_details',
    name: 'Vehicle Details',
    order: 1,
    parentGroup: 'vehicle_template',
    description: 'Basic vehicle information and specifications',
    defaultOpen: true
  },

  vehicle_ownership: {
    id: 'vehicle_ownership',
    name: 'Ownership & Registration',
    order: 2,
    parentGroup: 'vehicle_template',
    description: 'Vehicle ownership and registration details',
    defaultOpen: true
  },

  vehicle_usage: {
    id: 'vehicle_usage',
    name: 'Vehicle Usage',
    order: 3,
    parentGroup: 'vehicle_template',
    description: 'How the vehicle is used and driven',
    defaultOpen: true
  },

  vehicle_features: {
    id: 'vehicle_features',
    name: 'Features & Equipment',
    order: 4,
    parentGroup: 'vehicle_template',
    description: 'Safety features and special equipment',
    defaultOpen: false
  },

  garaging_address: {
    id: 'garaging_address',
    name: 'Garaging Address',
    order: 5,
    parentGroup: 'vehicle_template',
    description: 'Where the vehicle is primarily kept',
    defaultOpen: false
  },

  vehicle_coverages: {
    id: 'vehicle_coverages',
    name: 'Vehicle Coverages',
    order: 6,
    parentGroup: 'vehicle_template',
    description: 'Coverage options for this vehicle',
    defaultOpen: false
  },
  
  current_insurance_details: {
    id: 'current_insurance_details',
    name: 'Current Insurance',
    order: 4,
    description: 'Current auto insurance carrier and policy details',
    defaultOpen: true
  }
};

// Field configurations using hierarchical groups
export const FIELD_CONFIGURATIONS: Record<string, FieldConfiguration> = {
  // PERSONAL INFORMATION FIELDS
  'client.first_name': {
    key: 'client.first_name',
    label: 'First Name',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'personal_information',
    section: 'applicant',
    order: 1,
    required: true,
    validations: [
      { type: 'required', message: 'First name is required' },
      { type: 'minLength', value: 1, message: 'First name cannot be empty' }
    ]
  },

  'client.middle_name': {
    key: 'client.middle_name',
    label: 'Middle Name',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'personal_information',
    section: 'applicant',
    order: 2
  },
  
  'client.last_name': {
    key: 'client.last_name',
    label: 'Last Name',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'personal_information',
    section: 'applicant',
    order: 3,
    required: true,
    validations: [
      { type: 'required', message: 'Last name is required' }
    ]
  },

  'client.suffix': {
    key: 'client.suffix',
    label: 'Suffix',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'personal_information',
    section: 'applicant',
    order: 4,
    options: [
      { value: 'Jr', label: 'Jr' },
      { value: 'Sr', label: 'Sr' },
      { value: 'I', label: 'I' },
      { value: 'II', label: 'II' },
      { value: 'III', label: 'III' },
      { value: 'IV', label: 'IV' }
    ]
  },

  'client.dob': {
    key: 'client.dob',
    label: 'Date of Birth',
    inputType: 'date',
    displayCasing: 'none',
    group: 'personal_information',
    section: 'applicant',
    order: 5,
    required: true,
    validations: [
      { type: 'required', message: 'Date of birth is required' }
    ]
  },

  'client.gender': {
    key: 'client.gender',
    label: 'Gender',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'personal_information',
    section: 'applicant',
    order: 6,
    options: [
      { value: 'Male', label: 'Male' },
      { value: 'Female', label: 'Female' }
    ]
  },

  'client.marital_status': {
    key: 'client.marital_status',
    label: 'Marital Status',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'personal_information',
    section: 'applicant',
    order: 7,
    options: [
      { value: 'Domestic Partner', label: 'Domestic Partner' },
      { value: 'Divorced', label: 'Divorced' },
      { value: 'Married', label: 'Married' },
      { value: 'Separated', label: 'Separated' },
      { value: 'Single', label: 'Single' },
      { value: 'Unknown', label: 'Unknown' },
      { value: 'Widowed', label: 'Widowed' }
    ]
  },

  'client.email': {
    key: 'client.email',
    label: 'Email Address',
    inputType: 'email',
    displayCasing: 'lower',
    inputCasing: 'lower',
    group: 'personal_information',
    section: 'applicant',
    order: 8,
    validations: [
      { type: 'email', message: 'Please enter a valid email address' }
    ]
  },

  'client.mobile_phone': {
    key: 'client.mobile_phone',
    label: 'Phone Number',
    inputType: 'phone',
    displayCasing: 'none',
    group: 'personal_information',
    section: 'applicant',
    order: 9,
    placeholder: '(555) 123-4567',
    validations: [
      { type: 'phone', message: 'Please enter a valid phone number' }
    ]
  },

  // ADDRESS FIELDS
  'client.current_address_line1': {
    key: 'client.current_address_line1',
    label: 'Current Address Line 1',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'address',
    section: 'applicant',
    order: 10,
    required: true,
    placeholder: '123 Main Street',
    validations: [
      { type: 'required', message: 'Address line 1 is required' }
    ]
  },

  'client.current_address_line2': {
    key: 'client.current_address_line2',
    label: 'Current Address Line 2',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'address',
    section: 'applicant',
    order: 11,
    placeholder: 'Apt, Suite, Unit (optional)'
  },

  'client.current_address_city': {
    key: 'client.current_address_city',
    label: 'Current City',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'address',
    section: 'applicant',
    order: 12,
    required: true,
    validations: [
      { type: 'required', message: 'City is required' }
    ]
  },

  'client.current_address_state': {
    key: 'client.current_address_state',
    label: 'Current State',
    description: 'Use normalizeStateValue() helper to handle API data variations',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'address',
    section: 'applicant',
    order: 13,
    required: true,
    options: US_STATE_OPTIONS,
    validations: [
      { type: 'required', message: 'State is required' }
    ]
  },

  'client.current_address_zip': {
    key: 'client.current_address_zip',
    label: 'Current ZIP Code',
    inputType: 'zip',
    displayCasing: 'none',
    group: 'address',
    section: 'applicant',
    order: 14,
    required: true,
    placeholder: '12345',
    validations: [
      { type: 'required', message: 'ZIP code is required' },
      { type: 'pattern', value: '^[0-9]{5}(-[0-9]{4})?$', message: 'ZIP code must be 5 digits or 5+4 format' }
    ]
  },

  'client.current_address_county': {
    key: 'client.current_address_county',
    label: 'Current County',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'address',
    section: 'applicant',
    order: 15
  },

  'client.current_address_years': {
    key: 'client.current_address_years',
    label: 'Years at Current Address',
    inputType: 'number',
    displayCasing: 'none',
    group: 'address',
    section: 'applicant',
    order: 16,
    validations: [
      { type: 'min', value: 0, message: 'Years cannot be negative' },
      { type: 'max', value: 100, message: 'Years cannot exceed 100' }
    ]
  },

  'client.current_address_months': {
    key: 'client.current_address_months',
    label: 'Additional Months at Current Address',
    inputType: 'number',
    displayCasing: 'none',
    group: 'address',
    section: 'applicant',
    order: 17,
    validations: [
      { type: 'min', value: 0, message: 'Months cannot be negative' },
      { type: 'max', value: 11, message: 'Months cannot exceed 11' }
    ]
  },

  'client.previous_address_line1': {
    key: 'client.previous_address_line1',
    label: 'Previous Address Line 1',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'address',
    section: 'applicant',
    order: 18,
    placeholder: '123 Main Street'
  },

  'client.previous_address_line2': {
    key: 'client.previous_address_line2',
    label: 'Previous Address Line 2',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'address',
    section: 'applicant',
    order: 19,
    placeholder: 'Apt, Suite, Unit (optional)'
  },

  'client.previous_address_city': {
    key: 'client.previous_address_city',
    label: 'Previous City',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'address',
    section: 'applicant',
    order: 20
  },

  'client.previous_address_state': {
    key: 'client.previous_address_state',
    label: 'Previous State',
    description: 'Use normalizeStateValue() helper to handle API data variations',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'address',
    section: 'applicant',
    order: 21,
    options: US_STATE_OPTIONS
  },

  'client.previous_address_zip': {
    key: 'client.previous_address_zip',
    label: 'Previous ZIP Code',
    inputType: 'zip',
    displayCasing: 'none',
    group: 'address',
    section: 'applicant',
    order: 22,
    placeholder: '12345',
    validations: [
      { type: 'pattern', value: '^[0-9]{5}(-[0-9]{4})?$', message: 'ZIP code must be 5 digits or 5+4 format' }
    ]
  },

  'client.previous_address_county': {
    key: 'client.previous_address_county',
    label: 'Previous County',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'address',
    section: 'applicant',
    order: 23
  },

  'client.previous_address_years': {
    key: 'client.previous_address_years',
    label: 'Years at Previous Address',
    inputType: 'number',
    displayCasing: 'none',
    group: 'address',
    section: 'applicant',
    order: 24,
    validations: [
      { type: 'min', value: 0, message: 'Years cannot be negative' },
      { type: 'max', value: 100, message: 'Years cannot exceed 100' }
    ]
  },

  'client.previous_address_months': {
    key: 'client.previous_address_months',
    label: 'Additional Months at Previous Address',
    inputType: 'number',
    displayCasing: 'none',
    group: 'address',
    section: 'applicant',
    order: 25,
    validations: [
      { type: 'min', value: 0, message: 'Months cannot be negative' },
      { type: 'max', value: 11, message: 'Months cannot exceed 11' }
    ]
  },

  // EDUCATION & EMPLOYMENT FIELDS
  'client.education': {
    key: 'client.education',
    label: 'Education Level',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'education_employment',
    section: 'applicant',
    order: 26,
    options: [
      { value: 'Associates', label: "Associate's" },
      { value: 'Bachelors', label: "Bachelor's" },
      { value: 'High School', label: 'High school or equivalent' },
      { value: 'JD/LLD', label: 'JD/LLD' },
      { value: 'Less than High School', label: 'Less than high school' },
      { value: 'Masters', label: 'Masters' },
      { value: 'MD', label: 'MD' },
      { value: 'PhD', label: 'PhD' },
      { value: 'Some College', label: 'Some college' },
      { value: 'Vocational', label: 'Vocational' }
    ]
  },

  'client.occupation_role': {
    key: 'client.occupation_role',
    label: 'Occupation',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'education_employment',
    section: 'applicant',
    order: 27,
    placeholder: 'e.g., Software Engineer, Teacher, Manager'
  },

  'client.occupation_industry': {
    key: 'client.occupation_industry',
    label: 'Industry',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'education_employment',
    section: 'applicant',
    order: 28,
    placeholder: 'e.g., Technology, Healthcare, Finance'
  },

  'client.years_with_current_employer': {
    key: 'client.years_with_current_employer',
    label: 'Years with Current Employer',
    inputType: 'number',
    displayCasing: 'none',
    group: 'education_employment',
    section: 'applicant',
    order: 29,
    validations: [
      { type: 'min', value: 0, message: 'Years cannot be negative' },
      { type: 'max', value: 60, message: 'Years cannot exceed 60' }
    ]
  },

  // DRIVER INFORMATION FIELDS
  'client.license_number': {
    key: 'client.license_number',
    label: 'License Number',
    inputType: 'license',
    displayCasing: 'upper',
    inputCasing: 'upper',
    group: 'driver_information',
    section: 'applicant',
    order: 30,
    placeholder: 'Enter your driver license number'
  },

  'client.license_state': {
    key: 'client.license_state',
    label: 'License State',
    description: 'State where your driver license was issued',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'driver_information',
    section: 'applicant',
    order: 31,
    options: US_STATE_OPTIONS
  },

  'client.license_status': {
    key: 'client.license_status',
    label: 'License Status',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'driver_information',
    section: 'applicant',
    order: 32,
    options: [
      { value: 'Valid', label: 'Valid' },
      { value: 'Permit', label: 'Permit' },
      { value: 'Suspended', label: 'Suspended' },
      { value: 'Revoked', label: 'Revoked' },
      { value: 'Expired', label: 'Expired' }
    ]
  },

  'client.age_first_licensed': {
    key: 'client.age_first_licensed',
    label: 'Age First Licensed',
    inputType: 'number',
    displayCasing: 'none',
    group: 'driver_information',
    section: 'applicant',
    order: 33,
    validations: [
      { type: 'min', value: 14, message: 'Age must be at least 14' },
      { type: 'max', value: 99, message: 'Age cannot exceed 99' }
    ]
  },

  'client.driver_status': {
    key: 'client.driver_status',
    label: 'Driver Status',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'driver_information',
    section: 'applicant',
    order: 34,
    options: [
      { value: 'Additional', label: 'Additional' },
      { value: 'Excluded', label: 'Excluded' },
      { value: 'Listed', label: 'Listed' }
    ]
  },

  'client.is_good_driver': {
    key: 'client.is_good_driver',
    label: 'Is Good Driver',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'driver_information',
    section: 'applicant',
    order: 35,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  },

  'client.driver_training': {
    key: 'client.driver_training',
    label: 'Driver Training',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'driver_information',
    section: 'applicant',
    order: 36,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  },

  'client.driver_training_date': {
    key: 'client.driver_training_date',
    label: 'Driver Training Date',
    inputType: 'date',
    displayCasing: 'none',
    group: 'driver_information',
    section: 'applicant',
    order: 37,
    conditional: {
      dependsOn: 'client.driver_training',
      when: 'equals',
      value: 'Yes'
    }
  },

  'client.defensive_driver_course': {
    key: 'client.defensive_driver_course',
    label: 'Defensive Driver Course',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'driver_information',
    section: 'applicant',
    order: 38,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  },

  'client.defensive_driver_course_date': {
    key: 'client.defensive_driver_course_date',
    label: 'Defensive Driver Course Date',
    inputType: 'date',
    displayCasing: 'none',
    group: 'driver_information',
    section: 'applicant',
    order: 39,
    conditional: {
      dependsOn: 'client.defensive_driver_course',
      when: 'equals',
      value: 'Yes'
    }
  },

  'client.completed_mature_driver_course': {
    key: 'client.completed_mature_driver_course',
    label: 'Completed Mature Driver Course',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'driver_information',
    section: 'applicant',
    order: 40,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  },

  'client.requires_sr22': {
    key: 'client.requires_sr22',
    label: 'Requires SR22',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'driver_information',
    section: 'applicant',
    order: 41,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  },

  // SPECIAL CIRCUMSTANCES FIELDS
  'client.is_military': {
    key: 'client.is_military',
    label: 'Is Military',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'special_circumstances',
    section: 'applicant',
    order: 42,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  },

  'client.is_student_over_100_miles': {
    key: 'client.is_student_over_100_miles',
    label: 'Has Student Living Over 100 Miles Away',
    description: 'Does applicant have student living more than 100 miles from home?',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'special_circumstances',
    section: 'applicant',
    order: 43,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  },

  'client.is_fulltime_student_good_grades': {
    key: 'client.is_fulltime_student_good_grades',
    label: 'Full-Time Student with Good Grades',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'special_circumstances',
    section: 'applicant',
    order: 44,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  },

  'client.has_major_credit_card': {
    key: 'client.has_major_credit_card',
    label: 'Has Major Credit Card',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'special_circumstances',
    section: 'applicant',
    order: 45,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  },

  // INTERNAL INFORMATION FIELDS
  'client.client_type': {
    key: 'client.client_type',
    label: 'Client Type',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'internal_information',
    section: 'applicant',
    order: 46,
    placeholder: 'e.g., Active, Prospect, etc.'
  },

  'client.producer': {
    key: 'client.producer',
    label: 'Producer',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'internal_information',
    section: 'applicant',
    order: 47,
    placeholder: 'Producer name'
  },

  'client.client_since': {
    key: 'client.client_since',
    label: 'Client Since',
    inputType: 'date',
    displayCasing: 'none',
    group: 'internal_information',
    section: 'applicant',
    order: 48
  },

  'client.csr': {
    key: 'client.csr',
    label: 'CSR',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'internal_information',
    section: 'applicant',
    order: 49,
    placeholder: 'Customer service representative'
  },

  // HOUSEHOLD MEMBER TEMPLATE FIELDS
  'client.household_members[*].first_name': {
    key: 'client.household_members[*].first_name',
    label: 'First Name',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'household_member_template',
    section: 'applicant',
    order: 1,
    required: true,
    validations: [
      { type: 'required', message: 'First name is required' },
      { type: 'minLength', value: 1, message: 'First name cannot be empty' }
    ]
  },

  'client.household_members[*].middle_name': {
    key: 'client.household_members[*].middle_name',
    label: 'Middle Name',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'household_member_template',
    section: 'applicant',
    order: 2
  },

  'client.household_members[*].last_name': {
    key: 'client.household_members[*].last_name',
    label: 'Last Name',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'household_member_template',
    section: 'applicant',
    order: 3,
    required: true,
    validations: [
      { type: 'required', message: 'Last name is required' }
    ]
  },

  'client.household_members[*].suffix': {
    key: 'client.household_members[*].suffix',
    label: 'Suffix',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'household_member_template',
    section: 'applicant',
    order: 4,
    options: [
      { value: 'Jr', label: 'Jr' },
      { value: 'Sr', label: 'Sr' },
      { value: 'I', label: 'I' },
      { value: 'II', label: 'II' },
      { value: 'III', label: 'III' },
      { value: 'IV', label: 'IV' }
    ]
  },

  'client.household_members[*].relationship_to_applicant': {
    key: 'client.household_members[*].relationship_to_applicant',
    label: 'Relationship to Primary Applicant',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'household_member_template',
    section: 'applicant',
    order: 5,
    required: true,
    options: [
      { value: 'Spouse', label: 'Spouse' },
      { value: 'Child', label: 'Child' },
      { value: 'Parent', label: 'Parent' },
      { value: 'Sibling', label: 'Sibling' },
      { value: 'Other', label: 'Other Relative' }
    ],
    validations: [
      { type: 'required', message: 'Relationship is required' }
    ]
  },

  'client.household_members[*].dob': {
    key: 'client.household_members[*].dob',
    label: 'Date of Birth',
    inputType: 'date',
    displayCasing: 'none',
    group: 'household_member_template',
    section: 'applicant',
    order: 6,
    required: true,
    validations: [
      { type: 'required', message: 'Date of birth is required' }
    ]
  },

  'client.household_members[*].gender': {
    key: 'client.household_members[*].gender',
    label: 'Gender',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'household_member_template',
    section: 'applicant',
    order: 7,
    options: [
      { value: 'Male', label: 'Male' },
      { value: 'Female', label: 'Female' }
    ]
  },

  'client.household_members[*].marital_status': {
    key: 'client.household_members[*].marital_status',
    label: 'Marital Status',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'household_member_template',
    section: 'applicant',
    order: 8,
    options: [
      { value: 'Domestic Partner', label: 'Domestic Partner' },
      { value: 'Divorced', label: 'Divorced' },
      { value: 'Married', label: 'Married' },
      { value: 'Separated', label: 'Separated' },
      { value: 'Single', label: 'Single' },
      { value: 'Unknown', label: 'Unknown' },
      { value: 'Widowed', label: 'Widowed' }
    ]
  },

  'client.household_members[*].email': {
    key: 'client.household_members[*].email',
    label: 'Email Address',
    inputType: 'email',
    displayCasing: 'lower',
    inputCasing: 'lower',
    group: 'household_member_template',
    section: 'applicant',
    order: 9,
    validations: [
      { type: 'email', message: 'Please enter a valid email address' }
    ]
  },

  'client.household_members[*].mobile_phone': {
    key: 'client.household_members[*].mobile_phone',
    label: 'Phone Number',
    inputType: 'phone',
    displayCasing: 'none',
    group: 'household_member_template',
    section: 'applicant',
    order: 10,
    placeholder: '(555) 123-4567',
    validations: [
      { type: 'phone', message: 'Please enter a valid phone number' }
    ]
  },

  'client.household_members[*].education': {
    key: 'client.household_members[*].education',
    label: 'Education Level',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'household_member_template',
    section: 'applicant',
    order: 11,
    options: [
      { value: 'Associates', label: "Associate's" },
      { value: 'Bachelors', label: "Bachelor's" },
      { value: 'High School', label: 'High school or equivalent' },
      { value: 'JD/LLD', label: 'JD/LLD' },
      { value: 'Less than High School', label: 'Less than high school' },
      { value: 'Masters', label: 'Masters' },
      { value: 'MD', label: 'MD' },
      { value: 'PhD', label: 'PhD' },
      { value: 'Some College', label: 'Some college' },
      { value: 'Vocational', label: 'Vocational' }
    ]
  },

  'client.household_members[*].occupation_role': {
    key: 'client.household_members[*].occupation_role',
    label: 'Occupation',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'household_member_template',
    section: 'applicant',
    order: 12,
    placeholder: 'e.g., Software Engineer, Teacher, Manager'
  },

  'client.household_members[*].occupation_industry': {
    key: 'client.household_members[*].occupation_industry',
    label: 'Industry',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'household_member_template',
    section: 'applicant',
    order: 13,
    placeholder: 'e.g., Technology, Healthcare, Finance'
  },

  'client.household_members[*].years_with_current_employer': {
    key: 'client.household_members[*].years_with_current_employer',
    label: 'Years with Current Employer',
    inputType: 'number',
    displayCasing: 'none',
    group: 'household_member_template',
    section: 'applicant',
    order: 14,
    validations: [
      { type: 'min', value: 0, message: 'Years cannot be negative' },
      { type: 'max', value: 60, message: 'Years cannot exceed 60' }
    ]
  },

  'client.household_members[*].is_driver': {
    key: 'client.household_members[*].is_driver',
    label: 'Is Driver',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'household_member_template',
    section: 'applicant',
    order: 15,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  },

  'client.household_members[*].is_co_applicant': {
    key: 'client.household_members[*].is_co_applicant',
    label: 'Is Co-Applicant',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'household_member_template',
    section: 'applicant',
    order: 16,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  },

  'client.household_members[*].lives_in_household': {
    key: 'client.household_members[*].lives_in_household',
    label: 'Lives in Household',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'household_member_template',
    section: 'applicant',
    order: 17,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  },

  'client.household_members[*].license_number': {
    key: 'client.household_members[*].license_number',
    label: 'License Number',
    inputType: 'license',
    displayCasing: 'upper',
    inputCasing: 'upper',
    group: 'household_member_template',
    section: 'applicant',
    order: 18,
    placeholder: 'Enter driver license number'
  },

  'client.household_members[*].license_state': {
    key: 'client.household_members[*].license_state',
    label: 'License State',
    description: 'State where driver license was issued',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'household_member_template',
    section: 'applicant',
    order: 19,
    options: US_STATE_OPTIONS
  },

  'client.household_members[*].license_status': {
    key: 'client.household_members[*].license_status',
    label: 'License Status',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'household_member_template',
    section: 'applicant',
    order: 20,
    options: [
      { value: 'Valid', label: 'Valid' },
      { value: 'Permit', label: 'Permit' },
      { value: 'Suspended', label: 'Suspended' },
      { value: 'Revoked', label: 'Revoked' },
      { value: 'Expired', label: 'Expired' }
    ]
  },

  'client.household_members[*].age_first_licensed': {
    key: 'client.household_members[*].age_first_licensed',
    label: 'Age First Licensed',
    inputType: 'number',
    displayCasing: 'none',
    group: 'household_member_template',
    section: 'applicant',
    order: 21,
    validations: [
      { type: 'min', value: 14, message: 'Age must be at least 14' },
      { type: 'max', value: 99, message: 'Age cannot exceed 99' }
    ]
  },

  'client.household_members[*].driver_status': {
    key: 'client.household_members[*].driver_status',
    label: 'Driver Status',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'household_member_template',
    section: 'applicant',
    order: 22,
    options: [
      { value: 'Additional', label: 'Additional' },
      { value: 'Excluded', label: 'Excluded' },
      { value: 'Listed', label: 'Listed' }
    ]
  },

  'client.household_members[*].is_good_driver': {
    key: 'client.household_members[*].is_good_driver',
    label: 'Is Good Driver',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'household_member_template',
    section: 'applicant',
    order: 23,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  },

  'client.household_members[*].driver_training': {
    key: 'client.household_members[*].driver_training',
    label: 'Driver Training',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'household_member_template',
    section: 'applicant',
    order: 24,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  },

  'client.household_members[*].driver_training_date': {
    key: 'client.household_members[*].driver_training_date',
    label: 'Driver Training Date',
    inputType: 'date',
    displayCasing: 'none',
    group: 'household_member_template',
    section: 'applicant',
    order: 25,
    conditional: {
      dependsOn: 'client.household_members[*].driver_training',
      when: 'equals',
      value: 'Yes'
    }
  },

  'client.household_members[*].defensive_driver_course': {
    key: 'client.household_members[*].defensive_driver_course',
    label: 'Defensive Driver Course',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'household_member_template',
    section: 'applicant',
    order: 26,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  },

  'client.household_members[*].defensive_driver_course_date': {
    key: 'client.household_members[*].defensive_driver_course_date',
    label: 'Defensive Driver Course Date',
    inputType: 'date',
    displayCasing: 'none',
    group: 'household_member_template',
    section: 'applicant',
    order: 27,
    conditional: {
      dependsOn: 'client.household_members[*].defensive_driver_course',
      when: 'equals',
      value: 'Yes'
    }
  },

  'client.household_members[*].completed_mature_driver_course': {
    key: 'client.household_members[*].completed_mature_driver_course',
    label: 'Completed Mature Driver Course',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'household_member_template',
    section: 'applicant',
    order: 28,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  },

  'client.household_members[*].requires_sr22': {
    key: 'client.household_members[*].requires_sr22',
    label: 'Requires SR22',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'household_member_template',
    section: 'applicant',
    order: 29,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  },

  'client.household_members[*].is_military': {
    key: 'client.household_members[*].is_military',
    label: 'Is Military',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'household_member_template',
    section: 'applicant',
    order: 30,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  },

  'client.household_members[*].is_student_over_100_miles': {
    key: 'client.household_members[*].is_student_over_100_miles',
    label: 'Student Living Over 100 Miles Away',
    description: 'Is this person a student living more than 100 miles from home?',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'household_member_template',
    section: 'applicant',
    order: 31,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  },

  'client.household_members[*].is_fulltime_student_good_grades': {
    key: 'client.household_members[*].is_fulltime_student_good_grades',
    label: 'Full-Time Student with Good Grades',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'household_member_template',
    section: 'applicant',
    order: 32,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  },

  'client.household_members[*].has_major_credit_card': {
    key: 'client.household_members[*].has_major_credit_card',
    label: 'Has Major Credit Card',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'household_member_template',
    section: 'applicant',
    order: 33,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  },

  // HOME - GENERAL INFORMATION
  'home.year_built': {
    key: 'home.year_built',
    label: 'Year Built',
    inputType: 'number',
    displayCasing: 'none',
    group: 'general_property',
    section: 'home',
    order: 1,
    validations: [
      { type: 'min', value: 1800, message: 'Year must be 1800 or later' },
      { type: 'max', value: new Date().getFullYear() + 1, message: 'Year cannot be in the future' }
    ]
  },

  'home.property_square_footage': {
    key: 'home.property_square_footage',
    label: 'Square Footage',
    inputType: 'number',
    displayCasing: 'none',
    suffix: ' sq ft',
    group: 'general_property',
    section: 'home',
    order: 2,
    validations: [
      { type: 'min', value: 500, message: 'Minimum square footage is 500' },
      { type: 'max', value: 50000, message: 'Maximum square footage is 50,000' }
    ]
  },

  'home.dwelling_type': {
    key: 'home.dwelling_type',
    label: 'Dwelling Type',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'general_property',
    section: 'home',
    order: 3,
    options: [
      { value: 'One Family', label: 'One Family' },
      { value: 'Two Family', label: 'Two Family' },
      { value: 'Three Family', label: 'Three Family' },
      { value: 'Four Family', label: 'Four Family' },
      { value: 'Multi-Family', label: 'Multi-Family' }
    ]
  },

  'home.dwelling_style': {
    key: 'home.dwelling_style',
    label: 'Dwelling Style',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'general_property',
    section: 'home',
    order: 4,
    options: [
      { value: 'Apartment', label: 'Apartment' },
      { value: 'Back Split', label: 'Back Split' },
      { value: 'Bi-Level', label: 'Bi-Level' },
      { value: 'Bungalow', label: 'Bungalow' },
      { value: 'Cape Cod', label: 'Cape Cod' },
      { value: 'Colonial', label: 'Colonial' },
      { value: 'Contemporary', label: 'Contemporary' },
      { value: 'Cottage', label: 'Cottage' },
      { value: 'Federal', label: 'Federal' },
      { value: 'Mediterranean', label: 'Mediterranean' },
      { value: 'Ornate', label: 'Ornate' },
      { value: 'Victorian', label: 'Victorian' },
      { value: 'Queen Anne', label: 'Queen Anne' },
      { value: 'Raised Ranch', label: 'Raised Ranch' },
      { value: 'Rambler', label: 'Rambler' },
      { value: 'Ranch', label: 'Ranch' },
      { value: 'Row House Center', label: 'Row House Center' },
      { value: 'Row House End', label: 'Row House End' },
      { value: 'Southwest', label: 'Southwest' },
      { value: 'Adobe', label: 'Adobe' },
      { value: 'Split Foyer', label: 'Split Foyer' },
      { value: 'Split Level', label: 'Split Level' },
      { value: 'Substandard', label: 'Substandard' },
      { value: 'Townhouse', label: 'Townhouse' },
      { value: 'Townhouse Center', label: 'Townhouse Center' }
    ]
  },

  'home.dwelling_usage': {
    key: 'home.dwelling_usage',
    label: 'Dwelling Usage',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'general_property',
    section: 'home',
    order: 5,
    options: [
      { value: 'Primary', label: 'Primary' },
      { value: 'Secondary', label: 'Secondary' },
      { value: 'Seasonal', label: 'Seasonal' },
      { value: 'Farm', label: 'Farm' },
      { value: 'Other', label: 'Other' },
      { value: 'Vacant', label: 'Vacant' }
    ]
  },

  'home.number_of_stories': {
    key: 'home.number_of_stories',
    label: 'Number of Stories',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'general_property',
    section: 'home',
    order: 6,
    options: [
      { value: '1', label: '1' },
      { value: '1.5', label: '1.5' },
      { value: '2', label: '2' },
      { value: '2.5', label: '2.5' },
      { value: '3', label: '3' },
      { value: '4', label: '4' },
      { value: 'Bi-Level', label: 'Bi-Level' },
      { value: 'Tri-Level', label: 'Tri-Level' }
    ]
  },

  'home.number_of_rooms': {
    key: 'home.number_of_rooms',
    label: 'Total Number of Rooms',
    inputType: 'number',
    displayCasing: 'none',
    group: 'general_property',
    section: 'home',
    order: 7,
    validations: [
      { type: 'min', value: 1, message: 'Must have at least 1 room' },
      { type: 'max', value: 50, message: 'Maximum 50 rooms' }
    ]
  },

  'home.number_of_occupants': {
    key: 'home.number_of_occupants',
    label: 'Number of Occupants',
    inputType: 'number',
    displayCasing: 'none',
    group: 'general_property',
    section: 'home',
    order: 8,
    validations: [
      { type: 'min', value: 0, message: 'Cannot be negative' },
      { type: 'max', value: 20, message: 'Maximum 20 occupants' }
    ]
  },

  'home.purchase_date': {
    key: 'home.purchase_date',
    label: 'Purchase Date',
    inputType: 'date',
    displayCasing: 'none',
    group: 'general_property',
    section: 'home',
    order: 9
  },

  'home.purchase_price': {
    key: 'home.purchase_price',
    label: 'Purchase Price',
    inputType: 'currency',
    displayCasing: 'none',
    prefix: '$',
    group: 'general_property',
    section: 'home',
    order: 10,
    validations: [
      { type: 'min', value: 1000, message: 'Minimum purchase price is $1,000' }
    ]
  },

  'home.estimated_market_value': {
    key: 'home.estimated_market_value',
    label: 'Estimated Market Value',
    inputType: 'currency',
    displayCasing: 'none',
    prefix: '$',
    group: 'general_property',
    section: 'home',
    order: 11,
    validations: [
      { type: 'min', value: 1000, message: 'Minimum market value is $1,000' }
    ]
  },

  'home.estimated_replacement_cost': {
    key: 'home.estimated_replacement_cost',
    label: 'Estimated Replacement Cost',
    inputType: 'currency',
    displayCasing: 'none',
    prefix: '$',
    group: 'general_property',
    section: 'home',
    order: 12,
    validations: [
      { type: 'min', value: 1000, message: 'Minimum replacement cost is $1,000' }
    ]
  },

  'home.address_line1': {
    key: 'home.address_line1',
    label: 'Property Address Line 1',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'general_property',
    section: 'home',
    order: 13,
    placeholder: '123 Main Street'
  },

  'home.address_line2': {
    key: 'home.address_line2',
    label: 'Property Address Line 2',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'general_property',
    section: 'home',
    order: 14,
    placeholder: 'Apt, Suite, Unit (optional)'
  },

  'home.address_city': {
    key: 'home.address_city',
    label: 'Property City',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'general_property',
    section: 'home',
    order: 15
  },

  'home.address_state': {
    key: 'home.address_state',
    label: 'Property State',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'general_property',
    section: 'home',
    order: 16,
    options: US_STATE_OPTIONS
  },

  'home.address_zip': {
    key: 'home.address_zip',
    label: 'Property ZIP Code',
    inputType: 'zip',
    displayCasing: 'none',
    group: 'general_property',
    section: 'home',
    order: 17,
    placeholder: '12345',
    validations: [
      { type: 'pattern', value: '^[0-9]{5}(-[0-9]{4})?$', message: 'ZIP code must be 5 digits or 5+4 format' }
    ]
  },

  'home.address_county': {
    key: 'home.address_county',
    label: 'Property County',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'general_property',
    section: 'home',
    order: 18
  },

  'home.address_is_same_as_current': {
    key: 'home.address_is_same_as_current',
    label: 'Property Address Same as Current Address',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'general_property',
    section: 'home',
    order: 19,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  'home.is_inside_city_limits': {
    key: 'home.is_inside_city_limits',
    label: 'Inside City Limits',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'general_property',
    section: 'home',
    order: 20,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  'home.is_gated_community': {
    key: 'home.is_gated_community',
    label: 'Gated Community',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'general_property',
    section: 'home',
    order: 21,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  'home.has_24_hour_security_patrol': {
    key: 'home.has_24_hour_security_patrol',
    label: '24-Hour Security Patrol',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'general_property',
    section: 'home',
    order: 21.1,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  'home.has_24_hour_manned_security_gates': {
    key: 'home.has_24_hour_manned_security_gates',
    label: '24-Hour Manned Security Gates',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'general_property',
    section: 'home',
    order: 21.2,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  'home.is_single_entry_community': {
    key: 'home.is_single_entry_community',
    label: 'Single Entry Community',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'general_property',
    section: 'home',
    order: 21.3,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  'home.has_passkey_gates': {
    key: 'home.has_passkey_gates',
    label: 'Passkey Gates',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'general_property',
    section: 'home',
    order: 21.4,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  'home.is_under_construction': {
    key: 'home.is_under_construction',
    label: 'Under Construction',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'general_property',
    section: 'home',
    order: 22,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  'home.policy_type': {
    key: 'home.policy_type',
    label: 'Policy Type',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'general_property',
    section: 'home',
    order: 23,
    options: [
      { value: 'Homeowners', label: 'Homeowners' },
      { value: 'Dwelling Fire', label: 'Dwelling Fire' },
      { value: 'Condo', label: 'Condo' },
      { value: 'Renters', label: 'Renters' },
      { value: 'Mobile Home', label: 'Mobile Home' },
      { value: 'Vacant', label: 'Vacant' }
    ]
  },

  'home.number_of_families': {
    key: 'home.number_of_families',
    label: 'Number of Families',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'general_property',
    section: 'home',
    order: 24,
    options: [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4' },
      { value: '5+', label: '5+' }
    ]
  },

  'home.territory_code': {
    key: 'home.territory_code',
    label: 'Territory Code',
    inputType: 'text',
    displayCasing: 'upper',
    inputCasing: 'upper',
    group: 'general_property',
    section: 'home',
    order: 25,
    placeholder: 'Enter territory code',
    validations: [
      { type: 'pattern', value: '^[A-Z0-9]{1,10}$', message: 'Territory code must be alphanumeric' }
    ]
  },

  'home.is_new_construction_under_30_days': {
    key: 'home.is_new_construction_under_30_days',
    label: 'New Construction Under 30 Days',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'general_property',
    section: 'home',
    order: 26,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  // HOME - EXTERIOR
  'home.roofing_renovation_type': {
    key: 'home.roofing_renovation_type',
    label: 'Roofing Update',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'exterior',
    section: 'home',
    order: 1,
    options: [
      { value: 'Complete', label: 'Complete' },
      { value: 'Partial', label: 'Partial' },
      { value: 'None', label: 'None' }
    ]
  },

  'home.roofing_update_year': {
    key: 'home.roofing_update_year',
    label: 'Roofing Update Year',
    inputType: 'number',
    displayCasing: 'none',
    group: 'exterior',
    section: 'home',
    order: 2,
    validations: [
      { type: 'min', value: 1900, message: 'Year must be 1900 or later' },
      { type: 'max', value: new Date().getFullYear(), message: 'Year cannot be in the future' }
    ]
  },

  'home.roof_material': {
    key: 'home.roof_material',
    label: 'Roof Material',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'exterior',
    section: 'home',
    order: 3,
    options: [
      { value: 'Architectural Shingles', label: 'Architectural Shingles' },
      { value: 'Asbestos', label: 'Asbestos' },
      { value: 'Asphalt Shingles', label: 'Asphalt Shingles' },
      { value: 'Composition', label: 'Composition' },
      { value: 'Copper (Flat)', label: 'Copper (Flat)' },
      { value: 'Copper (Pitched)', label: 'Copper (Pitched)' },
      { value: 'Corrugated Steel (Flat)', label: 'Corrugated Steel (Flat)' },
      { value: 'Corrugated Steel (Pitched)', label: 'Corrugated Steel (Pitched)' },
      { value: 'Fiberglass', label: 'Fiberglass' },
      { value: 'Foam', label: 'Foam' },
      { value: 'Metal (Flat)', label: 'Metal (Flat)' },
      { value: 'Metal (Pitched)', label: 'Metal (Pitched)' },
      { value: 'Mineral Fiber Shake', label: 'Mineral Fiber Shake' },
      { value: 'Other', label: 'Other' },
      { value: 'Plastic (Flat)', label: 'Plastic (Flat)' },
      { value: 'Plastic (Pitched)', label: 'Plastic (Pitched)' },
      { value: 'Rolled Paper (Flat)', label: 'Rolled Paper (Flat)' },
      { value: 'Rolled Paper (Pitched)', label: 'Rolled Paper (Pitched)' },
      { value: 'Rubber (Flat)', label: 'Rubber (Flat)' },
      { value: 'Rubber (Pitched)', label: 'Rubber (Pitched)' },
      { value: 'Slate', label: 'Slate' },
      { value: 'Tar', label: 'Tar' },
      { value: 'Tar & Gravel', label: 'Tar & Gravel' },
      { value: 'Tile (Clay)', label: 'Tile (Clay)' },
      { value: 'Tile (Concrete)', label: 'Tile (Concrete)' },
      { value: 'Tile (Spanish)', label: 'Tile (Spanish)' },
      { value: 'Tin (Flat)', label: 'Tin (Flat)' },
      { value: 'Tin (Pitched)', label: 'Tin (Pitched)' },
      { value: 'Wood Fiberglass Shingles', label: 'Wood Fiberglass Shingles' },
      { value: 'Wood Shake', label: 'Wood Shake' },
      { value: 'Wood Shingles', label: 'Wood Shingles' }
    ]
  },

  'home.roof_shape': {
    key: 'home.roof_shape',
    label: 'Roof Shape',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'exterior',
    section: 'home',
    order: 4,
    options: [
      { value: 'Flat', label: 'Flat' },
      { value: 'Gable', label: 'Gable' },
      { value: 'Gambrel', label: 'Gambrel' },
      { value: 'Hip', label: 'Hip' },
      { value: 'Mansard', label: 'Mansard' },
      { value: 'Other', label: 'Other' }
    ]
  },

  'home.roof_pitch_type': {
    key: 'home.roof_pitch_type',
    label: 'Roof Pitch Type',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'exterior',
    section: 'home',
    order: 5,
    options: [
      { value: 'Flat', label: 'Flat' },
      { value: 'Moderate', label: 'Moderate' },
      { value: 'Slight', label: 'Slight' },
      { value: 'Steep', label: 'Steep' }
    ]
  },

  'home.secondary_roof_type': {
    key: 'home.secondary_roof_type',
    label: 'Secondary Roof Material',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'exterior',
    section: 'home',
    order: 5.1,
    options: [
      { value: 'None', label: 'None' },
      { value: 'Architectural Shingles', label: 'Architectural Shingles' },
      { value: 'Asbestos', label: 'Asbestos' },
      { value: 'Asphalt Shingles', label: 'Asphalt Shingles' },
      { value: 'Composition', label: 'Composition' },
      { value: 'Copper (Flat)', label: 'Copper (Flat)' },
      { value: 'Copper (Pitched)', label: 'Copper (Pitched)' },
      { value: 'Corrugated Steel (Flat)', label: 'Corrugated Steel (Flat)' },
      { value: 'Corrugated Steel (Pitched)', label: 'Corrugated Steel (Pitched)' },
      { value: 'Fiberglass', label: 'Fiberglass' },
      { value: 'Foam', label: 'Foam' },
      { value: 'Metal (Flat)', label: 'Metal (Flat)' },
      { value: 'Metal (Pitched)', label: 'Metal (Pitched)' },
      { value: 'Mineral Fiber Shake', label: 'Mineral Fiber Shake' },
      { value: 'Other', label: 'Other' },
      { value: 'Plastic (Flat)', label: 'Plastic (Flat)' },
      { value: 'Plastic (Pitched)', label: 'Plastic (Pitched)' },
      { value: 'Rolled Paper (Flat)', label: 'Rolled Paper (Flat)' },
      { value: 'Rolled Paper (Pitched)', label: 'Rolled Paper (Pitched)' },
      { value: 'Rubber (Flat)', label: 'Rubber (Flat)' },
      { value: 'Rubber (Pitched)', label: 'Rubber (Pitched)' },
      { value: 'Slate', label: 'Slate' },
      { value: 'Tar', label: 'Tar' },
      { value: 'Tar & Gravel', label: 'Tar & Gravel' },
      { value: 'Tile (Clay)', label: 'Tile (Clay)' },
      { value: 'Tile (Concrete)', label: 'Tile (Concrete)' },
      { value: 'Tile (Spanish)', label: 'Tile (Spanish)' },
      { value: 'Tin (Flat)', label: 'Tin (Flat)' },
      { value: 'Tin (Pitched)', label: 'Tin (Pitched)' },
      { value: 'Wood Fiberglass Shingles', label: 'Wood Fiberglass Shingles' },
      { value: 'Wood Shake', label: 'Wood Shake' },
      { value: 'Wood Shingles', label: 'Wood Shingles' }
    ]
  },

  'home.secondary_roof_year_updated': {
    key: 'home.secondary_roof_year_updated',
    label: 'Secondary Roof Year Updated',
    inputType: 'number',
    displayCasing: 'none',
    group: 'exterior',
    section: 'home',
    order: 5.2,
    validations: [
      { type: 'min', value: 1900, message: 'Year must be 1900 or later' },
      { type: 'max', value: new Date().getFullYear(), message: 'Year cannot be in the future' }
    ],
    conditional: {
      dependsOn: 'home.secondary_roof_type',
      when: 'not_equals',
      value: 'None'
    }
  },

  'home.has_roof_mounted_solar_panels': {
    key: 'home.has_roof_mounted_solar_panels',
    label: 'Roof Mounted Solar Panels',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'exterior',
    section: 'home',
    order: 5.3,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  'home.solar_energy_used': {
    key: 'home.solar_energy_used',
    label: 'Solar Energy Used for Home',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'exterior',
    section: 'home',
    order: 5.4,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  'home.construction_type': {
    key: 'home.construction_type',
    label: 'Construction Type',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'exterior',
    section: 'home',
    order: 6,
    options: [
      { value: 'Concrete', label: 'Concrete' },
      { value: 'Fire-Resistive', label: 'Fire-Resistive' },
      { value: 'Frame', label: 'Frame' },
      { value: 'Log', label: 'Log' },
      { value: 'Masonry', label: 'Masonry' },
      { value: 'Mobile/Manufactured', label: 'Mobile/Manufactured' },
      { value: 'Modular', label: 'Modular' },
      { value: 'Other', label: 'Other' },
      { value: 'Steel', label: 'Steel' }
    ]
  },

  'home.construction_method': {
    key: 'home.construction_method',
    label: 'Construction Method',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'exterior',
    section: 'home',
    order: 7,
    options: [
      { value: 'Manufactured/Modular', label: 'Manufactured/Modular' },
      { value: 'Mobile', label: 'Mobile' },
      { value: 'Site Built', label: 'Site Built' },
      { value: 'Unknown', label: 'Unknown' }
    ]
  },

  'home.exterior_walls_material': {
    key: 'home.exterior_walls_material',
    label: 'Exterior Wall Material',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'exterior',
    section: 'home',
    order: 8,
    options: [
      { value: 'Adobe', label: 'Adobe' },
      { value: 'Brick', label: 'Brick' },
      { value: 'Brick on Block', label: 'Brick on Block' },
      { value: 'Brick on Block (Custom)', label: 'Brick on Block (Custom)' },
      { value: 'Brick Veneer', label: 'Brick Veneer' },
      { value: 'Clapboard', label: 'Clapboard' },
      { value: 'Concrete Block', label: 'Concrete Block' },
      { value: 'Exterior Insulation & Finish System (EIFS)', label: 'Exterior Insulation & Finish System (EIFS)' },
      { value: 'Frame', label: 'Frame' },
      { value: 'Hardy Board', label: 'Hardy Board' },
      { value: 'Logs', label: 'Logs' },
      { value: 'Poured Concrete', label: 'Poured Concrete' },
      { value: 'Siding (Aluminum)', label: 'Siding (Aluminum)' },
      { value: 'Siding (Hardboard)', label: 'Siding (Hardboard)' },
      { value: 'Siding (Plywood)', label: 'Siding (Plywood)' },
      { value: 'Siding (Steel)', label: 'Siding (Steel)' },
      { value: 'Siding (T-111)', label: 'Siding (T-111)' },
      { value: 'Siding (Vinyl)', label: 'Siding (Vinyl)' },
      { value: 'Siding (Wood)', label: 'Siding (Wood)' },
      { value: 'Solid Brick', label: 'Solid Brick' },
      { value: 'Solid Brick (Custom)', label: 'Solid Brick (Custom)' },
      { value: 'Solid Brownstone', label: 'Solid Brownstone' },
      { value: 'Solid Stone', label: 'Solid Stone' },
      { value: 'Solid Stone (Custom)', label: 'Solid Stone (Custom)' },
      { value: 'Stone on Block', label: 'Stone on Block' },
      { value: 'Stone on Block (Custom Stone)', label: 'Stone on Block (Custom Stone)' },
      { value: 'Stone Veneer', label: 'Stone Veneer' },
      { value: 'Stone Veneer (Custom)', label: 'Stone Veneer (Custom)' },
      { value: 'Stucco', label: 'Stucco' },
      { value: 'Stucco on Block', label: 'Stucco on Block' },
      { value: 'Stucco on Frame', label: 'Stucco on Frame' },
      { value: 'Victorian Scalloped Shakes', label: 'Victorian Scalloped Shakes' },
      { value: 'Window Wall', label: 'Window Wall' },
      { value: 'Wood Shakes', label: 'Wood Shakes' }
    ]
  },

  'home.foundation_type': {
    key: 'home.foundation_type',
    label: 'Foundation Type',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'exterior',
    section: 'home',
    order: 9,
    dependsOnStateFrom: 'home.address_state',
    stateSpecificOptions: {
      'FL': [
        { value: 'Basement', label: 'Basement' },
        { value: 'Basement - Finished', label: 'Basement - Finished' },
        { value: 'Basement - Unfinished', label: 'Basement - Unfinished' },
        { value: 'Basement - Walkout', label: 'Basement - Walkout' },
        { value: 'Closed', label: 'Closed' },
        { value: 'Crawlspace', label: 'Crawlspace' },
        { value: 'Elevated Post/Pier & Beam', label: 'Elevated Post/Pier & Beam' },
        { value: 'Hillside Foundation', label: 'Hillside Foundation' },
        { value: 'Open', label: 'Open' },
        { value: 'Other', label: 'Other' },
        { value: 'Piers', label: 'Piers' },
        { value: 'Pilings (Other)', label: 'Pilings (Other)' },
        { value: 'Pilings/Stilts', label: 'Pilings/Stilts' },
        { value: 'Slab', label: 'Slab' }
      ],
      default: [
        { value: 'Basement - Finished', label: 'Basement - Finished' },
        { value: 'Basement - Unfinished', label: 'Basement - Unfinished' },
        { value: 'Basement - Walkout', label: 'Basement - Walkout' },
        { value: 'Hillside Foundation', label: 'Hillside Foundation' },
        { value: 'Other', label: 'Other' },
        { value: 'Piers', label: 'Piers' },
        { value: 'Pilings/Stilts', label: 'Pilings/Stilts' },
        { value: 'Slab', label: 'Slab' }
      ]
    }
  },

  'home.foundation_land_type': {
    key: 'home.foundation_land_type',
    label: 'Foundation Land Type',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'exterior',
    section: 'home',
    order: 10
  },

  'home.number_of_corners': {
    key: 'home.number_of_corners',
    label: 'Number of Corners',
    inputType: 'number',
    displayCasing: 'none',
    group: 'exterior',
    section: 'home',
    order: 11,
    validations: [
      { type: 'min', value: 4, message: 'Minimum 4 corners' },
      { type: 'max', value: 50, message: 'Maximum 50 corners' }
    ]
  },

  'home.number_of_chimneys': {
    key: 'home.number_of_chimneys',
    label: 'Number of Chimneys',
    inputType: 'number',
    displayCasing: 'none',
    group: 'exterior',
    section: 'home',
    order: 12,
    validations: [
      { type: 'min', value: 0, message: 'Cannot be negative' },
      { type: 'max', value: 10, message: 'Maximum 10 chimneys' }
    ]
  },

  'home.porch_type': {
    key: 'home.porch_type',
    label: 'Porch Type',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'exterior',
    section: 'home',
    order: 13,
    options: [
      { value: 'Enclosed Breezeways', label: 'Enclosed Breezeways' },
      { value: 'Enclosed Porch', label: 'Enclosed Porch' },
      { value: 'Open Breezeways', label: 'Open Breezeways' },
      { value: 'Open Porch', label: 'Open Porch' },
      { value: 'Redwood Deck', label: 'Redwood Deck' },
      { value: 'Screened Breezeways', label: 'Screened Breezeways' },
      { value: 'Screened Porch', label: 'Screened Porch' },
      { value: 'Wood Deck', label: 'Wood Deck' }
    ]
  },

  'home.porch_square_footage': {
    key: 'home.porch_square_footage',
    label: 'Porch Square Footage',
    inputType: 'number',
    displayCasing: 'none',
    suffix: ' sq ft',
    group: 'exterior',
    section: 'home',
    order: 14,
    validations: [
      { type: 'min', value: 0, message: 'Cannot be negative' },
      { type: 'max', value: 5000, message: 'Maximum 5,000 sq ft' }
    ]
  },

  'home.garage_type': {
    key: 'home.garage_type',
    label: 'Garage Type',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'exterior',
    section: 'home',
    order: 15,
    options: [
      { value: 'None', label: 'None' },
      { value: 'Carport', label: 'Carport' },
      { value: 'Garage (Basement)', label: 'Garage (Basement)' },
      { value: 'Garage (Built-In)', label: 'Garage (Built-In)' }
    ]
  },

  'home.garage_capacity': {
    key: 'home.garage_capacity',
    label: 'Garage Capacity',
    inputType: 'number',
    displayCasing: 'none',
    suffix: ' cars',
    group: 'exterior',
    section: 'home',
    order: 16,
    validations: [
      { type: 'min', value: 0, message: 'Cannot be negative' },
      { type: 'max', value: 10, message: 'Maximum 10 cars' }
    ]
  },

  'home.garage_area': {
    key: 'home.garage_area',
    label: 'Garage Area',
    inputType: 'number',
    displayCasing: 'none',
    suffix: ' sq ft',
    group: 'exterior',
    section: 'home',
    order: 17,
    validations: [
      { type: 'min', value: 0, message: 'Cannot be negative' },
      { type: 'max', value: 5000, message: 'Maximum 5,000 sq ft' }
    ]
  },

  'home.has_detached_structures': {
    key: 'home.has_detached_structures',
    label: 'Has Detached Structures',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'exterior',
    section: 'home',
    order: 18,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  'home.detached_structure_type': {
    key: 'home.detached_structure_type',
    label: 'Detached Structure Type',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'exterior',
    section: 'home',
    order: 19,
    options: [
      { value: 'Detached Structures - Non-garages', label: 'Detached Structures - Non-garages' },
      { value: 'Detached Structures - Garages', label: 'Detached Structures - Garages' }
    ],
    conditional: {
      dependsOn: 'home.has_detached_structures',
      when: 'equals',
      value: 'true'
    }
  },

  // HOME - INTERIOR
  'home.home_quality': {
    key: 'home.home_quality',
    label: 'Home Quality',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'interior',
    section: 'home',
    order: 1,
    options: [
      { value: 'Basic', label: 'Basic' },
      { value: 'Builder\'s Grade', label: 'Builder\'s Grade' },
      { value: 'Custom', label: 'Custom' },
      { value: 'Designer', label: 'Designer' },
      { value: 'Semi-custom', label: 'Semi-custom' }
    ]
  },

  'home.kitchen_type': {
    key: 'home.kitchen_type',
    label: 'Kitchen Type',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'interior',
    section: 'home',
    order: 2,
    options: [
      { value: 'Basic', label: 'Basic' },
      { value: 'Builder\'s Grade', label: 'Builder\'s Grade' },
      { value: 'Custom', label: 'Custom' },
      { value: 'Designer', label: 'Designer' },
      { value: 'Semi-custom', label: 'Semi-custom' }
    ]
  },

  'home.kitchen_count': {
    key: 'home.kitchen_count',
    label: 'Number of Kitchens',
    inputType: 'number',
    displayCasing: 'none',
    group: 'interior',
    section: 'home',
    order: 3,
    validations: [
      { type: 'min', value: 0, message: 'Cannot be negative' },
      { type: 'max', value: 10, message: 'Maximum 10 kitchens' }
    ]
  },

  'home.bathroom_type': {
    key: 'home.bathroom_type',
    label: 'Bathroom Type',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'interior',
    section: 'home',
    order: 4,
    options: [
      { value: 'Basic', label: 'Basic' },
      { value: 'Builder\'s Grade', label: 'Builder\'s Grade' },
      { value: 'Custom', label: 'Custom' },
      { value: 'Designer', label: 'Designer' },
      { value: 'Semi-custom', label: 'Semi-custom' }
    ]
  },

  'home.number_of_full_bathrooms': {
    key: 'home.number_of_full_bathrooms',
    label: 'Number of Full Bathrooms',
    inputType: 'number',
    displayCasing: 'none',
    group: 'interior',
    section: 'home',
    order: 5,
    validations: [
      { type: 'min', value: 0, message: 'Cannot be negative' },
      { type: 'max', value: 20, message: 'Maximum 20 bathrooms' }
    ]
  },

  'home.number_of_half_bathrooms': {
    key: 'home.number_of_half_bathrooms',
    label: 'Number of Half Bathrooms',
    inputType: 'number',
    displayCasing: 'none',
    group: 'interior',
    section: 'home',
    order: 6,
    validations: [
      { type: 'min', value: 0, message: 'Cannot be negative' },
      { type: 'max', value: 20, message: 'Maximum 20 bathrooms' }
    ]
  },

  'home.number_of_three_quarter_bathrooms': {
    key: 'home.number_of_three_quarter_bathrooms',
    label: 'Number of Three-Quarter Bathrooms',
    inputType: 'number',
    displayCasing: 'none',
    group: 'interior',
    section: 'home',
    order: 7,
    validations: [
      { type: 'min', value: 0, message: 'Cannot be negative' },
      { type: 'max', value: 20, message: 'Maximum 20 bathrooms' }
    ]
  },

  'home.fireplace_type': {
    key: 'home.fireplace_type',
    label: 'Fireplace Type',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'interior',
    section: 'home',
    order: 8,
    options: [
      { value: 'Zero Clearance', label: 'Zero Clearance (Pre-Fab)' }
    ]
  },

  'home.fireplace_count': {
    key: 'home.fireplace_count',
    label: 'Number of Fireplaces',
    inputType: 'number',
    displayCasing: 'none',
    group: 'interior',
    section: 'home',
    order: 9,
    validations: [
      { type: 'min', value: 0, message: 'Cannot be negative' },
      { type: 'max', value: 10, message: 'Maximum 10 fireplaces' }
    ]
  },

  'home.basement_area': {
    key: 'home.basement_area',
    label: 'Basement Area',
    inputType: 'number',
    displayCasing: 'none',
    suffix: ' sq ft',
    group: 'interior',
    section: 'home',
    order: 10,
    validations: [
      { type: 'min', value: 0, message: 'Cannot be negative' },
      { type: 'max', value: 10000, message: 'Maximum 10,000 sq ft' }
    ]
  },

  'home.basement_finishing': {
    key: 'home.basement_finishing',
    label: 'Basement Finishing',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'interior',
    section: 'home',
    order: 11,
    options: [
      { value: 'Finished', label: 'Finished' },
      { value: 'Partially Finished', label: 'Partially Finished' },
      { value: 'Unfinished', label: 'Unfinished' }
    ]
  },

  'home.interior_wall_material': {
    key: 'home.interior_wall_material',
    label: 'Interior Wall Material',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'interior',
    section: 'home',
    order: 12,
    options: [
      { value: 'Adobe', label: 'Adobe' },
      { value: 'Block', label: 'Block' },
      { value: 'Brick & Block', label: 'Brick & Block' },
      { value: 'Drywall', label: 'Drywall' },
      { value: 'Drywall (Textured)', label: 'Drywall (Textured)' },
      { value: 'Glass Block', label: 'Glass Block' },
      { value: 'Plaster', label: 'Plaster' },
      { value: 'Plaster (Horsehair)', label: 'Plaster (Horsehair)' },
      { value: 'Plaster (Textured)', label: 'Plaster (Textured)' },
      { value: 'Plywood Only', label: 'Plywood Only' },
      { value: 'Solid Brick', label: 'Solid Brick' },
      { value: 'Solid Stone', label: 'Solid Stone' }
    ]
  },

  'home.wall_finishes': {
    key: 'home.wall_finishes',
    label: 'Wall Finish Materials',
    description: 'Materials and their percentages for wall finishes',
    inputType: 'material_percentage',
    displayCasing: 'title',
    group: 'interior',
    section: 'home',
    order: 13,
    options: [
      { value: 'Brick', label: 'Brick' },
      { value: 'Carpet', label: 'Carpet' },
      { value: 'Mirrors', label: 'Mirrors' },
      { value: 'Paint', label: 'Paint' },
      { value: 'Panelling (Knotty Pine)', label: 'Panelling (Knotty Pine)' },
      { value: 'Panelling (Sheet)', label: 'Panelling (Sheet)' },
      { value: 'Stone', label: 'Stone' },
      { value: 'Terrazzo', label: 'Terrazzo' },
      { value: 'Tile (Ceramic)', label: 'Tile (Ceramic)' },
      { value: 'Tile (Ceramic - Imported)', label: 'Tile (Ceramic - Imported)' },
      { value: 'Tile (Marble)', label: 'Tile (Marble)' },
      { value: 'Wallpaper (Foil)', label: 'Wallpaper (Foil)' },
      { value: 'Wallpaper (Grass Cloth)', label: 'Wallpaper (Grass Cloth)' },
      { value: 'Wallpaper (Vinyl)', label: 'Wallpaper (Vinyl)' }
    ]
  },

  'home.floor_finishes': {
    key: 'home.floor_finishes',
    label: 'Floor Materials',
    description: 'Materials and their percentages for floor finishes',
    inputType: 'material_percentage',
    displayCasing: 'title',
    group: 'interior',
    section: 'home',
    order: 15,
    options: [
      { value: 'Brick', label: 'Brick' },
      { value: 'Carpet (Acrylic/Nylon)', label: 'Carpet (Acrylic/Nylon)' },
      { value: 'Carpet (Wool/Berber)', label: 'Carpet (Wool/Berber)' },
      { value: 'Carpet Over Hardwood (Acrylic/Nylon)', label: 'Carpet Over Hardwood (Acrylic/Nylon)' },
      { value: 'Carpet Over Hardwood (Wool/Berber)', label: 'Carpet Over Hardwood (Wool/Berber)' },
      { value: 'Concrete (Stamped/Textured)', label: 'Concrete (Stamped/Textured)' },
      { value: 'Flagstone', label: 'Flagstone' },
      { value: 'Granite', label: 'Granite' },
      { value: 'Hardwood', label: 'Hardwood' },
      { value: 'Laminated Wood Flooring', label: 'Laminated Wood Flooring' },
      { value: 'Parquet', label: 'Parquet' },
      { value: 'Plank', label: 'Plank' },
      { value: 'Rubber', label: 'Rubber' },
      { value: 'Slate', label: 'Slate' },
      { value: 'Stone', label: 'Stone' },
      { value: 'Tile (Ceramic)', label: 'Tile (Ceramic)' },
      { value: 'Tile (Ceramic - Imported)', label: 'Tile (Ceramic - Imported)' },
      { value: 'Tile (Marble)', label: 'Tile (Marble)' },
      { value: 'Tile (Terrazzo)', label: 'Tile (Terrazzo)' },
      { value: 'Vinyl', label: 'Vinyl' }
    ]
  },

  'home.ceiling_material': {
    key: 'home.ceiling_material',
    label: 'Ceiling Material',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'interior',
    section: 'home',
    order: 16,
    options: [
      { value: 'Drywall', label: 'Drywall' },
      { value: 'Drywall (Textured)', label: 'Drywall (Textured)' },
      { value: 'Marble', label: 'Marble' },
      { value: 'Metal', label: 'Metal' },
      { value: 'Millwork', label: 'Millwork' },
      { value: 'Mirrors', label: 'Mirrors' },
      { value: 'Plaster', label: 'Plaster' },
      { value: 'Plaster (Textured)', label: 'Plaster (Textured)' },
      { value: 'Recessed Lighting', label: 'Recessed Lighting' },
      { value: 'Tile Acoustical', label: 'Tile Acoustical' },
      { value: 'Tin', label: 'Tin' },
      { value: 'Tongue & Groove', label: 'Tongue & Groove' },
      { value: 'Wood', label: 'Wood' }
    ]
  },

  'home.number_of_prefabs': {
    key: 'home.number_of_prefabs',
    label: 'Number of Prefabs',
    inputType: 'number',
    displayCasing: 'none',
    group: 'interior',
    section: 'home',
    order: 17,
    validations: [
      { type: 'min', value: 0, message: 'Cannot be negative' },
      { type: 'max', value: 50, message: 'Maximum 50 prefabs' }
    ]
  },

  'home.mobile_home_make': {
    key: 'home.mobile_home_make',
    label: 'Mobile Home Make',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'interior',
    section: 'home',
    order: 18,
    placeholder: 'e.g., Clayton, Fleetwood, Champion'
  },

  'home.mobile_home_model': {
    key: 'home.mobile_home_model',
    label: 'Mobile Home Model',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'interior',
    section: 'home',
    order: 19,
    placeholder: 'Enter mobile home model'
  },

  // HOME - UTILITIES & SYSTEMS
  'home.primary_cooling_source': {
    key: 'home.primary_cooling_source',
    label: 'Primary Cooling Source',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'utility_systems',
    section: 'home',
    order: 1,
    options: [
      { value: 'Central AC (Same Ducts)', label: 'Central AC (Same Ducts)' },
      { value: 'Central AC (Separate Ducts)', label: 'Central AC (Separate Ducts)' },
      { value: 'Evaporative Cooler', label: 'Evaporative Cooler' },
      { value: 'Wall Unit', label: 'Wall Unit' },
      { value: 'Whole House Fan', label: 'Whole House Fan' }
    ]
  },

  'home.primary_heating_source': {
    key: 'home.primary_heating_source',
    label: 'Primary Heating Source',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'utility_systems',
    section: 'home',
    order: 2,
    options: [
      { value: 'Central', label: 'Central' },
      { value: 'Electric', label: 'Electric' },
      { value: 'Fireplace', label: 'Fireplace' },
      { value: 'Gas (Forced Air)', label: 'Gas (Forced Air)' },
      { value: 'Other', label: 'Other' },
      { value: 'Solid Fuel', label: 'Solid Fuel' },
      { value: 'Wood (Non-professional Installed)', label: 'Wood (Non-professional Installed)' },
      { value: 'Wood (Professional Installed)', label: 'Wood (Professional Installed)' }
    ]
  },

  'home.secondary_heating_source': {
    key: 'home.secondary_heating_source',
    label: 'Secondary Heating Source',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'utility_systems',
    section: 'home',
    order: 3,
    options: [
      { value: 'Central', label: 'Central' },
      { value: 'Electric', label: 'Electric' },
      { value: 'Fireplace', label: 'Fireplace' },
      { value: 'Gas (Forced Air)', label: 'Gas (Forced Air)' },
      { value: 'Other', label: 'Other' },
      { value: 'Solid Fuel', label: 'Solid Fuel' },
      { value: 'Wood (Non-professional Installed)', label: 'Wood (Non-professional Installed)' },
      { value: 'Wood (Professional Installed)', label: 'Wood (Professional Installed)' }
    ]
  },

  'home.heating_renovation_type': {
    key: 'home.heating_renovation_type',
    label: 'Heating Update',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'utility_systems',
    section: 'home',
    order: 4,
    options: [
      { value: 'Complete', label: 'Complete' },
      { value: 'Partial', label: 'Partial' },
      { value: 'None', label: 'None' }
    ]
  },

  'home.heating_update_year': {
    key: 'home.heating_update_year',
    label: 'Heating Update Year',
    inputType: 'number',
    displayCasing: 'none',
    group: 'utility_systems',
    section: 'home',
    order: 5,
    validations: [
      { type: 'min', value: 1900, message: 'Year must be 1900 or later' },
      { type: 'max', value: new Date().getFullYear(), message: 'Year cannot be in the future' }
    ]
  },

  'home.plumbing_renovation_type': {
    key: 'home.plumbing_renovation_type',
    label: 'Plumbing Update',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'utility_systems',
    section: 'home',
    order: 6,
    options: [
      { value: 'Complete', label: 'Complete' },
      { value: 'Partial', label: 'Partial' },
      { value: 'None', label: 'None' }
    ]
  },

  'home.plumbing_update_year': {
    key: 'home.plumbing_update_year',
    label: 'Plumbing Update Year',
    inputType: 'number',
    displayCasing: 'none',
    group: 'utility_systems',
    section: 'home',
    order: 7,
    validations: [
      { type: 'min', value: 1900, message: 'Year must be 1900 or later' },
      { type: 'max', value: new Date().getFullYear(), message: 'Year cannot be in the future' }
    ]
  },

  'home.primary_plumbing_type': {
    key: 'home.primary_plumbing_type',
    label: 'Primary Plumbing Type',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'utility_systems',
    section: 'home',
    order: 8,
    options: [
      { value: 'Copper', label: 'Copper' },
      { value: 'PVC', label: 'PVC' },
      { value: 'CPVC', label: 'CPVC' },
      { value: 'PEX', label: 'PEX' },
      { value: 'Galvanized Steel', label: 'Galvanized Steel' },
      { value: 'Cast Iron', label: 'Cast Iron' },
      { value: 'Lead', label: 'Lead' },
      { value: 'Other', label: 'Other' }
    ]
  },

  'home.electrical_renovation_type': {
    key: 'home.electrical_renovation_type',
    label: 'Electrical Update',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'utility_systems',
    section: 'home',
    order: 9,
    options: [
      { value: 'Complete', label: 'Complete' },
      { value: 'Partial', label: 'Partial' },
      { value: 'None', label: 'None' }
    ]
  },

  'home.electrical_update_year': {
    key: 'home.electrical_update_year',
    label: 'Electrical Update Year',
    inputType: 'number',
    displayCasing: 'none',
    group: 'utility_systems',
    section: 'home',
    order: 10,
    validations: [
      { type: 'min', value: 1900, message: 'Year must be 1900 or later' },
      { type: 'max', value: new Date().getFullYear(), message: 'Year cannot be in the future' }
    ]
  },

  'home.electrical_details': {
    key: 'home.electrical_details',
    label: 'Electrical Details',
    inputType: 'text',
    displayCasing: 'sentence',
    inputCasing: 'sentence',
    group: 'utility_systems',
    section: 'home',
    order: 11,
    placeholder: 'Enter electrical system details'
  },

  'home.has_circuit_breaker': {
    key: 'home.has_circuit_breaker',
    label: 'Has Circuit Breaker',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'utility_systems',
    section: 'home',
    order: 12,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  },

  'home.has_outdated_wiring': {
    key: 'home.has_outdated_wiring',
    label: 'Has Outdated Wiring',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'utility_systems',
    section: 'home',
    order: 13,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  },

  'home.has_wood_burning_stove': {
    key: 'home.has_wood_burning_stove',
    label: 'Has Wood Burning Stove',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'utility_systems',
    section: 'home',
    order: 14,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  },

  'home.electrical_circuit_amps': {
    key: 'home.electrical_circuit_amps',
    label: 'Electrical Circuit Amps',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'utility_systems',
    section: 'home',
    order: 15,
    options: [
      { value: 'Less than 100', label: 'Less than 100' },
      { value: '100 to 149', label: '100 to 149' },
      { value: 'Above 150', label: 'Above 150' }
    ]
  },

  'home.has_edison_fuses_aluminum_or_knob_tube_wiring': {
    key: 'home.has_edison_fuses_aluminum_or_knob_tube_wiring',
    label: 'Has Edison Fuses, Aluminum, or Knob & Tube Wiring',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'utility_systems',
    section: 'home',
    order: 16,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  'home.has_hvac_maintenance_contract': {
    key: 'home.has_hvac_maintenance_contract',
    label: 'HVAC Maintenance Contract',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'utility_systems',
    section: 'home',
    order: 17,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  // HOME - SAFETY & SECURITY
  'home.has_dead_bolt': {
    key: 'home.has_dead_bolt',
    label: 'Has Dead Bolt',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'safety_security',
    section: 'home',
    order: 1,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  },

  'home.burglar_alarm_type': {
    key: 'home.burglar_alarm_type',
    label: 'Burglar Alarm Type',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'safety_security',
    section: 'home',
    order: 2,
    options: [
      { value: 'Central', label: 'Central' },
      { value: 'Direct', label: 'Direct' },
      { value: 'Local', label: 'Local' }
    ]
  },

  'home.smoke_detector_type': {
    key: 'home.smoke_detector_type',
    label: 'Smoke Detector Type',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'safety_security',
    section: 'home',
    order: 3,
    options: [
      { value: 'Central', label: 'Central' },
      { value: 'Direct', label: 'Direct' },
      { value: 'Local', label: 'Local' }
    ]
  },

  'home.fire_detector_type': {
    key: 'home.fire_detector_type',
    label: 'Fire Detector Type',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'safety_security',
    section: 'home',
    order: 4,
    options: [
      { value: 'Central', label: 'Central' },
      { value: 'Direct', label: 'Direct' },
      { value: 'Local', label: 'Local' }
    ]
  },

  'home.has_fire_extinguisher': {
    key: 'home.has_fire_extinguisher',
    label: 'Has Fire Extinguisher',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'safety_security',
    section: 'home',
    order: 5,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  },

  'home.indoor_sprinkler_system_type': {
    key: 'home.indoor_sprinkler_system_type',
    label: 'Indoor Sprinkler System Type',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'safety_security',
    section: 'home',
    order: 6,
    options: [
      { value: 'Full', label: 'Full' },
      { value: 'Partial', label: 'Partial' },
      { value: 'None', label: 'None' }
    ]
  },

  'home.fire_protection_class': {
    key: 'home.fire_protection_class',
    label: 'Fire Protection Class',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'safety_security',
    section: 'home',
    order: 7,
    options: [
      { value: 'Class 1', label: 'Class 1' },
      { value: 'Class 2', label: 'Class 2' },
      { value: 'Class 3', label: 'Class 3' },
      { value: 'Class 4', label: 'Class 4' },
      { value: 'Class 5', label: 'Class 5' },
      { value: 'Class 6', label: 'Class 6' },
      { value: 'Class 7', label: 'Class 7' },
      { value: 'Class 8', label: 'Class 8' },
      { value: 'Class 9', label: 'Class 9' },
      { value: 'Class 10', label: 'Class 10' }
    ]
  },

  'home.fire_district_name': {
    key: 'home.fire_district_name',
    label: 'Fire District Name',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'safety_security',
    section: 'home',
    order: 8,
    placeholder: 'Enter fire district name'
  },

  'home.fire_district_number': {
    key: 'home.fire_district_number',
    label: 'Fire District Number',
    inputType: 'text',
    displayCasing: 'none',
    group: 'safety_security',
    section: 'home',
    order: 9,
    placeholder: 'Enter fire district number'
  },

  'home.is_within_fire_district': {
    key: 'home.is_within_fire_district',
    label: 'Within Fire District',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'safety_security',
    section: 'home',
    order: 10,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  },

  'home.distance_to_fire_station': {
    key: 'home.distance_to_fire_station',
    label: 'Distance to Fire Station',
    inputType: 'number',
    displayCasing: 'none',
    suffix: ' miles',
    group: 'safety_security',
    section: 'home',
    order: 11,
    placeholder: 'Enter distance in miles',
    validations: [
      { type: 'min', value: 0, message: 'Distance cannot be negative' }
    ]
  },

  'home.distance_to_hydrant': {
    key: 'home.distance_to_hydrant',
    label: 'Distance to Fire Hydrant',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'safety_security',
    section: 'home',
    order: 12,
    options: [
      { value: 'None', label: 'None' },
      { value: '1 - 500 ft', label: '1 - 500 ft' },
      { value: '501 - 600 ft', label: '501 - 600 ft' },
      { value: '601 - 1,000 ft', label: '601 - 1,000 ft' },
      { value: '1,001 ft. or Greater', label: '1,001 ft. or Greater' }
    ]
  },

  'home.distance_to_tidal_water': {
    key: 'home.distance_to_tidal_water',
    label: 'Distance to Tidal Water',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'safety_security',
    section: 'home',
    order: 13,
    options: [
      { value: '0 - 0.5 Miles', label: '0 - 0.5 Miles' },
      { value: '0.5 - 1 Miles', label: '0.5 - 1 Miles' },
      { value: '1 - 2 Miles', label: '1 - 2 Miles' },
      { value: '2 - 5 Miles', label: '2 - 5 Miles' },
      { value: 'More Than 5 Miles', label: 'More Than 5 Miles' }
        ]
  },

  'home.distance_to_coast': {
    key: 'home.distance_to_coast',
    label: 'Distance to Coast',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'safety_security',
    section: 'home',
    order: 14,
    options: [
      { value: '0 - 0.25 Miles', label: '0 - 0.25 Miles' },
      { value: '0.25 - 0.5 Miles', label: '0.25 - 0.5 Miles' },
      { value: '0.5 - 1 Miles', label: '0.5 - 1 Miles' },
      { value: '1 - 2 Miles', label: '1 - 2 Miles' },
      { value: '2 - 5 Miles', label: '2 - 5 Miles' },
      { value: 'More Than 5 Miles', label: 'More Than 5 Miles' }
    ]
  },

  'home.wind_borne_debris_region': {
    key: 'home.wind_borne_debris_region',
    label: 'Wind Borne Debris Region',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'safety_security',
    section: 'home',
    order: 15,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' },
      { value: 'Unknown', label: 'Unknown' }
    ]
  },

  'home.high_velocity_hurricane_zone': {
    key: 'home.high_velocity_hurricane_zone',
    label: 'High Velocity Hurricane Zone',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'safety_security',
    section: 'home',
    order: 16,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  'home.fire_station_type': {
    key: 'home.fire_station_type',
    label: 'Fire Station Type',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'safety_security',
    section: 'home',
    order: 17,
    options: [
      { value: 'Volunteer', label: 'Volunteer' },
      { value: 'Paid', label: 'Paid' },
      { value: 'Combination', label: 'Combination' },
      { value: 'Unknown', label: 'Unknown' }
    ]
  },

  'home.responding_fire_department': {
    key: 'home.responding_fire_department',
    label: 'Responding Fire Department',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'safety_security',
    section: 'home',
    order: 18,
    placeholder: 'Enter fire department name'
  },

  // HOME - PROPERTY FEATURES & RISKS
  'home.has_swimming_pool': {
    key: 'home.has_swimming_pool',
    label: 'Has Swimming Pool',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'property_features_risks',
    section: 'home',
    order: 1,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  },

  'home.swimming_pool_type': {
    key: 'home.swimming_pool_type',
    label: 'Swimming Pool Type',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'property_features_risks',
    section: 'home',
    order: 2,
    options: [
      { value: 'Above Ground without Slide', label: 'Above Ground without Slide' },
      { value: 'Above Ground with Slide', label: 'Above Ground with Slide' },
      { value: 'Inground without Slide', label: 'Inground without Slide' },
      { value: 'Inground with Slide', label: 'Inground with Slide' }
    ],
    conditional: {
      dependsOn: 'home.has_swimming_pool',
      when: 'equals',
      value: 'Yes'
    }
  },

  'home.is_swimming_pool_fenced': {
    key: 'home.is_swimming_pool_fenced',
    label: 'Is Swimming Pool Fenced',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'property_features_risks',
    section: 'home',
    order: 3,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ],
    conditional: {
      dependsOn: 'home.has_swimming_pool',
      when: 'equals',
      value: 'Yes'
    }
  },

  'home.has_empty_swimming_pool': {
    key: 'home.has_empty_swimming_pool',
    label: 'Has Empty Swimming Pool',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'property_features_risks',
    section: 'home',
    order: 4,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  'home.has_trampoline': {
    key: 'home.has_trampoline',
    label: 'Has Trampoline',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'property_features_risks',
    section: 'home',
    order: 5,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  },

  'home.is_trampoline_fenced': {
    key: 'home.is_trampoline_fenced',
    label: 'Is Trampoline Fenced',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'property_features_risks',
    section: 'home',
    order: 6,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ],
    conditional: {
      dependsOn: 'home.has_trampoline',
      when: 'equals',
      value: 'Yes'
    }
  },

  'home.has_dogs': {
    key: 'home.has_dogs',
    label: 'Has Dogs',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'property_features_risks',
    section: 'home',
    order: 7,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  },

  'home.dog_count': {
    key: 'home.dog_count',
    label: 'Number of Dogs',
    inputType: 'number',
    displayCasing: 'none',
    group: 'property_features_risks',
    section: 'home',
    order: 8,
    validations: [
      { type: 'min', value: 1, message: 'Must have at least 1 dog' },
      { type: 'max', value: 20, message: 'Maximum 20 dogs' }
    ],
    conditional: {
      dependsOn: 'home.has_dogs',
      when: 'equals',
      value: 'Yes'
    }
  },

  'home.dog_breeds': {
    key: 'home.dog_breeds',
    label: 'Dog Breeds',
    inputType: 'multiselect',
    displayCasing: 'title',
    group: 'property_features_risks',
    section: 'home',
    order: 9,
    options: [
      { value: 'African Boerboel', label: 'African Boerboel' },
      { value: 'Akita', label: 'Akita' },
      { value: 'Alaskan Malamute', label: 'Alaskan Malamute' },
      { value: 'American Bull Dog', label: 'American Bull Dog' },
      { value: 'American Staffordshire Terrier', label: 'American Staffordshire Terrier' },
      { value: 'Bull Mastiff', label: 'Bull Mastiff' },
      { value: 'Bull Terrier', label: 'Bull Terrier' },
      { value: 'Cane Corso', label: 'Cane Corso' },
      { value: 'Chow', label: 'Chow' },
      { value: 'Collie', label: 'Collie' },
      { value: 'Dalmatian', label: 'Dalmatian' },
      { value: 'Dingo', label: 'Dingo' },
      { value: 'Doberman', label: 'Doberman' },
      { value: 'English Mastiff', label: 'English Mastiff' },
      { value: 'French Mastiff', label: 'French Mastiff' },
      { value: 'German Shepherd', label: 'German Shepherd' },
      { value: 'Giant Schnauzer', label: 'Giant Schnauzer' },
      { value: 'Great Dane', label: 'Great Dane' },
      { value: 'Husky', label: 'Husky' },
      { value: 'Italian Mastiff', label: 'Italian Mastiff' },
      { value: 'Pit Bull', label: 'Pit Bull' },
      { value: 'Pit Bull Mix', label: 'Pit Bull Mix' },
      { value: 'Presa Canario', label: 'Presa Canario' },
      { value: 'Rhodesian Ridgeback', label: 'Rhodesian Ridgeback' },
      { value: 'Rottweiler', label: 'Rottweiler' },
      { value: 'Samoyed', label: 'Samoyed' },
      { value: 'Shar Pei', label: 'Shar Pei' },
      { value: 'St. Bernard', label: 'St. Bernard' },
      { value: 'Stafford Bull', label: 'Stafford Bull' },
      { value: 'Staffordshire Bull Terrier', label: 'Staffordshire Bull Terrier' },
      { value: 'Others', label: 'Others' }
    ],
    conditional: {
      dependsOn: 'home.has_dogs',
      when: 'equals',
      value: 'Yes'
    }
  },
  
  'home.dog_has_bite_history': {
    key: 'home.dog_has_bite_history',
    label: 'Dog Has Bite History',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'property_features_risks',
    section: 'home',
    order: 10,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ],
    conditional: {
      dependsOn: 'home.has_dogs',
      when: 'equals',
      value: 'Yes'
    }
  },


  'home.has_screened_enclosure': {
    key: 'home.has_screened_enclosure',
    label: 'Has Screened Enclosure',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'property_features_risks',
    section: 'home',
    order: 11,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  'home.screened_enclosure_square_footage': {
    key: 'home.screened_enclosure_square_footage',
    label: 'Screened Enclosure Square Footage',
    inputType: 'number',
    displayCasing: 'none',
    suffix: ' sq ft',
    group: 'property_features_risks',
    section: 'home',
    order: 12,
    validations: [
      { type: 'min', value: 0, message: 'Cannot be negative' },
      { type: 'max', value: 5000, message: 'Maximum 5,000 sq ft' }
    ],
    conditional: {
      dependsOn: 'home.has_screened_enclosure',
      when: 'equals',
      value: 'true'
    }
  },

  'home.has_oil_tank_on_premises': {
    key: 'home.has_oil_tank_on_premises',
    label: 'Oil Tank on Premises',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'property_features_risks',
    section: 'home',
    order: 13,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  'home.has_horses_or_livestock': {
    key: 'home.has_horses_or_livestock',
    label: 'Has Horses or Livestock',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'property_features_risks',
    section: 'home',
    order: 14,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  },

  'home.runs_business_or_daycare': {
    key: 'home.runs_business_or_daycare',
    label: 'Runs Business or Daycare',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'property_features_risks',
    section: 'home',
    order: 15,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  },

  'home.business_number_of_employees': {
    key: 'home.business_number_of_employees',
    label: 'Number of Business Employees',
    inputType: 'number',
    displayCasing: 'none',
    group: 'property_features_risks',
    section: 'home',
    order: 16,
    validations: [
      { type: 'min', value: 0, message: 'Cannot be negative' },
      { type: 'max', value: 100, message: 'Maximum 100 employees' }
    ],
    conditional: {
      dependsOn: 'home.runs_business_or_daycare',
      when: 'equals',
      value: 'Yes'
    }
  },

  'home.used_for_short_term_rentals': {
    key: 'home.used_for_short_term_rentals',
    label: 'Used for Short-Term Rentals',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'property_features_risks',
    section: 'home',
    order: 17,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  },

  'home.occupancy_type': {
    key: 'home.occupancy_type',
    label: 'Occupancy Type',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'property_features_risks',
    section: 'home',
    order: 18,
    options: [
      { value: 'Owner Occupied', label: 'Owner Occupied' },
      { value: 'Tenant Occupied', label: 'Tenant Occupied' },
      { value: 'Vacant', label: 'Vacant' },
      { value: 'Secondary Residence', label: 'Secondary Residence' },
      { value: 'Seasonal', label: 'Seasonal' }
    ]
  },

  'home.primary_or_seasonal_residence': {
    key: 'home.primary_or_seasonal_residence',
    label: 'Primary or Seasonal Residence',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'property_features_risks',
    section: 'home',
    order: 19,
    options: [
      { value: 'Primary', label: 'Primary' },
      { value: 'Seasonal', label: 'Seasonal' },
      { value: 'Secondary', label: 'Secondary' }
    ]
  },

  'home.rental_frequency': {
    key: 'home.rental_frequency',
    label: 'Rental Frequency',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'property_features_risks',
    section: 'home',
    order: 20,
    options: [
      { value: 'Not Rented', label: 'Not Rented' },
      { value: 'Daily', label: 'Daily' },
      { value: 'Weekly', label: 'Weekly' },
      { value: 'Monthly', label: 'Monthly' },
      { value: 'Seasonally', label: 'Seasonally' },
      { value: 'Annually', label: 'Annually' }
    ]
  },

  'home.is_property_vacant_or_unoccupied': {
    key: 'home.is_property_vacant_or_unoccupied',
    label: 'Property Vacant or Unoccupied',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'property_features_risks',
    section: 'home',
    order: 21,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  'home.is_property_isolated': {
    key: 'home.is_property_isolated',
    label: 'Property Isolated',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'property_features_risks',
    section: 'home',
    order: 22,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  'home.is_occupied_by_undergraduate_students': {
    key: 'home.is_occupied_by_undergraduate_students',
    label: 'Occupied by Undergraduate Students',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'property_features_risks',
    section: 'home',
    order: 23,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  'home.is_in_park': {
    key: 'home.is_in_park',
    label: 'Is in Park',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'property_features_risks',
    section: 'home',
    order: 24,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  },

  'home.park_name': {
    key: 'home.park_name',
    label: 'Park Name',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'property_features_risks',
    section: 'home',
    order: 25,
    placeholder: 'Enter park name',
    conditional: {
      dependsOn: 'home.is_in_park',
      when: 'equals',
      value: 'Yes'
    }
  },

  'home.has_adjacent_frame_dwellings_within_20_feet': {
    key: 'home.has_adjacent_frame_dwellings_within_20_feet',
    label: 'Adjacent Frame Dwellings Within 20 Feet',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'property_features_risks',
    section: 'home',
    order: 26,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  // HOME - FINANCIAL INTERESTS

  'home.has_equity_line_of_credit': {
    key: 'home.has_equity_line_of_credit',
    label: 'Has Equity Line of Credit',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'financial_interests',
    section: 'home',
    order: 1,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  },

  'home.has_financial_interests': {
    key: 'home.has_financial_interests',
    label: 'Has Financial Interests',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'financial_interests',
    section: 'home',
    order: 2,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  },

  'home.has_other_nonfinancial_interests': {
    key: 'home.has_other_nonfinancial_interests',
    label: 'Has Other Non-Financial Interests',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'financial_interests',
    section: 'home',
    order: 4,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  },

  'home.has_cosigner_on_mortgage': {
    key: 'home.has_cosigner_on_mortgage',
    label: 'Has Cosigner on Mortgage',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'financial_interests',
    section: 'home',
    order: 5,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  // ADDITIONAL INTERESTS TEMPLATE FIELDS
  'home.additional_interests[*].type': {
    key: 'home.additional_interests[*].type',
    label: 'Interest Type',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'additional_interests_template',
    section: 'home',
    order: 1,
    options: [
      { value: 'Mortgagee', label: 'Mortgagee' },
      { value: 'Lienholder', label: 'Lienholder' },
      { value: 'Trustee', label: 'Trustee' },
      { value: 'Loss Payee', label: 'Loss Payee' },
      { value: 'Additional Insured', label: 'Additional Insured' },
      { value: 'Other', label: 'Other' }
    ],
    conditional: {
      dependsOn: 'home.has_financial_interests',
      when: 'equals',
      value: 'Yes'
    }
  },

  'home.additional_interests[*].name': {
    key: 'home.additional_interests[*].name',
    label: 'Name/Company',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'additional_interests_template',
    section: 'home',
    order: 2,
    placeholder: 'Enter company or individual name',
    conditional: {
      dependsOn: 'home.has_financial_interests',
      when: 'equals',
      value: 'Yes'
    }
  },

  'home.additional_interests[*].loan_number': {
    key: 'home.additional_interests[*].loan_number',
    label: 'Loan Number',
    inputType: 'text',
    displayCasing: 'none',
    group: 'additional_interests_template',
    section: 'home',
    order: 3,
    placeholder: 'Enter loan number (optional)',
    conditional: {
      dependsOn: 'home.has_financial_interests',
      when: 'equals',
      value: 'Yes'
    }
  },

  'home.additional_interests[*].has_foreign_mailing_address': {
    key: 'home.additional_interests[*].has_foreign_mailing_address',
    label: 'Has Foreign Mailing Address',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'additional_interests_template',
    section: 'home',
    order: 4,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ],
    conditional: {
      dependsOn: 'home.has_financial_interests',
      when: 'equals',
      value: 'Yes'
    }
  },

  'home.additional_interests[*].mailing_address_1': {
    key: 'home.additional_interests[*].mailing_address_1',
    label: 'Mailing Address Line 1',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'additional_interests_template',
    section: 'home',
    order: 5,
    placeholder: 'Enter street address',
    conditional: {
      dependsOn: 'home.has_financial_interests',
      when: 'equals',
      value: 'Yes'
    }
  },

  'home.additional_interests[*].mailing_address_2': {
    key: 'home.additional_interests[*].mailing_address_2',
    label: 'Mailing Address Line 2',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'additional_interests_template',
    section: 'home',
    order: 6,
    placeholder: 'Suite, unit, etc. (optional)',
    conditional: {
      dependsOn: 'home.has_financial_interests',
      when: 'equals',
      value: 'Yes'
    }
  },

  'home.additional_interests[*].city': {
    key: 'home.additional_interests[*].city',
    label: 'City',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'additional_interests_template',
    section: 'home',
    order: 7,
    required: true,
    placeholder: 'Enter city',
    conditional: {
      dependsOn: 'home.has_financial_interests',
      when: 'equals',
      value: 'Yes'
    }
  },

  'home.additional_interests[*].state': {
    key: 'home.additional_interests[*].state',
    label: 'State',
    inputType: 'dropdown',
    displayCasing: 'upper',
    group: 'additional_interests_template',
    section: 'home',
    order: 8,
    options: US_STATE_OPTIONS,
    conditional: {
      dependsOn: 'home.has_financial_interests',
      when: 'equals',
      value: 'Yes'
    }
  },

  'home.additional_interests[*].zip_code': {
    key: 'home.additional_interests[*].zip_code',
    label: 'ZIP Code',
    inputType: 'text',
    displayCasing: 'upper',
    group: 'additional_interests_template',
    section: 'home',
    order: 9,
    required: true,
    placeholder: 'Enter ZIP code',
    validations: [
      { type: 'pattern', value: '^[0-9]{5}(-[0-9]{4})?$', message: 'Enter valid ZIP code (12345 or 12345-6789)' }
    ],
    conditional: {
      dependsOn: 'home.has_financial_interests',
      when: 'equals',
      value: 'Yes'
    }
  },

  // HOME - COVERAGE & DEDUCTIBLES
  'home.current_insurance.standard_coverages.dwelling_coverage_a': {
    key: 'home.current_insurance.standard_coverages.dwelling_coverage_a',
    label: 'Dwelling Coverage A',
    inputType: 'currency',
    displayCasing: 'none',
    prefix: '$',
    group: 'current_coverages',
    section: 'home',
    order: 1,
    validations: [
      { type: 'min', value: 0, message: 'Coverage amount cannot be negative' }
    ]
  },

  'home.current_insurance.standard_coverages.other_structures_coverage_b': {
    key: 'home.current_insurance.standard_coverages.other_structures_coverage_b',
    label: 'Other Structures Coverage B',
    inputType: 'currency',
    displayCasing: 'none',
    prefix: '$',
    group: 'current_coverages',
    section: 'home',
    order: 2,
    validations: [
      { type: 'min', value: 0, message: 'Coverage amount cannot be negative' }
    ]
  },

  'home.current_insurance.standard_coverages.personal_property_coverage_c': {
    key: 'home.current_insurance.standard_coverages.personal_property_coverage_c',
    label: 'Personal Property Coverage C',
    inputType: 'currency',
    displayCasing: 'none',
    prefix: '$',
    group: 'current_coverages',
    section: 'home',
    order: 3,
    validations: [
      { type: 'min', value: 0, message: 'Coverage amount cannot be negative' }
    ]
  },

  'home.current_insurance.standard_coverages.loss_of_use_coverage_d': {
    key: 'home.current_insurance.standard_coverages.loss_of_use_coverage_d',
    label: 'Loss of Use Coverage D',
    inputType: 'currency',
    displayCasing: 'none',
    prefix: '$',
    group: 'current_coverages',
    section: 'home',
    order: 4,
    validations: [
      { type: 'min', value: 0, message: 'Coverage amount cannot be negative' }
    ]
  },

  'home.current_insurance.standard_coverages.personal_liability_coverage_e': {
    key: 'home.current_insurance.standard_coverages.personal_liability_coverage_e',
    label: 'Personal Liability Coverage E',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'current_coverages',
    section: 'home',
    order: 5,
    options: [
      { value: '25000', label: '$25,000' },
      { value: '50000', label: '$50,000' },
      { value: '100000', label: '$100,000' },
      { value: '200000', label: '$200,000' },
      { value: '300000', label: '$300,000' },
      { value: '400000', label: '$400,000' },
      { value: '500000', label: '$500,000' },
      { value: '1000000', label: '$1,000,000' }
    ]
  },

  'home.current_insurance.standard_coverages.medical_payments_coverage_f': {
    key: 'home.current_insurance.standard_coverages.medical_payments_coverage_f',
    label: 'Medical Payments Coverage F',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'current_coverages',
    section: 'home',
    order: 6,
    options: [
      { value: '1000', label: '$1,000' },
      { value: '2000', label: '$2,000' },
      { value: '3000', label: '$3,000' },
      { value: '4000', label: '$4,000' },
      { value: '5000', label: '$5,000' }
    ]
  },

  'home.current_insurance.standard_coverages.all_perils_deductible': {
    key: 'home.current_insurance.standard_coverages.all_perils_deductible',
    label: 'All Perils Deductible',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'current_coverages',
    section: 'home',
    order: 7,
    dependsOnStateFrom: 'home.address_state',
    stateSpecificOptions: {
      'FL': [
        { value: '0.5%', label: '0.5%' },
        { value: '100', label: '$100' },
        { value: '250', label: '$250' },
        { value: '500', label: '$500' },
        { value: '750', label: '$750' },
        { value: '1000', label: '$1,000' },
        { value: '2500', label: '$2,500' },
        { value: '3000', label: '$3,000' },
        { value: '4000', label: '$4,000' },
        { value: '5000', label: '$5,000' }
      ],
      'AL': [
        { value: '0.5%', label: '0.5%' },
        { value: '1%', label: '1%' },
        { value: '100', label: '$100' },
        { value: '250', label: '$250' },
        { value: '500', label: '$500' },
        { value: '750', label: '$750' },
        { value: '1000', label: '$1,000' },
        { value: '1500', label: '$1,500' },
        { value: '2000', label: '$2,000' },
        { value: '2500', label: '$2,500' },
        { value: '3000', label: '$3,000' },
        { value: '4000', label: '$4,000' },
        { value: '5000', label: '$5,000' }
      ],
      'IL': [
        { value: '0.5%', label: '0.5%' },
        { value: '1%', label: '1%' },
        { value: '100', label: '$100' },
        { value: '250', label: '$250' },
        { value: '500', label: '$500' },
        { value: '750', label: '$750' },
        { value: '1000', label: '$1,000' },
        { value: '1500', label: '$1,500' },
        { value: '2000', label: '$2,000' },
        { value: '2500', label: '$2,500' },
        { value: '3000', label: '$3,000' },
        { value: '4000', label: '$4,000' },
        { value: '5000', label: '$5,000' },
        { value: '10000', label: '$10,000' }
      ],
      default: [
        { value: '0.5%', label: '0.5%' },
        { value: '1%', label: '1%' },
        { value: '100', label: '$100' },
        { value: '250', label: '$250' },
        { value: '500', label: '$500' },
        { value: '750', label: '$750' },
        { value: '1000', label: '$1,000' },
        { value: '2000', label: '$2,000' },
        { value: '2500', label: '$2,500' },
        { value: '3000', label: '$3,000' },
        { value: '4000', label: '$4,000' },
        { value: '5000', label: '$5,000' }
      ]
    }
  },

  'home.current_insurance.standard_coverages.wind_hail_deductible': {
    key: 'home.current_insurance.standard_coverages.wind_hail_deductible',
    label: 'Wind/Hail Deductible',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'current_coverages',
    section: 'home',
    order: 8,
    options: [
      { value: '0.5%', label: '0.5%' },
      { value: '1%', label: '1%' },
      { value: '2%', label: '2%' },
      { value: '3%', label: '3%' },
      { value: '4%', label: '4%' },
      { value: '5%', label: '5%' },
      { value: '100', label: '$100' },
      { value: '250', label: '$250' },
      { value: '500', label: '$500' },
      { value: '1000', label: '$1,000' },
      { value: '1500', label: '$1,500' },
      { value: '2500', label: '$2,500' },
      { value: '5000', label: '$5,000' },
      { value: '7500', label: '$7,500' },
      { value: '10000', label: '$10,000' }
    ]
  },

  'home.current_insurance.standard_coverages.dwelling_deductible': {
    key: 'home.current_insurance.standard_coverages.dwelling_deductible',
    label: 'Dwelling Deductible',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'current_coverages',
    section: 'home',
    order: 9,
    dependsOnStateFrom: 'home.address_state',
    stateSpecificOptions: {
      'FL': [
        { value: '0.5%', label: '0.5%' },
        { value: '100', label: '$100' },
        { value: '250', label: '$250' },
        { value: '500', label: '$500' },
        { value: '750', label: '$750' },
        { value: '1000', label: '$1,000' },
        { value: '1500', label: '$1,500' },
        { value: '2500', label: '$2,500' },
        { value: '3000', label: '$3,000' },
        { value: '4000', label: '$4,000' },
        { value: '5000', label: '$5,000' }
      ],
      'AL': [
        { value: '0.5%', label: '0.5%' },
        { value: '1%', label: '1%' },
        { value: '100', label: '$100' },
        { value: '250', label: '$250' },
        { value: '500', label: '$500' },
        { value: '750', label: '$750' },
        { value: '1000', label: '$1,000' },
        { value: '1500', label: '$1,500' },
        { value: '2000', label: '$2,000' },
        { value: '2500', label: '$2,500' },
        { value: '3000', label: '$3,000' },
        { value: '4000', label: '$4,000' },
        { value: '5000', label: '$5,000' }
      ],
      'IL': [
        { value: '0.5%', label: '0.5%' },
        { value: '1%', label: '1%' },
        { value: '100', label: '$100' },
        { value: '250', label: '$250' },
        { value: '500', label: '$500' },
        { value: '750', label: '$750' },
        { value: '1000', label: '$1,000' },
        { value: '1500', label: '$1,500' },
        { value: '2000', label: '$2,000' },
        { value: '2500', label: '$2,500' },
        { value: '3000', label: '$3,000' },
        { value: '4000', label: '$4,000' },
        { value: '5000', label: '$5,000' },
        { value: '10000', label: '$10,000' }
      ],
      default: [
        { value: '0.5%', label: '0.5%' },
        { value: '1%', label: '1%' },
        { value: '100', label: '$100' },
        { value: '250', label: '$250' },
        { value: '500', label: '$500' },
        { value: '750', label: '$750' },
        { value: '1000', label: '$1,000' },
        { value: '2000', label: '$2,000' },
        { value: '2500', label: '$2,500' },
        { value: '3000', label: '$3,000' },
        { value: '4000', label: '$4,000' },
        { value: '5000', label: '$5,000' }
      ]
    }
  },

    // HOME - CURRENT ENDORSEMENTS
    'home.current_insurance.optional_coverages.additional_dwellings_rented_enabled': {
      key: 'home.current_insurance.optional_coverages.additional_dwellings_rented_enabled',
      label: 'Additional Dwellings Rented Enabled',
      inputType: 'text',
      displayCasing: 'sentence',
      inputCasing: 'sentence',
      group: 'current_endorsements',
      section: 'home',
      order: 1
    },
  
    'home.current_insurance.optional_coverages.additional_dwellings_rented_count': {
      key: 'home.current_insurance.optional_coverages.additional_dwellings_rented_count',
      label: 'Additional Dwellings Rented Count',
      inputType: 'number',
      displayCasing: 'none',
      group: 'current_endorsements',
      section: 'home',
      order: 2,
      validations: [
        { type: 'min', value: 0, message: 'Count cannot be negative' }
      ]
    },
  
    'home.current_insurance.optional_coverages.building_additions_alterations': {
      key: 'home.current_insurance.optional_coverages.building_additions_alterations',
      label: 'Building Additions & Alterations',
      inputType: 'text',
      displayCasing: 'sentence',
      inputCasing: 'sentence',
      group: 'current_endorsements',
      section: 'home',
      order: 3
    },
  
    'home.current_insurance.optional_coverages.building_ordinance_law_percent': {
      key: 'home.current_insurance.optional_coverages.building_ordinance_law_percent',
      label: 'Building Ordinance Law Percentage',
      inputType: 'text',
      displayCasing: 'none',
      group: 'current_endorsements',
      section: 'home',
      order: 4
    },
  
    'home.current_insurance.optional_coverages.cyber_protection': {
      key: 'home.current_insurance.optional_coverages.cyber_protection',
      label: 'Cyber Protection',
      inputType: 'text',
      displayCasing: 'sentence',
      inputCasing: 'sentence',
      group: 'current_endorsements',
      section: 'home',
      order: 5
    },
  
    'home.current_insurance.optional_coverages.earthquake_coverage_limit': {
      key: 'home.current_insurance.optional_coverages.earthquake_coverage_limit',
      label: 'Earthquake Coverage Limit',
      inputType: 'text',
      displayCasing: 'none',
      group: 'current_endorsements',
      section: 'home',
      order: 6
    },
  
    'home.current_insurance.optional_coverages.earthquake_coverage_limit_building': {
      key: 'home.current_insurance.optional_coverages.earthquake_coverage_limit_building',
      label: 'Earthquake Coverage Limit - Building',
      inputType: 'text',
      displayCasing: 'none',
      group: 'current_endorsements',
      section: 'home',
      order: 7
    },
  
    'home.current_insurance.optional_coverages.earthquake_coverage_limit_contents': {
      key: 'home.current_insurance.optional_coverages.earthquake_coverage_limit_contents',
      label: 'Earthquake Coverage Limit - Contents',
      inputType: 'text',
      displayCasing: 'none',
      group: 'current_endorsements',
      section: 'home',
      order: 8
    },
  
    'home.current_insurance.optional_coverages.earthquake_coverage_limit_other_structure': {
      key: 'home.current_insurance.optional_coverages.earthquake_coverage_limit_other_structure',
      label: 'Earthquake Coverage Limit - Other Structure',
      inputType: 'text',
      displayCasing: 'none',
      group: 'current_endorsements',
      section: 'home',
      order: 9
    },
  
    'home.current_insurance.optional_coverages.earthquake_deductible_percentage': {
      key: 'home.current_insurance.optional_coverages.earthquake_deductible_percentage',
      label: 'Earthquake Deductible Percentage',
      inputType: 'text',
      displayCasing: 'none',
      group: 'current_endorsements',
      section: 'home',
      order: 10
    },
  
    'home.current_insurance.optional_coverages.earthquake_zone': {
      key: 'home.current_insurance.optional_coverages.earthquake_zone',
      label: 'Earthquake Zone',
      inputType: 'text',
      displayCasing: 'sentence',
      inputCasing: 'sentence',
      group: 'current_endorsements',
      section: 'home',
      order: 11
    },
  
    'home.current_insurance.optional_coverages.equipment_breakdown': {
      key: 'home.current_insurance.optional_coverages.equipment_breakdown',
      label: 'Equipment Breakdown',
      inputType: 'text',
      displayCasing: 'sentence',
      inputCasing: 'sentence',
      group: 'current_endorsements',
      section: 'home',
      order: 12
    },
  
    'home.current_insurance.optional_coverages.extension_owner_occupied_dwelling_liability_enabled': {
      key: 'home.current_insurance.optional_coverages.extension_owner_occupied_dwelling_liability_enabled',
      label: 'Extension Owner Occupied Dwelling Liability Enabled',
      inputType: 'text',
      displayCasing: 'sentence',
      inputCasing: 'sentence',
      group: 'current_endorsements',
      section: 'home',
      order: 13
    },
  
    'home.current_insurance.optional_coverages.extension_owner_occupied_dwelling_liability_number_of_locations': {
      key: 'home.current_insurance.optional_coverages.extension_owner_occupied_dwelling_liability_number_of_locations',
      label: 'Extension Owner Occupied Dwelling Liability - Number of Locations',
      inputType: 'number',
      displayCasing: 'none',
      group: 'current_endorsements',
      section: 'home',
      order: 14,
      validations: [
        { type: 'min', value: 0, message: 'Count cannot be negative' }
      ]
    },
  
    'home.current_insurance.optional_coverages.extended_replacement_cost_dwelling_percentage': {
      key: 'home.current_insurance.optional_coverages.extended_replacement_cost_dwelling_percentage',
      label: 'Extended Replacement Cost Dwelling Percentage',
      inputType: 'text',
      displayCasing: 'none',
      group: 'current_endorsements',
      section: 'home',
      order: 15
    },
  
    'home.current_insurance.optional_coverages.foundation_coverage': {
      key: 'home.current_insurance.optional_coverages.foundation_coverage',
      label: 'Foundation Coverage',
      inputType: 'text',
      displayCasing: 'sentence',
      inputCasing: 'sentence',
      group: 'current_endorsements',
      section: 'home',
      order: 16
    },
  
    'home.current_insurance.optional_coverages.home_day_care_coverage': {
      key: 'home.current_insurance.optional_coverages.home_day_care_coverage',
      label: 'Home Day Care Coverage',
      inputType: 'text',
      displayCasing: 'sentence',
      inputCasing: 'sentence',
      group: 'current_endorsements',
      section: 'home',
      order: 17
    },
  
    'home.current_insurance.optional_coverages.home_sharing_coverage': {
      key: 'home.current_insurance.optional_coverages.home_sharing_coverage',
      label: 'Home Sharing Coverage',
      inputType: 'text',
      displayCasing: 'sentence',
      inputCasing: 'sentence',
      group: 'current_endorsements',
      section: 'home',
      order: 18
    },
  
    'home.current_insurance.optional_coverages.hurricane_named_storm_deductible': {
      key: 'home.current_insurance.optional_coverages.hurricane_named_storm_deductible',
      label: 'Hurricane Named Storm Deductible',
      inputType: 'text',
      displayCasing: 'none',
      group: 'current_endorsements',
      section: 'home',
      order: 19
    },
  
    'home.current_insurance.optional_coverages.identity_theft': {
      key: 'home.current_insurance.optional_coverages.identity_theft',
      label: 'Identity Theft',
      inputType: 'text',
      displayCasing: 'sentence',
      inputCasing: 'sentence',
      group: 'current_endorsements',
      section: 'home',
      order: 20
    },
  
    'home.current_insurance.optional_coverages.incidental_farming_personal_liability': {
      key: 'home.current_insurance.optional_coverages.incidental_farming_personal_liability',
      label: 'Incidental Farming Personal Liability',
      inputType: 'text',
      displayCasing: 'sentence',
      inputCasing: 'sentence',
      group: 'current_endorsements',
      section: 'home',
      order: 21
    },
  
    'home.current_insurance.optional_coverages.increased_coverage_credit_card_amount': {
      key: 'home.current_insurance.optional_coverages.increased_coverage_credit_card_amount',
      label: 'Increased Coverage Credit Card Amount',
      inputType: 'text',
      displayCasing: 'none',
      group: 'current_endorsements',
      section: 'home',
      order: 22
    },
  
    'home.current_insurance.optional_coverages.increased_limit_jewelry_watches_furs': {
      key: 'home.current_insurance.optional_coverages.increased_limit_jewelry_watches_furs',
      label: 'Increased Limit Jewelry, Watches & Furs',
      inputType: 'text',
      displayCasing: 'none',
      group: 'current_endorsements',
      section: 'home',
      order: 23
    },
  
    'home.current_insurance.optional_coverages.increased_mold_property_damage': {
      key: 'home.current_insurance.optional_coverages.increased_mold_property_damage',
      label: 'Increased Mold Property Damage',
      inputType: 'text',
      displayCasing: 'sentence',
      inputCasing: 'sentence',
      group: 'current_endorsements',
      section: 'home',
      order: 24
    },
  
    'home.current_insurance.optional_coverages.increased_mold_property_liability': {
      key: 'home.current_insurance.optional_coverages.increased_mold_property_liability',
      label: 'Increased Mold Property Liability',
      inputType: 'text',
      displayCasing: 'sentence',
      inputCasing: 'sentence',
      group: 'current_endorsements',
      section: 'home',
      order: 25
    },
  
    'home.current_insurance.optional_coverages.landlord_furnishings': {
      key: 'home.current_insurance.optional_coverages.landlord_furnishings',
      label: 'Landlord Furnishings',
      inputType: 'text',
      displayCasing: 'sentence',
      inputCasing: 'sentence',
      group: 'current_endorsements',
      section: 'home',
      order: 26
    },
  
    'home.current_insurance.optional_coverages.limited_earthquake_coverage_limit': {
      key: 'home.current_insurance.optional_coverages.limited_earthquake_coverage_limit',
      label: 'Limited Earthquake Coverage Limit',
      inputType: 'text',
      displayCasing: 'none',
      group: 'current_endorsements',
      section: 'home',
      order: 27
    },
  
    'home.current_insurance.optional_coverages.loss_assessment_amount': {
      key: 'home.current_insurance.optional_coverages.loss_assessment_amount',
      label: 'Loss Assessment Amount',
      inputType: 'text',
      displayCasing: 'none',
      group: 'current_endorsements',
      section: 'home',
      order: 28
    },
  
    'home.current_insurance.optional_coverages.loss_settlement_type_personal_property': {
      key: 'home.current_insurance.optional_coverages.loss_settlement_type_personal_property',
      label: 'Loss Settlement Type - Personal Property',
      inputType: 'text',
      displayCasing: 'sentence',
      inputCasing: 'sentence',
      group: 'current_endorsements',
      section: 'home',
      order: 29
    },
  
    'home.current_insurance.optional_coverages.roof_settlement_type': {
      key: 'home.current_insurance.optional_coverages.roof_settlement_type',
      label: 'Roof Settlement Type',
      inputType: 'text',
      displayCasing: 'sentence',
      inputCasing: 'sentence',
      group: 'current_endorsements',
      section: 'home',
      order: 30
    },
  
    'home.current_insurance.optional_coverages.matching_undamaged_siding_roofing_windows': {
      key: 'home.current_insurance.optional_coverages.matching_undamaged_siding_roofing_windows',
      label: 'Matching Undamaged Siding, Roofing & Windows',
      inputType: 'text',
      displayCasing: 'sentence',
      inputCasing: 'sentence',
      group: 'current_endorsements',
      section: 'home',
      order: 31
    },
  
    'home.current_insurance.optional_coverages.mine_subsidence': {
      key: 'home.current_insurance.optional_coverages.mine_subsidence',
      label: 'Mine Subsidence',
      inputType: 'text',
      displayCasing: 'sentence',
      inputCasing: 'sentence',
      group: 'current_endorsements',
      section: 'home',
      order: 32
    },
  
    'home.current_insurance.optional_coverages.outboard_motor_liability': {
      key: 'home.current_insurance.optional_coverages.outboard_motor_liability',
      label: 'Outboard Motor Liability',
      inputType: 'text',
      displayCasing: 'sentence',
      inputCasing: 'sentence',
      group: 'current_endorsements',
      section: 'home',
      order: 33
    },
  
    'home.current_insurance.optional_coverages.permitted_incidental_business_occupancy': {
      key: 'home.current_insurance.optional_coverages.permitted_incidental_business_occupancy',
      label: 'Permitted Incidental Business Occupancy',
      inputType: 'text',
      displayCasing: 'sentence',
      inputCasing: 'sentence',
      group: 'current_endorsements',
      section: 'home',
      order: 34
    },
  
    'home.current_insurance.optional_coverages.personal_injury': {
      key: 'home.current_insurance.optional_coverages.personal_injury',
      label: 'Personal Injury',
      inputType: 'text',
      displayCasing: 'sentence',
      inputCasing: 'sentence',
      group: 'current_endorsements',
      section: 'home',
      order: 35
    },
  
    'home.current_insurance.optional_coverages.personal_offense': {
      key: 'home.current_insurance.optional_coverages.personal_offense',
      label: 'Personal Offense',
      inputType: 'text',
      displayCasing: 'sentence',
      inputCasing: 'sentence',
      group: 'current_endorsements',
      section: 'home',
      order: 36
    },
  
    'home.current_insurance.optional_coverages.personal_property_replacement_cost': {
      key: 'home.current_insurance.optional_coverages.personal_property_replacement_cost',
      label: 'Personal Property Replacement Cost',
      inputType: 'text',
      displayCasing: 'sentence',
      inputCasing: 'sentence',
      group: 'current_endorsements',
      section: 'home',
      order: 37
    },
  
    'home.current_insurance.optional_coverages.refrigerated_products': {
      key: 'home.current_insurance.optional_coverages.refrigerated_products',
      label: 'Refrigerated Products',
      inputType: 'text',
      displayCasing: 'sentence',
      inputCasing: 'sentence',
      group: 'current_endorsements',
      section: 'home',
      order: 38
    },
  
    'home.current_insurance.optional_coverages.residence_glass': {
      key: 'home.current_insurance.optional_coverages.residence_glass',
      label: 'Residence Glass',
      inputType: 'text',
      displayCasing: 'sentence',
      inputCasing: 'sentence',
      group: 'current_endorsements',
      section: 'home',
      order: 39
    },
  
    'home.current_insurance.optional_coverages.service_line_endorsement': {
      key: 'home.current_insurance.optional_coverages.service_line_endorsement',
      label: 'Service Line Endorsement',
      inputType: 'text',
      displayCasing: 'sentence',
      inputCasing: 'sentence',
      group: 'current_endorsements',
      section: 'home',
      order: 40
    },
  
    'home.current_insurance.optional_coverages.sinkhole_collapse': {
      key: 'home.current_insurance.optional_coverages.sinkhole_collapse',
      label: 'Sinkhole Collapse',
      inputType: 'text',
      displayCasing: 'sentence',
      inputCasing: 'sentence',
      group: 'current_endorsements',
      section: 'home',
      order: 41
    },
  
    'home.current_insurance.optional_coverages.special_personal_property': {
      key: 'home.current_insurance.optional_coverages.special_personal_property',
      label: 'Special Personal Property',
      inputType: 'text',
      displayCasing: 'sentence',
      inputCasing: 'sentence',
      group: 'current_endorsements',
      section: 'home',
      order: 42
    },
  
    'home.current_insurance.optional_coverages.theft_of_building_materials': {
      key: 'home.current_insurance.optional_coverages.theft_of_building_materials',
      label: 'Theft of Building Materials',
      inputType: 'text',
      displayCasing: 'sentence',
      inputCasing: 'sentence',
      group: 'current_endorsements',
      section: 'home',
      order: 43
    },
  
    'home.current_insurance.optional_coverages.valuable_articles_coverage_type': {
      key: 'home.current_insurance.optional_coverages.valuable_articles_coverage_type',
      label: 'Valuable Articles Coverage Type',
      inputType: 'text',
      displayCasing: 'sentence',
      inputCasing: 'sentence',
      group: 'current_endorsements',
      section: 'home',
      order: 44
    },
  
    'home.current_insurance.optional_coverages.valuable_articles_coins_amount': {
      key: 'home.current_insurance.optional_coverages.valuable_articles_coins_amount',
      label: 'Valuable Articles - Coins Amount',
      inputType: 'text',
      displayCasing: 'none',
      group: 'current_endorsements',
      section: 'home',
      order: 45
    },
  
    'home.current_insurance.optional_coverages.valuable_articles_fine_art_amount': {
      key: 'home.current_insurance.optional_coverages.valuable_articles_fine_art_amount',
      label: 'Valuable Articles - Fine Art Amount',
      inputType: 'text',
      displayCasing: 'none',
      group: 'current_endorsements',
      section: 'home',
      order: 46
    },
  
    'home.current_insurance.optional_coverages.valuable_articles_furs_amount': {
      key: 'home.current_insurance.optional_coverages.valuable_articles_furs_amount',
      label: 'Valuable Articles - Furs Amount',
      inputType: 'text',
      displayCasing: 'none',
      group: 'current_endorsements',
      section: 'home',
      order: 47
    },
  
    'home.current_insurance.optional_coverages.valuable_articles_guns_amount': {
      key: 'home.current_insurance.optional_coverages.valuable_articles_guns_amount',
      label: 'Valuable Articles - Guns Amount',
      inputType: 'text',
      displayCasing: 'none',
      group: 'current_endorsements',
      section: 'home',
      order: 48
    },
  
    'home.current_insurance.optional_coverages.valuable_articles_jewelry_amount': {
      key: 'home.current_insurance.optional_coverages.valuable_articles_jewelry_amount',
      label: 'Valuable Articles - Jewelry Amount',
      inputType: 'text',
      displayCasing: 'none',
      group: 'current_endorsements',
      section: 'home',
      order: 49
    },
  
    'home.current_insurance.optional_coverages.valuable_articles_musical_instruments_amount': {
      key: 'home.current_insurance.optional_coverages.valuable_articles_musical_instruments_amount',
      label: 'Valuable Articles - Musical Instruments Amount',
      inputType: 'text',
      displayCasing: 'none',
      group: 'current_endorsements',
      section: 'home',
      order: 50
    },
  
    'home.current_insurance.optional_coverages.valuable_articles_silverware_amount': {
      key: 'home.current_insurance.optional_coverages.valuable_articles_silverware_amount',
      label: 'Valuable Articles - Silverware Amount',
      inputType: 'text',
      displayCasing: 'none',
      group: 'current_endorsements',
      section: 'home',
      order: 51
    },
  
    'home.current_insurance.optional_coverages.water_backup_sewers_drains_coverage': {
      key: 'home.current_insurance.optional_coverages.water_backup_sewers_drains_coverage',
      label: 'Water Backup Sewers & Drains Coverage',
      inputType: 'text',
      displayCasing: 'sentence',
      inputCasing: 'sentence',
      group: 'current_endorsements',
      section: 'home',
      order: 52
    },
  
    'home.current_insurance.optional_coverages.water_backup_sewers_drains_deductible': {
      key: 'home.current_insurance.optional_coverages.water_backup_sewers_drains_deductible',
      label: 'Water Backup Sewers & Drains Deductible',
      inputType: 'text',
      displayCasing: 'none',
      group: 'current_endorsements',
      section: 'home',
      order: 53
    },
  
    'home.current_insurance.optional_coverages.water_seepage_leakage': {
      key: 'home.current_insurance.optional_coverages.water_seepage_leakage',
      label: 'Water Seepage & Leakage',
      inputType: 'text',
      displayCasing: 'sentence',
      inputCasing: 'sentence',
      group: 'current_endorsements',
      section: 'home',
      order: 54
    },

    'home.current_insurance.optional_coverages.water_deductible': {
      key: 'home.current_insurance.optional_coverages.water_deductible',
      label: 'Water Deductible',
      inputType: 'text',
      displayCasing: 'none',
      group: 'current_endorsements',
      section: 'home',
      order: 55
    },

    'home.current_insurance.optional_coverages.limited_fungi_wet_dry_rot_bacteria': {
      key: 'home.current_insurance.optional_coverages.limited_fungi_wet_dry_rot_bacteria',
      label: 'Limited Fungi, Wet/Dry Rot & Bacteria',
      inputType: 'text',
      displayCasing: 'sentence',
      inputCasing: 'sentence',
      group: 'current_endorsements',
      section: 'home',
      order: 56
    },

    'home.current_insurance.optional_coverages.animal_liability': {
      key: 'home.current_insurance.optional_coverages.animal_liability',
      label: 'Animal Liability',
      inputType: 'text',
      displayCasing: 'sentence',
      inputCasing: 'sentence',
      group: 'current_endorsements',
      section: 'home',
      order: 57
    },

    'home.current_insurance.optional_coverages.screen_enclosure_carport_awning': {
      key: 'home.current_insurance.optional_coverages.screen_enclosure_carport_awning',
      label: 'Screen Enclosure, Carport & Awning',
      inputType: 'text',
      displayCasing: 'sentence',
      inputCasing: 'sentence',
      group: 'current_endorsements',
      section: 'home',
      order: 58
    },

    'home.current_insurance.optional_coverages.sinkhole_loss_coverage': {
      key: 'home.current_insurance.optional_coverages.sinkhole_loss_coverage',
      label: 'Sinkhole Loss Coverage',
      inputType: 'text',
      displayCasing: 'sentence',
      inputCasing: 'sentence',
      group: 'current_endorsements',
      section: 'home',
      order: 59
    },

    'home.current_insurance.optional_coverages.sinkhole_deductible': {
      key: 'home.current_insurance.optional_coverages.sinkhole_deductible',
      label: 'Sinkhole Deductible',
      inputType: 'text',
      displayCasing: 'none',
      group: 'current_endorsements',
      section: 'home',
      order: 60
    },

    'home.current_insurance.optional_coverages.social_media_expense_resolution_services': {
      key: 'home.current_insurance.optional_coverages.social_media_expense_resolution_services',
      label: 'Social Media Expense Resolution Services',
      inputType: 'text',
      displayCasing: 'sentence',
      inputCasing: 'sentence',
      group: 'current_endorsements',
      section: 'home',
      order: 61
    },

  // HOME - INSURANCE HISTORY
  'home.current_insurance.has_current_insurance': {
    key: 'home.current_insurance.has_current_insurance',
    label: 'Has Current Insurance',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'insurance_history',
    section: 'home',
    order: 1,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  'home.current_insurance.carrier_name': {
    key: 'home.current_insurance.carrier_name',
    label: 'Current Insurance Carrier',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'insurance_history',
    section: 'home',
    order: 2,
    placeholder: 'e.g., State Farm, Allstate, GEICO',
    conditional: {
      dependsOn: 'home.current_insurance.has_current_insurance',
      when: 'equals',
      value: 'true'
    }
  },

  'home.current_insurance.writing_company': {
    key: 'home.current_insurance.writing_company',
    label: 'Writing Company',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'insurance_history',
    section: 'home',
    order: 3,
    placeholder: 'Enter writing company name',
    conditional: {
      dependsOn: 'home.current_insurance.has_current_insurance',
      when: 'equals',
      value: 'true'
    }
  },

  'home.current_insurance.policy_number': {
    key: 'home.current_insurance.policy_number',
    label: 'Current Policy Number',
    inputType: 'text',
    displayCasing: 'upper',
    inputCasing: 'upper',
    group: 'insurance_history',
    section: 'home',
    order: 4,
    placeholder: 'Enter policy number',
    conditional: {
      dependsOn: 'home.current_insurance.has_current_insurance',
      when: 'equals',
      value: 'true'
    }
  },

  'home.current_insurance.premium': {
    key: 'home.current_insurance.premium',
    label: 'Current Annual Premium',
    inputType: 'currency',
    displayCasing: 'none',
    prefix: '$',
    group: 'insurance_history',
    section: 'home',
    order: 5,
    validations: [
      { type: 'min', value: 0, message: 'Premium cannot be negative' }
    ],
    conditional: {
      dependsOn: 'home.current_insurance.has_current_insurance',
      when: 'equals',
      value: 'true'
    }
  },

  'home.current_insurance.payment_frequency': {
    key: 'home.current_insurance.payment_frequency',
    label: 'Payment Frequency',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'insurance_history',
    section: 'home',
    order: 5.5,
    options: [
      { value: 'Monthly', label: 'Monthly' },
      { value: 'Quarterly', label: 'Quarterly' },
      { value: 'Semi-Annual', label: 'Semi-Annual' },
      { value: 'Annual', label: 'Annual' }
    ],
    conditional: {
      dependsOn: 'home.current_insurance.has_current_insurance',
      when: 'equals',
      value: 'true'
    }
  },

  'home.current_insurance.term_start_date': {
    key: 'home.current_insurance.term_start_date',
    label: 'Policy Start Date',
    inputType: 'date',
    displayCasing: 'none',
    group: 'insurance_history',
    section: 'home',
    order: 6,
    conditional: {
      dependsOn: 'home.current_insurance.has_current_insurance',
      when: 'equals',
      value: 'true'
    }
  },

  'home.current_insurance.term_expiration_date': {
    key: 'home.current_insurance.term_expiration_date',
    label: 'Policy Expiration Date',
    inputType: 'date',
    displayCasing: 'none',
    group: 'insurance_history',
    section: 'home',
    order: 7,
    conditional: {
      dependsOn: 'home.current_insurance.has_current_insurance',
      when: 'equals',
      value: 'true'
    }
  },

  'home.current_insurance.time_with_carrier': {
    key: 'home.current_insurance.time_with_carrier',
    label: 'Time with Current Carrier',
    inputType: 'text',
    displayCasing: 'sentence',
    inputCasing: 'sentence',
    group: 'insurance_history',
    section: 'home',
    order: 8,
    placeholder: 'e.g., 2 years, 6 months',
    conditional: {
      dependsOn: 'home.current_insurance.has_current_insurance',
      when: 'equals',
      value: 'true'
    }
  },

  'home.current_insurance.continuous_insurance_duration': {
    key: 'home.current_insurance.continuous_insurance_duration',
    label: 'Continuous Insurance Duration',
    inputType: 'text',
    displayCasing: 'sentence',
    inputCasing: 'sentence',
    group: 'insurance_history',
    section: 'home',
    order: 9,
    placeholder: 'e.g., 5 years, 10 years',
    conditional: {
      dependsOn: 'home.current_insurance.has_current_insurance',
      when: 'equals',
      value: 'true'
    }
  },

  'home.current_insurance.has_been_cancelled_or_declined': {
    key: 'home.current_insurance.has_been_cancelled_or_declined',
    label: 'Has Been Cancelled or Declined',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'insurance_history',
    section: 'home',
    order: 10,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  'home.current_insurance.has_lapse_in_coverage_past_year': {
    key: 'home.current_insurance.has_lapse_in_coverage_past_year',
    label: 'Has Lapse in Coverage Past Year',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'insurance_history',
    section: 'home',
    order: 10.5,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  'home.prior_carriers': {
    key: 'home.prior_carriers',
    label: 'Prior Insurance Carriers',
    description: 'Previous insurance carriers and policy information',
    inputType: 'claims_array',
    displayCasing: 'none',
    group: 'insurance_history',
    section: 'home',
    order: 11
  },

  // HOME - CLAIMS HISTORY
  'home.has_claims_last_5_years': {
    key: 'home.has_claims_last_5_years',
    label: 'Has Claims in Last 5 Years',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'claims_history',
    section: 'home',
    order: 1,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  'home.number_of_claims': {
    key: 'home.number_of_claims',
    label: 'Number of Claims',
    inputType: 'number',
    displayCasing: 'none',
    group: 'claims_history',
    section: 'home',
    order: 2,
    validations: [
      { type: 'min', value: 0, message: 'Cannot be negative' },
      { type: 'max', value: 50, message: 'Maximum 50 claims' }
    ],
    conditional: {
      dependsOn: 'home.has_claims_last_5_years',
      when: 'equals',
      value: 'true'
    }
  },

  'home.claims': {
    key: 'home.claims',
    label: 'Claims Details',
    description: 'Details of each claim in the last 5 years',
    inputType: 'claims_array',
    displayCasing: 'none',
    group: 'claims_history',
    section: 'home',
    order: 3,
    conditional: {
      dependsOn: 'home.has_claims_last_5_years',
      when: 'equals',
      value: 'true'
    }
  }, 
  
  // HOME - WIND MITIGATION  
  'home.wind_mitigation.inspection_date': {
    key: 'home.wind_mitigation.inspection_date',
    label: 'Wind Mitigation Inspection Date',
    inputType: 'date',
    displayCasing: 'none',
    group: 'wind_mitigation',
    section: 'home',
    order: 1
  },

  'home.wind_mitigation.terrain': {
    key: 'home.wind_mitigation.terrain',
    label: 'Terrain',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'wind_mitigation',
    section: 'home',
    order: 2,
    options: [
      { value: 'B - Urban/Suburban', label: 'B - Urban/Suburban' },
      { value: 'C - Open Terrain', label: 'C - Open Terrain' },
      { value: 'D - Flat/Unobstructed', label: 'D - Flat/Unobstructed' }
    ]
  },

  'home.wind_mitigation.roof_covering': {
    key: 'home.wind_mitigation.roof_covering',
    label: 'Roof Covering',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'wind_mitigation',
    section: 'home',
    order: 3,
    options: [
      { value: 'FBC Equivalent', label: 'FBC Equivalent' },
      { value: 'Non-FBC Equivalent', label: 'Non-FBC Equivalent' }
    ]
  },

  'home.wind_mitigation.roof_deck_attachment': {
    key: 'home.wind_mitigation.roof_deck_attachment',
    label: 'Roof Deck Attachment',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'wind_mitigation',
    section: 'home',
    order: 4,
    options: [
      { value: '6d @ 6"/12', label: '6d @ 6"/12' },
      { value: '8d @ 6"/12', label: '8d @ 6"/12' },
      { value: '8d @ 6"/6', label: '8d @ 6"/6' },
      { value: 'Reinforced Concrete', label: 'Reinforced Concrete' }
    ]
  },

  'home.wind_mitigation.roof_to_wall_attachment': {
    key: 'home.wind_mitigation.roof_to_wall_attachment',
    label: 'Roof to Wall Attachment',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'wind_mitigation',
    section: 'home',
    order: 5,
    options: [
      { value: 'Toe Nails', label: 'Toe Nails' },
      { value: 'Clips', label: 'Clips' },
      { value: 'Single Wraps', label: 'Single Wraps' },
      { value: 'Double Wraps', label: 'Double Wraps' }
    ]
  },

  'home.wind_mitigation.secondary_water_resistance': {
    key: 'home.wind_mitigation.secondary_water_resistance',
    label: 'Secondary Water Resistance',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'wind_mitigation',
    section: 'home',
    order: 6,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  },

  'home.wind_mitigation.opening_protection': {
    key: 'home.wind_mitigation.opening_protection',
    label: 'Opening Protection',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'wind_mitigation',
    section: 'home',
    order: 7,
    options: [
      { value: 'None', label: 'None' },
      { value: 'Basic', label: 'Basic' },
      { value: 'Hurricane', label: 'Hurricane' },
      { value: '3M Film/Fabric Shields/Plywood/Bahama Shutters', label: '3M Film/Fabric Shields/Plywood/Bahama Shutters' },
      { value: 'Unknown', label: 'Unknown' }
    ]
  },

  'home.wind_mitigation.wind_speed': {
    key: 'home.wind_mitigation.wind_speed',
    label: 'Design Wind Speed',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'wind_mitigation',
    section: 'home',
    order: 8,
    options: [
      { value: '115-130', label: '115-130' },
      { value: '130-140', label: '130-140' },
      { value: '140-155', label: '140-155' },
      { value: '>=155', label: '>=155' }
    ]
  },

  'home.wind_mitigation.wind_design': {
    key: 'home.wind_mitigation.wind_design',
    label: 'Wind Design',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'wind_mitigation',
    section: 'home',
    order: 9,
    options: [
      { value: '115-130', label: '115-130' },
      { value: '130-140', label: '130-140' },
      { value: '140-155', label: '140-155' },
      { value: '>=155', label: '>=155' }
    ]
  },

  // HOME - FLOOD COVERAGE
  'home.current_insurance.flood_coverage.include_flood_coverage': {
    key: 'home.current_insurance.flood_coverage.include_flood_coverage',
    label: 'Include Flood Coverage',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'flood_coverage',
    section: 'home',
    order: 1,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  'home.current_insurance.flood_coverage.has_prior_flood_losses_on_building': {
    key: 'home.current_insurance.flood_coverage.has_prior_flood_losses_on_building',
    label: 'Prior Flood Losses on Building',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'flood_coverage',
    section: 'home',
    order: 3,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ],
    conditional: {
      dependsOn: 'home.current_insurance.flood_coverage.include_flood_coverage',
      when: 'equals',
      value: 'true'
    }
  },

  'home.current_insurance.flood_coverage.flood_building_limit': {
    key: 'home.current_insurance.flood_coverage.flood_building_limit',
    label: 'Flood Building Limit',
    inputType: 'currency',
    displayCasing: 'none',
    prefix: '$',
    group: 'flood_coverage',
    section: 'home',
    order: 4,
    conditional: {
      dependsOn: 'home.current_insurance.flood_coverage.include_flood_coverage',
      when: 'equals',
      value: 'true'
    }
  },

  'home.current_insurance.flood_coverage.flood_content_limit': {
    key: 'home.current_insurance.flood_coverage.flood_content_limit',
    label: 'Flood Content Limit',
    inputType: 'currency',
    displayCasing: 'none',
    prefix: '$',
    group: 'flood_coverage',
    section: 'home',
    order: 5,
    conditional: {
      dependsOn: 'home.current_insurance.flood_coverage.include_flood_coverage',
      when: 'equals',
      value: 'true'
    }
  },

  'home.current_insurance.flood_coverage.flood_coverage_deductible': {
    key: 'home.current_insurance.flood_coverage.flood_coverage_deductible',
    label: 'Flood Coverage Deductible',
    inputType: 'currency',
    displayCasing: 'none',
    prefix: '$',
    group: 'flood_coverage',
    section: 'home',
    order: 6,
    conditional: {
      dependsOn: 'home.current_insurance.flood_coverage.include_flood_coverage',
      when: 'equals',
      value: 'true'
    }
  },

  'home.current_insurance.flood_coverage.firm_indicator': {
    key: 'home.current_insurance.flood_coverage.firm_indicator',
    label: 'FIRM Indicator',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'flood_coverage',
    section: 'home',
    order: 7,
    options: [
      { value: 'Pre-Firm', label: 'Pre-Firm' },
      { value: 'Post-Firm', label: 'Post-Firm' }
    ],
    conditional: {
      dependsOn: 'home.current_insurance.flood_coverage.include_flood_coverage',
      when: 'equals',
      value: 'true'
    }
  },

  'home.current_insurance.flood_coverage.rated_as_preferred': {
    key: 'home.current_insurance.flood_coverage.rated_as_preferred',
    label: 'Rated as Preferred Risk',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'flood_coverage',
    section: 'home',
    order: 8,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ],
    conditional: {
      dependsOn: 'home.current_insurance.flood_coverage.include_flood_coverage',
      when: 'equals',
      value: 'true'
    }
  },

  'home.current_insurance.flood_coverage.elevation_difference': {
    key: 'home.current_insurance.flood_coverage.elevation_difference',
    label: 'Elevation Difference',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'flood_coverage',
    section: 'home',
    order: 9,
    options: [
      { value: 'No Elevation Certificate', label: 'No Elevation Certificate' },
      { value: 'Below 0', label: 'Below 0' },
      { value: 'Between 0 and 1', label: 'Between 0 and 1' },
      { value: 'Between 1 and 2', label: 'Between 1 and 2' },
      { value: 'Between 2 and 4', label: 'Between 2 and 4' },
      { value: 'Over 4', label: 'Over 4' }
    ],
    conditional: {
      dependsOn: 'home.current_insurance.flood_coverage.include_flood_coverage',
      when: 'equals',
      value: 'true'
    }
  },

  'home.current_insurance.flood_coverage.has_elevation_certificate': {
    key: 'home.current_insurance.flood_coverage.has_elevation_certificate',
    label: 'Has Elevation Certificate',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'flood_coverage',
    section: 'home',
    order: 10,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ],
    conditional: {
      dependsOn: 'home.current_insurance.flood_coverage.include_flood_coverage',
      when: 'equals',
      value: 'true'
    }
  },

  // HOME - ROOF COVERAGE
  'home.current_insurance.roof_coverage.estimated_roof_replacement_cost': {
    key: 'home.current_insurance.roof_coverage.estimated_roof_replacement_cost',
    label: 'Estimated Roof Replacement Cost',
    inputType: 'currency',
    displayCasing: 'none',
    prefix: '$',
    group: 'roof_coverage',
    section: 'home',
    order: 1
  },

  'home.current_insurance.roof_coverage.actual_cash_value_roof': {
    key: 'home.current_insurance.roof_coverage.actual_cash_value_roof',
    label: 'Actual Cash Value for Roof',
    inputType: 'radio',
    displayCasing: 'title',
    group: 'roof_coverage',
    section: 'home',
    order: 2,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  'home.current_insurance.roof_coverage.roof_deductible_percentage_of_coverage_a': {
    key: 'home.current_insurance.roof_coverage.roof_deductible_percentage_of_coverage_a',
    label: 'Roof Deductible as Percentage of Coverage A',
    inputType: 'text',
    displayCasing: 'none',
    group: 'roof_coverage',
    section: 'home',
    order: 3,
    suffix: '%',
    placeholder: 'Enter percentage (e.g., 2.5)',
    validations: [
      { type: 'pattern', value: '^[0-9]+(\.[0-9]+)?$', message: 'Enter a valid percentage number' }
    ]
  },

  // AUTO POLICY INFORMATION FIELDS
  'auto.desired_policy_start_date': {
    key: 'auto.desired_policy_start_date',
    label: 'Desired Policy Start Date',
    description: 'When you would like your new auto policy to begin',
    inputType: 'date',
    displayCasing: 'none',
    group: 'auto_policy_information',
    section: 'auto',
    order: 1,
    required: true,
    validations: [
      { type: 'required', message: 'Policy start date is required' }
    ]
  },

  'auto.new_policy_term': {
    key: 'auto.new_policy_term',
    label: 'Policy Term',
    description: 'Length of the insurance policy term',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'auto_policy_information',
    section: 'auto',
    order: 2,
    required: true,
    options: [
      { value: '6 months', label: '6 Months' },
      { value: '12 months', label: '12 Months' }
    ],
    validations: [
      { type: 'required', message: 'Policy term is required' }
    ]
  },

  'auto.interested_in_usage_based_discount': {
    key: 'auto.interested_in_usage_based_discount',
    label: 'Interested in Usage-Based Discount',
    description: 'Would you like to be considered for usage-based insurance discounts?',
    inputType: 'radio',
    displayCasing: 'none',
    group: 'auto_policy_information',
    section: 'auto',
    order: 3,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  'auto.wants_electronic_documents': {
    key: 'auto.wants_electronic_documents',
    label: 'Electronic Documents',
    description: 'Would you prefer to receive policy documents electronically?',
    inputType: 'radio',
    displayCasing: 'none',
    group: 'auto_policy_information',
    section: 'auto',
    order: 4,
    options: [
      { value: 'true', label: 'Yes, electronic documents' },
      { value: 'false', label: 'No, paper documents' }
    ]
  },

  // VIOLATIONS & CLAIMS FIELDS
  'auto.violations_claims': {
    key: 'auto.violations_claims',
    label: 'Violations & Claims',
    description: 'List any traffic violations or insurance claims in the past 5 years',
    inputType: 'claims_array',
    displayCasing: 'none',
    group: 'violations_claims',
    section: 'auto',
    order: 1
  },

  // VEHICLE TEMPLATE FIELDS
  'auto.vehicles[*].year': {
    key: 'auto.vehicles[*].year',
    label: 'Year',
    inputType: 'number',
    displayCasing: 'none',
    group: 'vehicle_details',
    section: 'auto',
    order: 3,
    required: true,
    validations: [
      { type: 'required', message: 'Vehicle year is required' },
      { type: 'min', value: 1900, message: 'Year must be 1900 or later' },
      { type: 'max', value: new Date().getFullYear() + 2, message: 'Year cannot be more than 2 years in the future' }
    ]
  },

  'auto.vehicles[*].make': {
    key: 'auto.vehicles[*].make',
    label: 'Make',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'vehicle_details',
    section: 'auto',
    order: 4,
    required: true
  },

  'auto.vehicles[*].model': {
    key: 'auto.vehicles[*].model',
    label: 'Model',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'vehicle_details',
    section: 'auto',
    order: 5,
    required: true
  },

  'auto.vehicles[*].vin': {
    key: 'auto.vehicles[*].vin',
    label: 'Vehicle Identification Number (VIN)',
    inputType: 'vin',
    displayCasing: 'upper',
    inputCasing: 'upper',
    group: 'vehicle_details',
    section: 'auto',
    order: 1,
    placeholder: '1HGBH41JXMN109186',
    required: true,
    validations: [
      { type: 'required', message: 'VIN is required' },
      { type: 'pattern', value: '^[A-HJ-NPR-Z0-9]{17}$', message: 'VIN must be 17 characters' }
    ]
  },

  'auto.vehicles[*].vehicle_type': {
    key: 'auto.vehicles[*].vehicle_type',
    label: 'Vehicle Type',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'vehicle_details',
    section: 'auto',
    order: 2,
    required: true,
    options: [
      { value: 'passenger_car', label: 'Passenger Car' },
      { value: 'suv', label: 'SUV' },
      { value: 'truck', label: 'Truck' },
      { value: 'van', label: 'Van' },
      { value: 'motorcycle', label: 'Motorcycle' },
      { value: 'recreational_vehicle', label: 'Recreational Vehicle' },
      { value: 'other', label: 'Other' }
    ],
    validations: [
      { type: 'required', message: 'Vehicle type is required' }
    ]
  },

  'auto.vehicles[*].purchased_date': {
    key: 'auto.vehicles[*].purchased_date',
    label: 'Purchase Date',
    description: 'When was this vehicle purchased?',
    inputType: 'date',
    displayCasing: 'none',
    group: 'vehicle_details',
    section: 'auto',
    order: 6
  },

  'auto.vehicles[*].original_cost': {
    key: 'auto.vehicles[*].original_cost',
    label: 'Original Cost',
    description: 'Original purchase price of the vehicle',
    inputType: 'currency',
    displayCasing: 'none',
    prefix: '$',
    group: 'vehicle_details',
    section: 'auto',
    order: 7,
    validations: [
      { type: 'min', value: 0, message: 'Cost cannot be negative' }
    ]
  },

  'auto.vehicles[*].base_list_price': {
    key: 'auto.vehicles[*].base_list_price',
    label: 'Base List Price',
    description: 'MSRP or base list price when new',
    inputType: 'currency',
    displayCasing: 'none',
    prefix: '$',
    group: 'vehicle_details',
    section: 'auto',
    order: 8,
    validations: [
      { type: 'min', value: 0, message: 'Price cannot be negative' }
    ]
  },

  'auto.vehicles[*].agreed_value': {
    key: 'auto.vehicles[*].agreed_value',
    label: 'Agreed Value',
    description: 'Agreed upon value for insurance purposes (if applicable)',
    inputType: 'currency',
    displayCasing: 'none',
    prefix: '$',
    group: 'vehicle_details',
    section: 'auto',
    order: 9,
    validations: [
      { type: 'min', value: 0, message: 'Value cannot be negative' }
    ]
  },

  // VEHICLE OWNERSHIP FIELDS
  'auto.vehicles[*].ownership_status': {
    key: 'auto.vehicles[*].ownership_status',
    label: 'Ownership Status',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'vehicle_ownership',
    section: 'auto',
    order: 1,
    required: true,
    options: [
      { value: 'owned', label: 'Owned' },
      { value: 'leased', label: 'Leased' },
      { value: 'financed', label: 'Financed' },
      { value: 'company_owned', label: 'Company Owned' }
    ],
    validations: [
      { type: 'required', message: 'Ownership status is required' }
    ]
  },

  'auto.vehicles[*].primary_driver': {
    key: 'auto.vehicles[*].primary_driver',
    label: 'Primary Driver',
    description: 'Who is the primary driver of this vehicle?',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'vehicle_ownership',
    section: 'auto',
    order: 2,
    required: true,
    validations: [
      { type: 'required', message: 'Primary driver is required' }
    ]
  },

  'auto.vehicles[*].registered_owner': {
    key: 'auto.vehicles[*].registered_owner',
    label: 'Registered Owner',
    description: 'Name on the vehicle registration',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'vehicle_ownership',
    section: 'auto',
    order: 3,
    required: true,
    validations: [
      { type: 'required', message: 'Registered owner is required' }
    ]
  },

  'auto.vehicles[*].ownership_duration': {
    key: 'auto.vehicles[*].ownership_duration',
    label: 'How Long Owned',
    description: 'How long have you owned/had this vehicle?',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'vehicle_ownership',
    section: 'auto',
    order: 4,
    options: [
      { value: 'less_than_1_year', label: 'Less than 1 year' },
      { value: '1_to_3_years', label: '1-3 years' },
      { value: '3_to_5_years', label: '3-5 years' },
      { value: '5_to_10_years', label: '5-10 years' },
      { value: 'more_than_10_years', label: 'More than 10 years' }
    ]
  },

  'auto.vehicles[*].is_rented_leased_for_fee': {
    key: 'auto.vehicles[*].is_rented_leased_for_fee',
    label: 'Rented or Leased for Fee',
    description: 'Is this vehicle rented or leased out to others for a fee?',
    inputType: 'radio',
    displayCasing: 'none',
    group: 'vehicle_ownership',
    section: 'auto',
    order: 5,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  'auto.vehicles[*].is_weight_between_14k_16k_and_used_for_farm': {
    key: 'auto.vehicles[*].is_weight_between_14k_16k_and_used_for_farm',
    label: 'Farm Vehicle (14k-16k lbs)',
    description: 'Is this vehicle between 14,000-16,000 lbs and used for farming?',
    inputType: 'radio',
    displayCasing: 'none',
    group: 'vehicle_ownership',
    section: 'auto',
    order: 6,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  'auto.vehicles[*].is_camper_unit_included': {
    key: 'auto.vehicles[*].is_camper_unit_included',
    label: 'Camper Unit Included',
    description: 'Does this vehicle include a camper unit?',
    inputType: 'radio',
    displayCasing: 'none',
    group: 'vehicle_ownership',
    section: 'auto',
    order: 7,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  // VEHICLE USAGE FIELDS
  'auto.vehicles[*].primary_use': {
    key: 'auto.vehicles[*].primary_use',
    label: 'Primary Use',
    description: 'How is this vehicle primarily used?',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'vehicle_usage',
    section: 'auto',
    order: 1,
    required: true,
    options: [
      { value: 'pleasure', label: 'Pleasure/Personal' },
      { value: 'commute', label: 'Commute to Work/School' },
      { value: 'business', label: 'Business Use' },
      { value: 'farm', label: 'Farm Use' },
      { value: 'commercial', label: 'Commercial Use' }
    ],
    validations: [
      { type: 'required', message: 'Primary use is required' }
    ]
  },

  'auto.vehicles[*].distance_to_work_or_school': {
    key: 'auto.vehicles[*].distance_to_work_or_school',
    label: 'Distance to Work/School',
    description: 'One-way distance to work or school (miles)',
    inputType: 'number',
    displayCasing: 'none',
    suffix: ' miles',
    group: 'vehicle_usage',
    section: 'auto',
    order: 2,
    validations: [
      { type: 'min', value: 0, message: 'Distance cannot be negative' },
      { type: 'max', value: 500, message: 'Distance seems unusually high' }
    ]
  },

  'auto.vehicles[*].days_driven_per_week': {
    key: 'auto.vehicles[*].days_driven_per_week',
    label: 'Days Driven Per Week',
    description: 'How many days per week is this vehicle typically driven?',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'vehicle_usage',
    section: 'auto',
    order: 3,
    options: [
      { value: '1', label: '1 day' },
      { value: '2', label: '2 days' },
      { value: '3', label: '3 days' },
      { value: '4', label: '4 days' },
      { value: '5', label: '5 days' },
      { value: '6', label: '6 days' },
      { value: '7', label: '7 days' }
    ]
  },

  'auto.vehicles[*].annual_mileage': {
    key: 'auto.vehicles[*].annual_mileage',
    label: 'Annual Mileage',
    description: 'Estimated miles driven per year',
    inputType: 'number',
    displayCasing: 'none',
    suffix: ' miles/year',
    group: 'vehicle_usage',
    section: 'auto',
    order: 4,
    required: true,
    validations: [
      { type: 'required', message: 'Annual mileage is required' },
      { type: 'min', value: 0, message: 'Mileage cannot be negative' },
      { type: 'max', value: 100000, message: 'Mileage seems unusually high' }
    ]
  },

  'auto.vehicles[*].used_for_rideshare': {
    key: 'auto.vehicles[*].used_for_rideshare',
    label: 'Used for Rideshare',
    description: 'Is this vehicle used for rideshare services (Uber, Lyft, etc.)?',
    inputType: 'radio',
    displayCasing: 'none',
    group: 'vehicle_usage',
    section: 'auto',
    order: 5,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  // VEHICLE FEATURES FIELDS
  'auto.vehicles[*].suspension_indicator': {
    key: 'auto.vehicles[*].suspension_indicator',
    label: 'Suspension Type',
    description: 'Type of suspension system',
    inputType: 'dropdown',
    displayCasing: 'title',
    group: 'vehicle_features',
    section: 'auto',
    order: 1,
    options: [
      { value: 'standard', label: 'Standard' },
      { value: 'air', label: 'Air Suspension' },
      { value: 'sport', label: 'Sport Suspension' },
      { value: 'lowered', label: 'Lowered' },
      { value: 'lifted', label: 'Lifted' },
      { value: 'unknown', label: 'Unknown' }
    ]
  },

  'auto.vehicles[*].has_anti_theft_device': {
    key: 'auto.vehicles[*].has_anti_theft_device',
    label: 'Anti-Theft Device',
    description: 'Does this vehicle have an anti-theft device?',
    inputType: 'radio',
    displayCasing: 'none',
    group: 'vehicle_features',
    section: 'auto',
    order: 2,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  'auto.vehicles[*].has_anti_lock_brakes': {
    key: 'auto.vehicles[*].has_anti_lock_brakes',
    label: 'Anti-Lock Brakes (ABS)',
    description: 'Does this vehicle have anti-lock brakes?',
    inputType: 'radio',
    displayCasing: 'none',
    group: 'vehicle_features',
    section: 'auto',
    order: 3,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  // GARAGING ADDRESS FIELDS
  'auto.vehicles[*].garaging_address_street': {
    key: 'auto.vehicles[*].garaging_address_street',
    label: 'Garaging Street Address',
    description: 'Where is this vehicle primarily kept overnight?',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'garaging_address',
    section: 'auto',
    order: 1,
    required: true,
    validations: [
      { type: 'required', message: 'Garaging address is required' }
    ]
  },

  'auto.vehicles[*].garaging_address_apt_unit': {
    key: 'auto.vehicles[*].garaging_address_apt_unit',
    label: 'Apt/Unit',
    inputType: 'text',
    displayCasing: 'upper',
    inputCasing: 'upper',
    group: 'garaging_address',
    section: 'auto',
    order: 2
  },

  'auto.vehicles[*].garaging_address_city': {
    key: 'auto.vehicles[*].garaging_address_city',
    label: 'City',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'garaging_address',
    section: 'auto',
    order: 3,
    required: true,
    validations: [
      { type: 'required', message: 'City is required' }
    ]
  },

  'auto.vehicles[*].garaging_address_state': {
    key: 'auto.vehicles[*].garaging_address_state',
    label: 'State',
    inputType: 'dropdown',
    displayCasing: 'upper',
    group: 'garaging_address',
    section: 'auto',
    order: 4,
    required: true,
    options: [
      { value: 'AL', label: 'Alabama' },
      { value: 'AK', label: 'Alaska' },
      { value: 'AZ', label: 'Arizona' },
      { value: 'AR', label: 'Arkansas' },
      { value: 'CA', label: 'California' },
      { value: 'CO', label: 'Colorado' },
      { value: 'CT', label: 'Connecticut' },
      { value: 'DE', label: 'Delaware' },
      { value: 'FL', label: 'Florida' },
      { value: 'GA', label: 'Georgia' },
      { value: 'HI', label: 'Hawaii' },
      { value: 'ID', label: 'Idaho' },
      { value: 'IL', label: 'Illinois' },
      { value: 'IN', label: 'Indiana' },
      { value: 'IA', label: 'Iowa' },
      { value: 'KS', label: 'Kansas' },
      { value: 'KY', label: 'Kentucky' },
      { value: 'LA', label: 'Louisiana' },
      { value: 'ME', label: 'Maine' },
      { value: 'MD', label: 'Maryland' },
      { value: 'MA', label: 'Massachusetts' },
      { value: 'MI', label: 'Michigan' },
      { value: 'MN', label: 'Minnesota' },
      { value: 'MS', label: 'Mississippi' },
      { value: 'MO', label: 'Missouri' },
      { value: 'MT', label: 'Montana' },
      { value: 'NE', label: 'Nebraska' },
      { value: 'NV', label: 'Nevada' },
      { value: 'NH', label: 'New Hampshire' },
      { value: 'NJ', label: 'New Jersey' },
      { value: 'NM', label: 'New Mexico' },
      { value: 'NY', label: 'New York' },
      { value: 'NC', label: 'North Carolina' },
      { value: 'ND', label: 'North Dakota' },
      { value: 'OH', label: 'Ohio' },
      { value: 'OK', label: 'Oklahoma' },
      { value: 'OR', label: 'Oregon' },
      { value: 'PA', label: 'Pennsylvania' },
      { value: 'RI', label: 'Rhode Island' },
      { value: 'SC', label: 'South Carolina' },
      { value: 'SD', label: 'South Dakota' },
      { value: 'TN', label: 'Tennessee' },
      { value: 'TX', label: 'Texas' },
      { value: 'UT', label: 'Utah' },
      { value: 'VT', label: 'Vermont' },
      { value: 'VA', label: 'Virginia' },
      { value: 'WA', label: 'Washington' },
      { value: 'WV', label: 'West Virginia' },
      { value: 'WI', label: 'Wisconsin' },
      { value: 'WY', label: 'Wyoming' }
    ],
    validations: [
      { type: 'required', message: 'State is required' }
    ]
  },

  'auto.vehicles[*].garaging_address_zip': {
    key: 'auto.vehicles[*].garaging_address_zip',
    label: 'ZIP Code',
    inputType: 'zip',
    displayCasing: 'none',
    group: 'garaging_address',
    section: 'auto',
    order: 5,
    required: true,
    validations: [
      { type: 'required', message: 'ZIP code is required' },
      { type: 'pattern', value: '^[0-9]{5}(-[0-9]{4})?$', message: 'Enter a valid ZIP code' }
    ]
  },

  // VEHICLE COVERAGES FIELDS
  'auto.vehicles[*].coverages.collision': {
    key: 'auto.vehicles[*].coverages.collision',
    label: 'Collision Coverage',
    description: 'Coverage for damage to your vehicle from collisions',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'vehicle_coverages',
    section: 'auto',
    order: 1,
    options: [
      { value: 'none', label: 'No Coverage' },
      { value: '100', label: '$100 Deductible' },
      { value: '250', label: '$250 Deductible' },
      { value: '500', label: '$500 Deductible' },
      { value: '1000', label: '$1,000 Deductible' },
      { value: '2500', label: '$2,500 Deductible' }
    ]
  },

  'auto.vehicles[*].coverages.comprehensive': {
    key: 'auto.vehicles[*].coverages.comprehensive',
    label: 'Comprehensive Coverage',
    description: 'Coverage for damage from theft, vandalism, weather, etc.',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'vehicle_coverages',
    section: 'auto',
    order: 2,
    options: [
      { value: 'none', label: 'No Coverage' },
      { value: '100', label: '$100 Deductible' },
      { value: '250', label: '$250 Deductible' },
      { value: '500', label: '$500 Deductible' },
      { value: '1000', label: '$1,000 Deductible' },
      { value: '2500', label: '$2,500 Deductible' }
    ]
  },

  'auto.vehicles[*].coverages.auto_loan_lease': {
    key: 'auto.vehicles[*].coverages.auto_loan_lease',
    label: 'Auto Loan/Lease Coverage',
    description: 'Gap coverage for financed or leased vehicles',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'vehicle_coverages',
    section: 'auto',
    order: 3,
    options: [
      { value: 'none', label: 'No Coverage' },
      { value: 'gap_coverage', label: 'Gap Coverage' },
      { value: 'loan_lease_payoff', label: 'Loan/Lease Payoff' }
    ]
  },

  'auto.vehicles[*].coverages.roadside_assistance': {
    key: 'auto.vehicles[*].coverages.roadside_assistance',
    label: 'Roadside Assistance',
    description: 'Emergency roadside assistance coverage',
    inputType: 'radio',
    displayCasing: 'none',
    group: 'vehicle_coverages',
    section: 'auto',
    order: 4,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  'auto.vehicles[*].coverages.rental_transportation_expense': {
    key: 'auto.vehicles[*].coverages.rental_transportation_expense',
    label: 'Rental/Transportation Expense',
    description: 'Coverage for rental car expenses when your car is being repaired',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'vehicle_coverages',
    section: 'auto',
    order: 5,
    options: [
      { value: 'none', label: 'No Coverage' },
      { value: '30_per_day_900_max', label: '$30/day, $900 max' },
      { value: '40_per_day_1200_max', label: '$40/day, $1,200 max' },
      { value: '50_per_day_1500_max', label: '$50/day, $1,500 max' },
      { value: '75_per_day_2250_max', label: '$75/day, $2,250 max' }
    ]
  },

  'auto.vehicles[*].coverages.towing': {
    key: 'auto.vehicles[*].coverages.towing',
    label: 'Towing Coverage',
    description: 'Coverage for towing expenses',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'vehicle_coverages',
    section: 'auto',
    order: 6,
    options: [
      { value: 'none', label: 'No Coverage' },
      { value: '25', label: '$25 per occurrence' },
      { value: '50', label: '$50 per occurrence' },
      { value: '100', label: '$100 per occurrence' },
      { value: '200', label: '$200 per occurrence' }
    ]
  },

  'auto.vehicles[*].coverages.customized_equipment': {
    key: 'auto.vehicles[*].coverages.customized_equipment',
    label: 'Customized Equipment',
    description: 'Coverage for custom parts and equipment',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'vehicle_coverages',
    section: 'auto',
    order: 7,
    options: [
      { value: 'none', label: 'No Coverage' },
      { value: '1000', label: '$1,000' },
      { value: '2500', label: '$2,500' },
      { value: '5000', label: '$5,000' },
      { value: '10000', label: '$10,000' }
    ]
  },

  'auto.vehicles[*].coverages.custom_audio_system': {
    key: 'auto.vehicles[*].coverages.custom_audio_system',
    label: 'Custom Audio System',
    description: 'Coverage for aftermarket audio equipment',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'vehicle_coverages',
    section: 'auto',
    order: 8,
    options: [
      { value: 'none', label: 'No Coverage' },
      { value: '500', label: '$500' },
      { value: '1000', label: '$1,000' },
      { value: '2500', label: '$2,500' },
      { value: '5000', label: '$5,000' }
    ]
  },

  'auto.vehicles[*].coverages.auto_replacement': {
    key: 'auto.vehicles[*].coverages.auto_replacement',
    label: 'Auto Replacement Coverage',
    description: 'New car replacement coverage for new vehicles',
    inputType: 'radio',
    displayCasing: 'none',
    group: 'vehicle_coverages',
    section: 'auto',
    order: 9,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  'auto.vehicles[*].coverages.original_equipment_manufacturers_coverage': {
    key: 'auto.vehicles[*].coverages.original_equipment_manufacturers_coverage',
    label: 'OEM Parts Coverage',
    description: 'Original equipment manufacturer parts coverage',
    inputType: 'radio',
    displayCasing: 'none',
    group: 'vehicle_coverages',
    section: 'auto',
    order: 10,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  'auto.vehicles[*].coverages.mexico_coverage': {
    key: 'auto.vehicles[*].coverages.mexico_coverage',
    label: 'Mexico Coverage',
    description: 'Coverage when driving in Mexico',
    inputType: 'radio',
    displayCasing: 'none',
    group: 'vehicle_coverages',
    section: 'auto',
    order: 11,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  'auto.vehicles[*].coverages.ride_sharing': {
    key: 'auto.vehicles[*].coverages.ride_sharing',
    label: 'Rideshare Coverage',
    description: 'Coverage for rideshare driving (Uber, Lyft, etc.)',
    inputType: 'radio',
    displayCasing: 'none',
    group: 'vehicle_coverages',
    section: 'auto',
    order: 12,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  'auto.vehicles[*].coverages.portable_electronic_media': {
    key: 'auto.vehicles[*].coverages.portable_electronic_media',
    label: 'Portable Electronic Media',
    description: 'Coverage for portable electronic devices',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'vehicle_coverages',
    section: 'auto',
    order: 13,
    options: [
      { value: 'none', label: 'No Coverage' },
      { value: '500', label: '$500' },
      { value: '1000', label: '$1,000' },
      { value: '1500', label: '$1,500' }
    ]
  },

  'auto.vehicles[*].coverages.trip_interruption': {
    key: 'auto.vehicles[*].coverages.trip_interruption',
    label: 'Trip Interruption',
    description: 'Coverage for expenses when trips are interrupted due to vehicle breakdown',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'vehicle_coverages',
    section: 'auto',
    order: 14,
    options: [
      { value: 'none', label: 'No Coverage' },
      { value: '500', label: '$500' },
      { value: '750', label: '$750' },
      { value: '1000', label: '$1,000' }
    ]
  },

  'auto.vehicles[*].coverages.diminishing_deductible': {
    key: 'auto.vehicles[*].coverages.diminishing_deductible',
    label: 'Diminishing Deductible',
    description: 'Deductible reduces over time with claim-free driving',
    inputType: 'radio',
    displayCasing: 'none',
    group: 'vehicle_coverages',
    section: 'auto',
    order: 15,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  // CURRENT INSURANCE DETAILS
  'auto.current_insurance.has_current_insurance': {
    key: 'auto.current_insurance.has_current_insurance',
    label: 'Currently Have Auto Insurance',
    description: 'Do you currently have auto insurance?',
    inputType: 'radio',
    displayCasing: 'none',
    group: 'current_insurance_details',
    section: 'auto',
    order: 1,
    required: true,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ],
    validations: [
      { type: 'required', message: 'Please indicate if you have current insurance' }
    ]
  },

  'auto.current_insurance.has_prior_30_days_insurance': {
    key: 'auto.current_insurance.has_prior_30_days_insurance',
    label: 'Had Insurance in Past 30 Days',
    description: 'Have you had auto insurance in the past 30 days?',
    inputType: 'radio',
    displayCasing: 'none',
    group: 'current_insurance_details',
    section: 'auto',
    order: 2,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  'auto.current_insurance.continuous_insurance_duration': {
    key: 'auto.current_insurance.continuous_insurance_duration',
    label: 'Continuous Insurance Duration',
    description: 'How long have you had continuous auto insurance coverage?',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'current_insurance_details',
    section: 'auto',
    order: 3,
    options: [
      { value: 'less_than_6_months', label: 'Less than 6 months' },
      { value: '6_months_to_1_year', label: '6 months to 1 year' },
      { value: '1_to_3_years', label: '1 to 3 years' },
      { value: '3_to_5_years', label: '3 to 5 years' },
      { value: '5_plus_years', label: '5+ years' }
    ]
  },

  'auto.current_insurance.carrier_name': {
    key: 'auto.current_insurance.carrier_name',
    label: 'Current Insurance Carrier',
    description: 'Name of your current auto insurance company',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'current_insurance_details',
    section: 'auto',
    order: 4
  },

  'auto.current_insurance.policy_number': {
    key: 'auto.current_insurance.policy_number',
    label: 'Policy Number',
    description: 'Current auto insurance policy number',
    inputType: 'text',
    displayCasing: 'upper',
    inputCasing: 'upper',
    group: 'current_insurance_details',
    section: 'auto',
    order: 5
  },

  'auto.current_insurance.writing_company': {
    key: 'auto.current_insurance.writing_company',
    label: 'Writing Company',
    description: 'The insurance company that underwrites the policy',
    inputType: 'text',
    displayCasing: 'title',
    inputCasing: 'title',
    group: 'current_insurance_details',
    section: 'auto',
    order: 6
  },

  'auto.current_insurance.premium': {
    key: 'auto.current_insurance.premium',
    label: 'Current Premium',
    description: 'Current premium amount',
    inputType: 'currency',
    displayCasing: 'none',
    prefix: '$',
    group: 'current_insurance_details',
    section: 'auto',
    order: 7,
    validations: [
      { type: 'min', value: 0, message: 'Premium cannot be negative' }
    ]
  },

  'auto.current_insurance.term_start_date': {
    key: 'auto.current_insurance.term_start_date',
    label: 'Term Start Date',
    description: 'When did your current policy term start?',
    inputType: 'date',
    displayCasing: 'none',
    group: 'current_insurance_details',
    section: 'auto',
    order: 8
  },

  'auto.current_insurance.term_expiration_date': {
    key: 'auto.current_insurance.term_expiration_date',
    label: 'Term Expiration Date',
    description: 'When does your current policy term expire?',
    inputType: 'date',
    displayCasing: 'none',
    group: 'current_insurance_details',
    section: 'auto',
    order: 9
  },

  'auto.current_insurance.time_with_carrier': {
    key: 'auto.current_insurance.time_with_carrier',
    label: 'Time with Current Carrier',
    description: 'How long have you been with your current insurance carrier?',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'current_insurance_details',
    section: 'auto',
    order: 10,
    options: [
      { value: 'less_than_6_months', label: 'Less than 6 months' },
      { value: '6_months_to_1_year', label: '6 months to 1 year' },
      { value: '1_to_2_years', label: '1 to 2 years' },
      { value: '2_to_3_years', label: '2 to 3 years' },
      { value: '3_to_5_years', label: '3 to 5 years' },
      { value: '5_plus_years', label: '5+ years' }
    ]
  },

  'auto.current_insurance.reason_for_no_insurance': {
    key: 'auto.current_insurance.reason_for_no_insurance',
    label: 'Reason for No Insurance',
    description: 'If you do not have current insurance, why?',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'current_insurance_details',
    section: 'auto',
    order: 11,
    options: [
      { value: 'new_driver', label: 'New driver' },
      { value: 'no_vehicle', label: 'Did not own a vehicle' },
      { value: 'cost', label: 'Cost too high' },
      { value: 'cancelled_non_payment', label: 'Policy cancelled for non-payment' },
      { value: 'cancelled_other', label: 'Policy cancelled for other reasons' },
      { value: 'military_deployment', label: 'Military deployment' },
      { value: 'other', label: 'Other' }
    ]
  },

  // AUTO COVERAGE - POLICY COVERAGES
  'auto.current_insurance.policy_coverages.bodily_injury': {
    key: 'auto.current_insurance.policy_coverages.bodily_injury',
    label: 'Bodily Injury Liability',
    description: 'Coverage for injuries caused to others in an accident',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'current_insurance_details',
    section: 'auto',
    order: 12,
    dependsOnStateFrom: 'client.current_address.state',
    stateSpecificOptions: {
      'FL': [
        { value: '10000/20000', label: '$10,000/$20,000' },
        { value: '25000/50000', label: '$25,000/$50,000' },
        { value: '50000/100000', label: '$50,000/$100,000' },
        { value: '100000/300000', label: '$100,000/$300,000' }
      ],
      'CA': [
        { value: '15000/30000', label: '$15,000/$30,000' },
        { value: '30000/60000', label: '$30,000/$60,000' },
        { value: '50000/100000', label: '$50,000/$100,000' },
        { value: '100000/300000', label: '$100,000/$300,000' },
        { value: '250000/500000', label: '$250,000/$500,000' }
      ],
      'NY': [
        { value: '25000/50000', label: '$25,000/$50,000' },
        { value: '50000/100000', label: '$50,000/$100,000' },
        { value: '100000/300000', label: '$100,000/$300,000' },
        { value: '250000/500000', label: '$250,000/$500,000' },
        { value: '500000/1000000', label: '$500,000/$1,000,000' }
      ],
      default: [
        { value: '25000/50000', label: '$25,000/$50,000' },
        { value: '50000/100000', label: '$50,000/$100,000' },
        { value: '100000/300000', label: '$100,000/$300,000' },
        { value: '250000/500000', label: '$250,000/$500,000' },
        { value: '500000/1000000', label: '$500,000/$1,000,000' }
      ]
    }
  },

  'auto.current_insurance.policy_coverages.property_damage_liability': {
    key: 'auto.current_insurance.policy_coverages.property_damage_liability',
    label: 'Property Damage Liability',
    description: 'Coverage for property damage caused to others',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'current_insurance_details',
    section: 'auto',
    order: 13,
    options: [
      { value: '10000', label: '$10,000' },
      { value: '15000', label: '$15,000' },
      { value: '25000', label: '$25,000' },
      { value: '50000', label: '$50,000' },
      { value: '100000', label: '$100,000' },
      { value: '250000', label: '$250,000' },
      { value: '500000', label: '$500,000' }
    ]
  },

  'auto.current_insurance.policy_coverages.medical_payments': {
    key: 'auto.current_insurance.policy_coverages.medical_payments',
    label: 'Medical Payments',
    description: 'Coverage for medical expenses regardless of fault',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'current_insurance_details',
    section: 'auto',
    order: 14,
    options: [
      { value: 'none', label: 'No Coverage' },
      { value: '1000', label: '$1,000' },
      { value: '2500', label: '$2,500' },
      { value: '5000', label: '$5,000' },
      { value: '10000', label: '$10,000' },
      { value: '25000', label: '$25,000' }
    ]
  },

  'auto.current_insurance.policy_coverages.uninsured_motorists_bodily_injury': {
    key: 'auto.current_insurance.policy_coverages.uninsured_motorists_bodily_injury',
    label: 'Uninsured Motorist Bodily Injury',
    description: 'Coverage when injured by uninsured drivers',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'current_insurance_details',
    section: 'auto',
    order: 15,
    options: [
      { value: 'none', label: 'No Coverage' },
      { value: '15000_30000', label: '$15,000/$30,000' },
      { value: '25000_50000', label: '$25,000/$50,000' },
      { value: '50000_100000', label: '$50,000/$100,000' },
      { value: '100000_300000', label: '$100,000/$300,000' },
      { value: '250000_500000', label: '$250,000/$500,000' }
    ]
  },

  'auto.current_insurance.policy_coverages.underinsured_motorists_bodily_injury': {
    key: 'auto.current_insurance.policy_coverages.underinsured_motorists_bodily_injury',
    label: 'Underinsured Motorist Bodily Injury',
    description: 'Coverage when injured by drivers with insufficient insurance',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'current_insurance_details',
    section: 'auto',
    order: 16,
    options: [
      { value: 'none', label: 'No Coverage' },
      { value: '15000_30000', label: '$15,000/$30,000' },
      { value: '25000_50000', label: '$25,000/$50,000' },
      { value: '50000_100000', label: '$50,000/$100,000' },
      { value: '100000_300000', label: '$100,000/$300,000' },
      { value: '250000_500000', label: '$250,000/$500,000' }
    ]
  },

  'auto.current_insurance.policy_coverages.extended_non_owned_liability': {
    key: 'auto.current_insurance.policy_coverages.extended_non_owned_liability',
    label: 'Extended Non-Owned Liability',
    description: 'Coverage when driving vehicles you do not own',
    inputType: 'radio',
    displayCasing: 'none',
    group: 'current_insurance_details',
    section: 'auto',
    order: 17,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  'auto.current_insurance.policy_coverages.first_accident_forgiveness': {
    key: 'auto.current_insurance.policy_coverages.first_accident_forgiveness',
    label: 'First Accident Forgiveness',
    description: 'Forgiveness for your first at-fault accident',
    inputType: 'radio',
    displayCasing: 'none',
    group: 'current_insurance_details',
    section: 'auto',
    order: 18,
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },

  'auto.current_insurance.policy_coverages.personal_injury_protection': {
    key: 'auto.current_insurance.policy_coverages.personal_injury_protection',
    label: 'Personal Injury Protection (PIP)',
    description: 'Coverage for medical expenses and lost wages regardless of fault',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'current_insurance_details',
    section: 'auto',
    order: 19,
    options: [
      { value: 'none', label: 'No Coverage' },
      { value: '2500', label: '$2,500' },
      { value: '5000', label: '$5,000' },
      { value: '10000', label: '$10,000' },
      { value: '25000', label: '$25,000' },
      { value: '50000', label: '$50,000' }
    ]
  },

  'auto.current_insurance.policy_coverages.uninsured_motorist_property_damage': {
    key: 'auto.current_insurance.policy_coverages.uninsured_motorist_property_damage',
    label: 'Uninsured Motorist Property Damage',
    description: 'Coverage for vehicle damage caused by uninsured drivers',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'current_insurance_details',
    section: 'auto',
    order: 20,
    options: [
      { value: 'none', label: 'No Coverage' },
      { value: '10000', label: '$10,000' },
      { value: '15000', label: '$15,000' },
      { value: '25000', label: '$25,000' },
      { value: '50000', label: '$50,000' }
    ]
  },

  'auto.current_insurance.policy_coverages.underinsured_motorist_property_damage': {
    key: 'auto.current_insurance.policy_coverages.underinsured_motorist_property_damage',
    label: 'Underinsured Motorist Property Damage',
    description: 'Coverage for vehicle damage caused by drivers with insufficient insurance',
    inputType: 'dropdown',
    displayCasing: 'none',
    group: 'current_insurance_details',
    section: 'auto',
    order: 21,
    options: [
      { value: 'none', label: 'No Coverage' },
      { value: '10000', label: '$10,000' },
      { value: '15000', label: '$15,000' },
      { value: '25000', label: '$25,000' },
      { value: '50000', label: '$50,000' }
    ]
  }
  
};

// Helper function to get configuration for a field
export const getFieldConfig = (fieldKey: string): FieldConfiguration | null => {
  return FIELD_CONFIGURATIONS[fieldKey] || null;
};

// NEW: Helper function to get field schema for claims arrays
export const getClaimsArraySchema = (fieldKey: string) => {
  if (fieldKey.includes('violations_claims')) {
    return VIOLATIONS_CLAIMS_FIELD_SCHEMA;
  }
  if (fieldKey.includes('claims') && !fieldKey.includes('prior_carriers')) {
    return CLAIMS_FIELD_SCHEMA;
  }
  if (fieldKey.includes('prior_carriers')) {
    return PRIOR_CARRIERS_FIELD_SCHEMA;
  }
  return null;
};

// NEW: Helper function to get state-specific options for a field
export const getFieldOptions = (
  fieldConfig: FieldConfiguration, 
  auditData: any
): DropdownOption[] => {
  // If field has static options, use those
  if (fieldConfig.options) {
    return fieldConfig.options;
  }
  
  // If field has state-specific options, determine which ones to use
  if (fieldConfig.stateSpecificOptions && fieldConfig.dependsOnStateFrom) {
    const stateFieldValue = getNestedValue(auditData, fieldConfig.dependsOnStateFrom);
    const stateCode = stateFieldValue?.toUpperCase();
    
    if (stateCode && fieldConfig.stateSpecificOptions[stateCode]) {
      return fieldConfig.stateSpecificOptions[stateCode];
    }
    
    // Fallback to default options
    return fieldConfig.stateSpecificOptions.default;
  }
  
  return [];
};

// Helper function to get nested values from object using dot notation
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
};

// Helper function to get fields by section and group, sorted by order
export const getFieldsBySection = (section: 'applicant' | 'home' | 'auto'): FieldConfiguration[] => {
  return Object.values(FIELD_CONFIGURATIONS)
    .filter(field => field.section === section)
    .sort((a, b) => {
      // First sort by group order, then by field order within group
      const groupA = FIELD_GROUPS[a.group || '']?.order || 999;
      const groupB = FIELD_GROUPS[b.group || '']?.order || 999;
      
      if (groupA !== groupB) return groupA - groupB;
      return a.order - b.order;
    });
};

// Helper function to get fields grouped by their group
export const getFieldsGrouped = (section: 'applicant' | 'home' | 'auto'): Record<string, FieldConfiguration[]> => {
  const fields = getFieldsBySection(section);
  const grouped: Record<string, FieldConfiguration[]> = {};
  
  fields.forEach(field => {
    const groupId = field.group || 'ungrouped';
    if (!grouped[groupId]) {
      grouped[groupId] = [];
    }
    grouped[groupId].push(field);
  });
  
  return grouped;
};

// Helper function to match template fields to actual data fields
export const getFieldConfigForDataField = (dataFieldKey: string): FieldConfiguration | null => {
  // First try exact match
  if (FIELD_CONFIGURATIONS[dataFieldKey]) {
    return FIELD_CONFIGURATIONS[dataFieldKey];
  }
  
  // Then try template matching
  for (const [templateKey, config] of Object.entries(FIELD_CONFIGURATIONS)) {
    if (templateKey.includes('[*]')) {
      const pattern = templateKey.replace(/\[(\*|\d+)\]/g, '\\[\\d+\\]');
      const regex = new RegExp(`^${pattern}$`);
      
      if (regex.test(dataFieldKey)) {
        // Extract index from actual field key
        const indexMatch = dataFieldKey.match(/\[(\d+)\]/);
        const index = indexMatch ? parseInt(indexMatch[1]) : 0;
        
        // Create a new config with the actual field key and dynamic group
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

// Helper function to create dynamic groups at runtime
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

// Helper function to build hierarchical group structure
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

// Helper function to get fields organized by hierarchical groups
export const getFieldsHierarchical = (section: 'applicant' | 'home' | 'auto', auditData: any) => {
  const templateGroups = Object.values(FIELD_GROUPS).filter(g => g.isTemplate);
  const dynamicGroups = createDynamicGroups(auditData, templateGroups);
  const { topLevel, hierarchy } = buildGroupHierarchy(FIELD_GROUPS, dynamicGroups);
  
  return { topLevel, hierarchy, dynamicGroups };
}; 