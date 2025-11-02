// Mock implementation for development - no TensorFlow dependency
export { categorizeComplaint, loadModel } from './complaint-categorizer-mock';

export type ComplaintCategory = 
  | 'ROAD' 
  | 'WATER' 
  | 'GARBAGE' 
  | 'ELECTRICITY' 
  | 'DRAINAGE' 
  | 'STREET_LIGHT' 
  | 'OTHER';

// Keep other functions for API compatibility
export async function categorizeComplaintWithML(description: string): Promise<ComplaintCategory> {
  const { categorizeComplaint } = await import('./complaint-categorizer-mock');
  return await categorizeComplaint(description) as ComplaintCategory;
}

export async function getCategoryConfidence(
  description: string, 
  category: ComplaintCategory
): Promise<number> {
  return 0.8; // Mock confidence score
}
