
export interface FilterCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
  label: string; // Made required to match usage in other files
}

export interface FilterComponentProps {
  onAddFilter: (field: string, operator: string, value: string, label: string) => void;
}
