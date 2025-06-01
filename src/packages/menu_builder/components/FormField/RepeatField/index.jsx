// index.js - Main export file
export { default } from './RepeatField';

// Export individual components for potential reuse
export { default as FieldLabel } from './base/FieldLabel';
export { default as SmallInput } from './base/SmallInput';
export { default as SmallTextarea } from './base/SmallTextarea';
export { default as BaseSelect } from './base/BaseSelect';
export { default as BaseCheckbox } from './base/BaseCheckbox';

export { default as SchemaDisplay } from './components/SchemaDisplay';
export { default as FieldTypeSelector } from './components/FieldTypeSelector';
export { default as AddFieldModal } from './components/AddFieldModal';
export { default as RepeatFieldItem } from './components/RepeatFieldItem';
export { default as RepeatSubField } from './components/RepeatSubField';
export { default as EmptyRepeatState } from './components/EmptyRepeatState';

export { useRepeatField } from './hooks/useRepeatField';

// Export constants
export { STYLES } from './constants/styles';
export { FIELD_TYPES } from './constants/fieldTypes';

// Export utilities
export { createEmptyItem } from './utils/createEmptyItem';
export { validateSelectedFields } from './utils/validateFields';
export { processSelectedFields } from './utils/processFields';