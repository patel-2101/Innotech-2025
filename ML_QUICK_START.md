# ML Model Quick Start Guide

## 🚀 Train Your Model in 3 Steps

### Step 1: Train the Model

```bash
npm run ml:train
```

**What happens:**
- Loads 70+ training examples from `dataset.json`
- Builds vocabulary from complaint descriptions
- Trains a neural network for 50 epochs
- Saves model to `ml-model/trained-model/`

**Expected output:**
```
📂 Loading dataset...
✅ Loaded 70 training examples
📝 Building vocabulary...
✅ Vocabulary size: 100 words
🏗️  Building model...
✅ Model built successfully
🚀 Starting training...
Epoch 1/50 - loss: 1.5234 - acc: 0.3214 - val_loss: 1.4567 - val_acc: 0.4000
...
Epoch 50/50 - loss: 0.1234 - acc: 0.9643 - val_loss: 0.2345 - val_acc: 0.9286
✅ Training complete!
💾 Saving model...
✅ Model saved to ml-model/trained-model
```

### Step 2: Test Predictions

```bash
npm run ml:predict
```

**Sample output:**
```
🧪 Testing Complaint Classification Model

📝 Input: "Water is not coming in my area"
✅ Predicted: Water (96.54%)
   All predictions:
   1. Water: 96.54%
   2. Others: 2.13%
   3. Road: 0.89%
```

### Step 3: Copy Model to Public Folder

```bash
npm run ml:setup
```

This copies the trained model to `public/ml-model/` so Next.js can serve it.

---

## 📝 Complete Example: Train → Deploy → Use

### 1. Training Script Usage

```bash
cd ml-model
node train.js
```

**Customize training:**

Edit `train.js`:
```javascript
const CONFIG = {
  maxWords: 100,      // Increase for larger vocabulary
  maxLen: 50,         // Increase for longer texts
  embeddingDim: 16,   // Higher = more complex embeddings
  epochs: 50,         // More epochs = better training
  batchSize: 4,       // Adjust based on dataset size
};
```

### 2. Add More Training Data

Edit `ml-model/dataset.json`:

```json
{
  "training_data": [
    {
      "text": "Your new complaint example",
      "category": "Water"
    }
  ]
}
```

**Categories must be one of:**
- Water
- Electricity
- Road
- Garbage
- Others

### 3. Using in Next.js API

**Example: Auto-categorize complaints**

```typescript
// app/api/complaints/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { description } = await request.json();
  
  // Call ML API to predict category
  const mlResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/ml/predict-category`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description })
  });
  
  const mlData = await mlResponse.json();
  const predictedCategory = mlData.data.predictedCategory.toUpperCase();
  
  // Create complaint with predicted category
  const complaint = await prisma.complaint.create({
    data: {
      title: "Auto-titled complaint",
      description,
      category: predictedCategory,
      isAiCategorized: true,
      // ... other fields
    }
  });
  
  return NextResponse.json({ success: true, data: complaint });
}
```

### 4. Using in Frontend Component

**Example: Real-time category prediction**

```typescript
'use client';

import { useState } from 'react';

export function SmartComplaintForm() {
  const [description, setDescription] = useState('');
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handlePredictCategory = async () => {
    if (!description || description.length < 10) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/ml/predict-category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description })
      });
      
      const data = await response.json();
      if (data.success) {
        setPrediction(data.data);
      }
    } catch (error) {
      console.error('Prediction error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Complaint Description
        </label>
        <textarea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            // Auto-predict as user types (debounced)
            if (e.target.value.length > 20) {
              handlePredictCategory();
            }
          }}
          className="w-full p-3 border rounded-lg"
          rows={4}
          placeholder="Describe your complaint..."
        />
      </div>

      {loading && (
        <div className="text-gray-500">
          🤖 AI is analyzing your complaint...
        </div>
      )}

      {prediction && !loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">
            AI Prediction
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-blue-800">
                Category: <strong>{prediction.predictedCategory}</strong>
              </span>
              <span className="text-sm text-blue-600">
                Confidence: {prediction.confidence}
              </span>
            </div>
            
            <details className="text-sm">
              <summary className="cursor-pointer text-blue-700">
                View all predictions
              </summary>
              <div className="mt-2 space-y-1">
                {prediction.allPredictions.map((pred: any, idx: number) => (
                  <div key={idx} className="flex justify-between">
                    <span>{pred.category}</span>
                    <span>{pred.confidence}</span>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </div>
      )}

      <button
        onClick={handlePredictCategory}
        disabled={loading || description.length < 10}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Predicting...' : 'Predict Category'}
      </button>
    </div>
  );
}
```

---

## 🧪 Testing the Model

### Test Individual Predictions

```bash
npm run ml:predict
```

### Test via API

```bash
# Start Next.js dev server
npm run dev

