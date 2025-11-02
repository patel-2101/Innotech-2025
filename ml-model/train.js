/**
 * TensorFlow.js Model Training Script for Complaint Classification
 * 
 * This script trains a lightweight text classification model that can:
 * - Run in Node.js or browser
 * - Categorize complaints into: Water, Electricity, Road, Garbage, Others
 * - Export model for use in Next.js application
 * 
 * Usage: node train.js
 */

const tf = require('@tensorflow/tfjs-node');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const CONFIG = {
  maxWords: 100,           // Maximum vocabulary size
  maxLen: 50,              // Maximum sequence length
  embeddingDim: 16,        // Embedding dimension
  epochs: 50,              // Training epochs
  batchSize: 4,            // Batch size
  validationSplit: 0.2,    // Validation split ratio
  learningRate: 0.01,      // Learning rate
};

// Categories
const CATEGORIES = ['Water', 'Electricity', 'Road', 'Garbage', 'Others'];

/**
 * Load and parse dataset
 */
async function loadDataset() {
  console.log('📂 Loading dataset...');
  const datasetPath = path.join(__dirname, 'dataset.json');
  const data = JSON.parse(await fs.readFile(datasetPath, 'utf8'));
  
  console.log(`✅ Loaded ${data.training_data.length} training examples`);
  return data.training_data;
}

/**
 * Build vocabulary from texts
 */
function buildVocabulary(texts, maxWords) {
  console.log('📝 Building vocabulary...');
  
  const wordFreq = {};
  
  // Count word frequencies
  texts.forEach(text => {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 0);
    
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
  });
  
  // Sort by frequency and take top maxWords
  const sortedWords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxWords - 2); // Reserve 0 for padding, 1 for unknown
  
  // Build word to index mapping
  const wordIndex = { '<PAD>': 0, '<UNK>': 1 };
  sortedWords.forEach(([word], idx) => {
    wordIndex[word] = idx + 2;
  });
  
  console.log(`✅ Vocabulary size: ${Object.keys(wordIndex).length} words`);
  return wordIndex;
}

/**
 * Convert text to sequence of integers
 */
function textToSequence(text, wordIndex, maxLen) {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 0);
  
  const sequence = words.map(word => wordIndex[word] || wordIndex['<UNK>']);
  
  // Pad or truncate to maxLen
  if (sequence.length < maxLen) {
    return [...sequence, ...Array(maxLen - sequence.length).fill(0)];
  }
  return sequence.slice(0, maxLen);
}

/**
 * Prepare training data
 */
function prepareData(dataset, wordIndex, maxLen) {
  console.log('🔄 Preparing training data...');
  
  const texts = dataset.map(item => item.text);
  const labels = dataset.map(item => CATEGORIES.indexOf(item.category));
  
  // Convert texts to sequences
  const sequences = texts.map(text => textToSequence(text, wordIndex, maxLen));
  
  // Convert to tensors
  const xs = tf.tensor2d(sequences, [sequences.length, maxLen], 'int32');
  const ys = tf.oneHot(tf.tensor1d(labels, 'int32'), CATEGORIES.length);
  
  console.log(`✅ Training data prepared: ${sequences.length} examples`);
  return { xs, ys };
}

/**
 * Build the model
 */
function buildModel(vocabSize, maxLen, embeddingDim, numClasses) {
  console.log('🏗️  Building model...');
  
  const model = tf.sequential();
  
  // Embedding layer
  model.add(tf.layers.embedding({
    inputDim: vocabSize,
    outputDim: embeddingDim,
    inputLength: maxLen,
  }));
  
  // Global average pooling
  model.add(tf.layers.globalAveragePooling1d());
  
  // Dense hidden layer with dropout
  model.add(tf.layers.dense({
    units: 16,
    activation: 'relu',
  }));
  
  model.add(tf.layers.dropout({ rate: 0.5 }));
  
  // Output layer
  model.add(tf.layers.dense({
    units: numClasses,
    activation: 'softmax',
  }));
  
  // Compile model
  model.compile({
    optimizer: tf.train.adam(CONFIG.learningRate),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });
  
  console.log('✅ Model built successfully');
  model.summary();
  
  return model;
}

