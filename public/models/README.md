# Machine Learning Models

This directory contains the machine learning models used by the FoodBridge application.

## Models

### 1. fruits_edible.onnx
Used for food freshness detection. Classifies food items as "Fresh" or "Spoiled".

### 2. FoodResnet.onnx
Used for food recognition. Classifies food items into 20 categories of Indian food.

## Adding the Real Models

The files in this directory are placeholders. To use the real models:

1. For the FoodResnet model:
   - Convert your Keras model to ONNX format using the TensorFlow-ONNX converter:
     \`\`\`
     python -m tf2onnx.convert --keras FoodResnet.keras --output FoodResnet.onnx
     \`\`\`
   - Place the converted ONNX model in this directory

2. For other models:
   - Follow similar conversion steps based on the original model format
   - Place the converted ONNX models in this directory

## Model Usage

These models are loaded and used by the application's ML services:
- `lib/ml/food-recognition.ts` for food recognition
- `lib/ml/model-inference.ts` for food freshness detection