# In another terminal:
curl -X POST http://localhost:3000/api/ml/predict-category \
  -H "Content-Type: application/json" \
  -d '{"description":"Water is not coming in my area"}'

# Response:
# {
#   "success": true,
#   "data": {
#     "predictedCategory": "Water",
#     "confidence": "96.54%",
#     "allPredictions": [...]
#   }
# }
```

### Get Model Info

```bash
curl http://localhost:3000/api/ml/predict-category

# Response:
# {
#   "success": true,
#   "data": {
#     "categories": ["Water", "Electricity", "Road", "Garbage", "Others"],
#     "modelInfo": {
#       "maxLen": 50,
#       "vocabularySize": 100,
#       "embeddingDim": 16,
#       "trainedAt": "2025-11-02T..."
#     }
#   }
# }
```

---

## 📊 Model Performance Tips

### Improve Accuracy

1. **Add more training data** (aim for 100+ examples per category)
2. **Balance the dataset** (equal examples per category)
3. **Increase epochs** (try 100-200 for larger datasets)
4. **Use longer descriptions** in training data
5. **Add domain-specific terms** to your dataset

### Optimize for Speed

1. **Reduce vocabulary size** (maxWords: 50)
2. **Reduce sequence length** (maxLen: 30)
3. **Smaller embedding dimension** (embeddingDim: 8)
4. **Cache model in memory** (already implemented)

### Production Deployment

```bash
# Train with production data
npm run ml:train

# Copy to public folder
npm run ml:setup

# Build Next.js app
npm run build

# Deploy (Vercel, etc.)
# Model files in public/ are automatically deployed
```

---

## 🔧 Troubleshooting

### Issue: Model not loading in browser

**Solution:**
```bash
# Verify files exist
ls -la public/ml-model/
# Should show: model.json, weights.bin, metadata.json

# Check if Next.js is serving them
curl http://localhost:3000/ml-model/model.json
```

### Issue: Low prediction accuracy

**Solution:**
1. Add more training examples
2. Check if categories are balanced
3. Increase training epochs
4. Review mispredicted examples and add similar ones

### Issue: Training fails with memory error

**Solution:**
```javascript
// In train.js, reduce batch size:
const CONFIG = {
  batchSize: 2,  // Reduce from 4
  // ...
};
```

### Issue: Predictions are slow

**Solution:**
- Model is cached after first load
- If still slow, reduce model complexity
- Consider server-side inference for better performance

---

## 📦 File Structure

```
your-project/
├── ml-model/                    # Training scripts
│   ├── dataset.json            # Training data (70+ examples)
│   ├── train.js                # Training script
│   ├── predict.js              # Testing script
│   ├── README.md               # ML docs
│   ├── TRAINING_GUIDE.md       # Detailed guide
│   └── trained-model/          # Output after training
│       ├── model.json          # Model architecture
│       ├── weights.bin         # Trained weights
│       └── metadata.json       # Vocabulary & config
│
├── public/ml-model/            # Deployed model (copy from trained-model/)
│   ├── model.json
│   ├── weights.bin
│   └── metadata.json
│
├── app/api/ml/                 # ML API routes
│   └── predict-category/
│       └── route.ts            # Prediction endpoint
│
└── lib/ml/                     # ML utilities
    ├── complaint-categorizer.ts  # Keyword fallback
    └── model-predictor.ts        # ML predictor wrapper
```

---

## 🎯 Production Checklist

- [ ] Train model with real user data (100+ examples per category)
- [ ] Test accuracy with validation set
- [ ] Copy model to `public/ml-model/`
- [ ] Test API endpoint
- [ ] Integrate with complaint form
- [ ] Monitor predictions in production
- [ ] Set up model retraining pipeline
- [ ] Add fallback to keyword-based categorization
- [ ] Implement error handling
- [ ] Add prediction logging for analysis

---

## 📚 Next Steps

1. **Collect Real Data**: Use initial keyword-based predictions, collect user feedback
2. **Retrain**: Periodically retrain with new data
3. **A/B Test**: Compare ML vs keyword-based categorization
4. **Optimize**: Fine-tune based on production metrics
5. **Scale**: Add more categories or languages

---

**🎉 Your ML model is ready to use! Train it, test it, and integrate it into your app.**

For detailed documentation, see:
- `ml-model/TRAINING_GUIDE.md` - Complete training guide
- `ml-model/README.md` - Quick reference
- API route code for integration examples
