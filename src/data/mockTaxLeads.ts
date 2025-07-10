
import { TaxLead } from '@/types/taxLead';

export const mockTaxLeads: TaxLead[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Smith',
    taxId: 'TX123456789',
    ownerName: 'John Smith',
    propertyAddress: '123 Main St, Dallas, TX 75201',
    taxLawsuitNumber: 'TL-2024-001',
    currentArrears: 15000,
    status: 'HOT',
    temperature: 'HOT',
    occupancyStatus: 'OWNER_OCCUPIED',
    notes: 'High-value property with significant arrears',
    phone: '(555) 123-4567',
    email: 'john.smith@email.com',
    ownerOfRecord: 'John Smith'
  },
  {
    id: 2,
    firstName: 'Sarah',
    lastName: 'Johnson',
    taxId: 'TX987654321',
    ownerName: 'Sarah Johnson',
    propertyAddress: '456 Oak Ave, Houston, TX 77001',
    taxLawsuitNumber: 'TL-2024-002',
    currentArrears: 8500,
    status: 'WARM',
    temperature: 'WARM',
    occupancyStatus: 'TENANT_OCCUPIED',
    notes: 'Property owner contacted previously',
    phone: '(555) 987-6543',
    email: 'sarah.j@email.com',
    ownerOfRecord: 'Sarah Johnson Estate'
  },
  {
    id: 3,
    firstName: 'Mike',
    lastName: 'Rodriguez',
    taxId: 'TX456789123',
    ownerName: 'Mike Rodriguez',
    propertyAddress: '789 Pine Rd, Austin, TX 73301',
    taxLawsuitNumber: 'TL-2024-003',
    currentArrears: 3200,
    status: 'COLD',
    temperature: 'COLD',
    occupancyStatus: 'VACANT',
    notes: 'Small arrears, low priority',
    phone: '(555) 456-7890',
    ownerOfRecord: 'Mike Rodriguez'
  }
];
