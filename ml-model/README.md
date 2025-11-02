# TensorFlow.js Text Classification Model for Complaints

This guide explains how to train and use a lightweight text classification model for categorizing complaints.

## Model Overview

- **Input**: Text complaint description
- **Output**: Category (Water, Electricity, Road, Garbage, Others)
- **Architecture**: Simple Neural Network with embedding layer
- **Training**: Can run locally in Node.js
- **Inference**: Works in both Node.js and browser

## Categories

1. Water
2. Electricity
3. Road
4. Garbage
5. Others

## Files Structure

```
ml-model/
├── train.js              # Training script
├── dataset.json          # Training data
├── trained-model/        # Exported model files
│   ├── model.json
│   └── weights.bin
└── predict.js            # Testing predictions
```

## Quick Start

```bash
# 1. Prepare dataset
npm run ml:prepare

# 2. Train model
npm run ml:train

# 3. Test predictions
npm run ml:predict
```

See individual files for detailed usage.