/**
 * Train the model
 */
async function trainModel(model, xs, ys) {
  console.log('🚀 Starting training...');
  
  const history = await model.fit(xs, ys, {
    epochs: CONFIG.epochs,
    batchSize: CONFIG.batchSize,
    validationSplit: CONFIG.validationSplit,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(
          `Epoch ${epoch + 1}/${CONFIG.epochs} - ` +
          `loss: ${logs.loss.toFixed(4)} - ` +
          `acc: ${logs.acc.toFixed(4)} - ` +
          `val_loss: ${logs.val_loss.toFixed(4)} - ` +
          `val_acc: ${logs.val_acc.toFixed(4)}`
        );
      },
    },
  });
  
  console.log('✅ Training complete!');
  return history;
}

/**
 * Save model and metadata
 */
async function saveModel(model, wordIndex) {
  console.log('💾 Saving model...');
  
  const modelDir = path.join(__dirname, 'trained-model');
  
  // Create directory if it doesn't exist
  await fs.mkdir(modelDir, { recursive: true });
  
  // Save model
  await model.save(`file://${modelDir}`);
  
  // Save metadata
  const metadata = {
    categories: CATEGORIES,
    wordIndex,
    config: CONFIG,
    timestamp: new Date().toISOString(),
  };
  
  await fs.writeFile(
    path.join(modelDir, 'metadata.json'),
    JSON.stringify(metadata, null, 2)
  );
  
  console.log(`✅ Model saved to ${modelDir}`);
  console.log('   Files: model.json, weights.bin, metadata.json');
}

/**
 * Test the model with sample predictions
 */
async function testModel(model, wordIndex) {
  console.log('\n🧪 Testing model with sample inputs...\n');
  
  const testCases = [
    "Water is not coming in my area",
    "Street light not working",
    "Big pothole on the main road",
    "Garbage not collected for days",
    "Stray dogs are creating problem",
  ];
  
  for (const text of testCases) {
    const sequence = textToSequence(text, wordIndex, CONFIG.maxLen);
    const input = tf.tensor2d([sequence], [1, CONFIG.maxLen], 'int32');
    
    const prediction = model.predict(input);
    const probabilities = await prediction.data();
    const predictedIdx = probabilities.indexOf(Math.max(...probabilities));
    const confidence = probabilities[predictedIdx];
    
    console.log(`Input: "${text}"`);
    console.log(`Predicted: ${CATEGORIES[predictedIdx]} (${(confidence * 100).toFixed(2)}%)`);
    console.log('---');
    
    input.dispose();
    prediction.dispose();
  }
}

/**
 * Main training function
 */
async function main() {
  console.log('🤖 TensorFlow.js Complaint Classification Model Training\n');
  
  try {
    // Load dataset
    const dataset = await loadDataset();
    
    // Build vocabulary
    const texts = dataset.map(item => item.text);
    const wordIndex = buildVocabulary(texts, CONFIG.maxWords);
    
    // Prepare data
    const { xs, ys } = prepareData(dataset, wordIndex, CONFIG.maxLen);
    
    // Build model
    const model = buildModel(
      Object.keys(wordIndex).length,
      CONFIG.maxLen,
      CONFIG.embeddingDim,
      CATEGORIES.length
    );
    
    // Train model
    await trainModel(model, xs, ys);
    
    // Test model
    await testModel(model, wordIndex);
    
    // Save model
    await saveModel(model, wordIndex);
    
    // Cleanup
    xs.dispose();
    ys.dispose();
    
    console.log('\n✅ All done! Model is ready to use.');
    console.log('\n📝 Next steps:');
    console.log('   1. Copy trained-model/ to public/ml-model/');
    console.log('   2. Use the model in your Next.js API route');
    console.log('   3. Run: node predict.js to test predictions');
    
  } catch (error) {
    console.error('❌ Error during training:', error);
    process.exit(1);
  }
}

// Run training
main();
