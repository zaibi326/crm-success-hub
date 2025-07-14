
import { FileIcon, Image, FileText, File } from 'lucide-react';

export const getFileIcon = (type: string, fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  if (type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension || '')) {
    return Image;
  }
  
  if (type === 'application/pdf' || extension === 'pdf') {
    return FileText;
  }
  
  if (['doc', 'docx'].includes(extension || '') || type.includes('document')) {
    return FileText;
  }
  
  return File;
};

export const getFileFormat = (type: string, fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  if (type === 'application/pdf' || extension === 'pdf') return 'PDF';
  if (['doc', 'docx'].includes(extension || '')) return 'DOC';
  if (['jpg', 'jpeg'].includes(extension || '')) return 'JPG';
  if (extension === 'png') return 'PNG';
  if (extension === 'gif') return 'GIF';
  if (extension === 'bmp') return 'BMP';
  if (extension === 'webp') return 'WEBP';
  
  return extension?.toUpperCase() || 'FILE';
};

export const getCategoryColor = (category: string) => {
  switch (category) {
    case 'probate':
      return 'bg-purple-100 text-purple-800';
    case 'vesting_deed':
      return 'bg-green-100 text-green-800';
    case 'death':
      return 'bg-red-100 text-red-800';
    case 'lawsuit':
      return 'bg-orange-100 text-orange-800';
    case 'taxing_entities':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'probate':
      return 'Probate';
    case 'vesting_deed':
      return 'Vesting Deed';
    case 'death':
      return 'Death';
    case 'lawsuit':
      return 'Lawsuit';
    case 'taxing_entities':
      return 'Taxing Entities';
    default:
      return 'Other';
  }
};
