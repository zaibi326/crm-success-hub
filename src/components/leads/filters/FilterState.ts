
export interface FilterState {
  createdBy: string;
  createdOnStart: string;
  createdOnEnd: string;
  createdVia: string;
  leadStatus: string;
  tags: string[];
  sellerContact: string;
  leadManager: string;
  moveTo: string;
  minArrears: number | undefined;
  maxArrears: number | undefined;
  // Add missing properties for PodioFilterPanel
  name: string;
  address: string;
  score: number;
}

export const createEmptyFilterState = (): FilterState => ({
  createdBy: '',
  createdOnStart: '',
  createdOnEnd: '',
  createdVia: '',
  leadStatus: '',
  tags: [],
  sellerContact: '',
  leadManager: '',
  moveTo: '',
  minArrears: undefined,
  maxArrears: undefined,
  name: '',
  address: '',
  score: 50,
});
