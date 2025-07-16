
export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  url: string;
  size?: number;
  category: 'probate' | 'vesting_deed' | 'other' | 'death' | 'lawsuit' | 'taxing_entities';
}

export interface AttachmentsSectionProps {
  files: UploadedFile[];
  onRemoveFile: (fileId: string) => void;
  onFileUpload?: (files: File[], category: 'probate' | 'vesting_deed' | 'other' | 'death' | 'lawsuit' | 'taxing_entities') => void;
  canEdit: boolean;
}
