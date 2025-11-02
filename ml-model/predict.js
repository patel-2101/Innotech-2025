/**
 * Test Predictions Script
 * 
 * Tests the trained model with various complaint descriptions
 * 
 * Usage: node predict.js
 */

const tf = require('@tensorflow/tfjs-node');
const fs = require('fs').promises;
const path = require('path');

const CONFIG = {
  maxLen: 50,
};

/**
 * Load model and metadata
 */
async function loadModel() {
  console.log('📂 Loading model...');
  
  const modelDir = path.join(__dirname, 'trained-model');
  
  // Load model
  const model = await tf.loadLayersModel(`file://${modelDir}/model.json`);
  
  // Load metadata
  const metadata = JSON.parse(
    await fs.readFile(path.join(modelDir, 'metadata.json'), 'utf8')
  );
  
  console.log('✅ Model loaded successfully\n');
  
  return { model, metadata };
}

/**
 * Convert text to sequence
 */
function textToSequence(text, wordIndex, maxLen) {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 0);
  
  const sequence = words.map(word => wordIndex[word] || wordIndex['<UNK>']);
  
  if (sequence.length < maxLen) {
    return [...sequence, ...Array(maxLen - sequence.length).fill(0)];
  }
  return sequence.slice(0, maxLen);
}

/**
 * Predict category for a complaint
 */
async function predictComplaint(text, model, metadata) {
  const sequence = textToSequence(text, metadata.wordIndex, CONFIG.maxLen);
  const input = tf.tensor2d([sequence], [1, CONFIG.maxLen], 'int32');
  
  const prediction = model.predict(input);
  const probabilities = await prediction.data();
  
  // Get all predictions with probabilities
  const results = metadata.categories.map((category, idx) => ({
    category,
    probability: probabilities[idx],
    percentage: (probabilities[idx] * 100).toFixed(2),
  })).sort((a, b) => b.probability - a.probability);
  
  // Cleanup
  input.dispose();
  prediction.dispose();
  
  return results;
}

/**
 * Main function
 */
async function main() {
  console.log('🧪 Testing Complaint Classification Model\n');
  
  try {
    // Load model
    const { model, metadata } = await loadModel();
    
    // Test cases
    const testCases = [
      "Water supply has stopped in my area for 2 days",
      "There is a power outage in my locality",
      "Large pothole on the highway causing accidents",
      "Garbage bin is overflowing and smelling bad",
      "Trees are blocking the road after storm",
      "Pipe is leaking water on the street",
      "Electric wires are hanging dangerously low",
      "Road is damaged and needs urgent repair",
      "Waste collection has not happened this week",
      "Public park needs maintenance",
      "No water pressure in taps",
      "Transformer is making sparking sounds",
      "Broken pavement near school",
      "Illegal garbage dumping in residential area",
      "Bus stop shelter is damaged",
    ];
    
    console.log('🔍 Predictions:\n');
    console.log('='.repeat(70));
    
    for (const text of testCases) {
      const results = await predictComplaint(text, model, metadata);
      const topPrediction = results[0];
      
      console.log(`\n📝 Input: "${text}"`);
      console.log(`✅ Predicted: ${topPrediction.category} (${topPrediction.percentage}%)`);
      console.log('   All predictions:');
      results.slice(0, 3).forEach((result, idx) => {
        console.log(`   ${idx + 1}. ${result.category}: ${result.percentage}%`);
      });
      console.log('-'.repeat(70));
    }
    
    // Interactive mode
    console.log('\n💡 Tip: You can modify test cases in predict.js');
    console.log('✅ Model is ready to be integrated into Next.js!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run predictions
main();
