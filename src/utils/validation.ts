import { z } from 'zod';

/**
 * Validation schemas for secure input handling
 * These schemas prevent injection attacks and ensure data integrity
 */

// Lead validation schema
export const leadSchema = z.object({
  ownerName: z.string()
    .trim()
    .min(1, 'Owner name is required')
    .max(255, 'Owner name must be less than 255 characters'),
  
  propertyAddress: z.string()
    .trim()
    .min(1, 'Property address is required')
    .max(500, 'Property address must be less than 500 characters'),
  
  email: z.union([
    z.string().email('Invalid email format'),
    z.literal('')
  ]).optional(),
  
  phone: z.union([
    z.string().regex(/^\+?\d{10,15}$/, 'Invalid phone number format'),
    z.literal('')
  ]).optional(),
  
  currentArrears: z.number()
    .min(0, 'Current arrears cannot be negative')
    .optional(),
  
  taxId: z.string()
    .max(100, 'Tax ID must be less than 100 characters')
    .optional(),
  
  taxLawsuitNumber: z.string()
    .max(100, 'Tax lawsuit number must be less than 100 characters')
    .optional(),
  
  notes: z.string()
    .max(5000, 'Notes must be less than 5000 characters')
    .optional(),
  
  vestingDeedDate: z.string()
    .max(50, 'Vesting deed date must be less than 50 characters')
    .optional(),
  
  grantorGranteeName: z.string()
    .max(255, 'Grantor/Grantee name must be less than 255 characters')
    .optional(),
  
  ownerOfRecord: z.string()
    .max(255, 'Owner of record must be less than 255 characters')
    .optional(),
  
  deathNotes: z.string()
    .max(5000, 'Death notes must be less than 5000 characters')
    .optional(),
  
  probateNotes: z.string()
    .max(5000, 'Probate notes must be less than 5000 characters')
    .optional(),
  
  lawsuitNotes: z.string()
    .max(5000, 'Lawsuit notes must be less than 5000 characters')
    .optional(),
  
  additionalTaxingNotes: z.string()
    .max(5000, 'Additional taxing notes must be less than 5000 characters')
    .optional()
});

// Campaign validation schema
export const campaignSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'Campaign name is required')
    .max(255, 'Campaign name must be less than 255 characters'),
  
  description: z.string()
    .max(2000, 'Description must be less than 2000 characters')
    .optional(),
  
  budget: z.number()
    .min(0, 'Budget cannot be negative')
    .optional(),
  
  target_deals: z.number()
    .int('Target deals must be a whole number')
    .min(0, 'Target deals cannot be negative')
    .optional(),
  
  start_date: z.string()
    .refine((date) => {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime());
    }, 'Invalid start date format'),
  
  end_date: z.string()
    .refine((date) => {
      if (!date) return true;
      const parsed = new Date(date);
      return !isNaN(parsed.getTime());
    }, 'Invalid end date format')
    .optional()
}).refine((data) => {
  if (!data.end_date) return true;
  const start = new Date(data.start_date);
  const end = new Date(data.end_date);
  return start <= end;
}, {
  message: 'End date must be after or equal to start date',
  path: ['end_date']
});

// Password validation schema (consistent 8 character minimum)
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password must be less than 128 characters');

// Helper function to validate and sanitize lead data
export function validateLeadData(leadData: any) {
  return leadSchema.parse({
    ownerName: leadData.ownerName,
    propertyAddress: leadData.propertyAddress,
    email: leadData.email || '',
    phone: leadData.phone || '',
    currentArrears: leadData.currentArrears,
    taxId: leadData.taxId || '',
    taxLawsuitNumber: leadData.taxLawsuitNumber || '',
    notes: leadData.notes || '',
    vestingDeedDate: leadData.vestingDeedDate || '',
    grantorGranteeName: leadData.grantorGranteeName || '',
    ownerOfRecord: leadData.ownerOfRecord || '',
    deathNotes: leadData.deathNotes || '',
    probateNotes: leadData.probateNotes || '',
    lawsuitNotes: leadData.lawsuitNotes || '',
    additionalTaxingNotes: leadData.additionalTaxingNotes || ''
  });
}

// Helper function to validate and sanitize campaign data
export function validateCampaignData(campaignData: any) {
  return campaignSchema.parse({
    name: campaignData.name,
    description: campaignData.description || '',
    budget: campaignData.budget,
    target_deals: campaignData.target_deals,
    start_date: campaignData.start_date,
    end_date: campaignData.end_date
  });
}
