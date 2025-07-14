
export interface FilterCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
  label?: string;
}

export interface FilterComponentProps {
  onAddFilter: (field: string, operator: string, value: string, label: string) => void;
}
