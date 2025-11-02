// Mock implementation for development without TensorFlow
export async function categorizeComplaint(text: string): Promise<string> {
  // Simple keyword-based categorization for development
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('road') || lowerText.includes('pothole') || lowerText.includes('street')) {
    return 'ROAD';
  }
  if (lowerText.includes('water') || lowerText.includes('leak') || lowerText.includes('supply')) {
    return 'WATER';
  }
  if (lowerText.includes('garbage') || lowerText.includes('waste') || lowerText.includes('trash')) {
    return 'GARBAGE';
  }
  if (lowerText.includes('electricity') || lowerText.includes('power') || lowerText.includes('electric')) {
    return 'ELECTRICITY';
  }
  if (lowerText.includes('drainage') || lowerText.includes('drain') || lowerText.includes('sewer')) {
    return 'DRAINAGE';
  }
  if (lowerText.includes('light') || lowerText.includes('lamp') || lowerText.includes('lighting')) {
    return 'STREET_LIGHT';
  }
  
  return 'OTHER';
}

export async function loadModel(): Promise<void> {
  // Mock function - no model to load in development
  console.log('Using mock categorization for development');
}