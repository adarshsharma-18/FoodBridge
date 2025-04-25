# Food Freshness Detection Model

This directory contains the machine learning model for food freshness detection.

## Model Details

- **Model Name**: fruits_edible.onnx
- **Original Format**: PyTorch
- **Converted Format**: ONNX (Open Neural Network Exchange)
- **Input Size**: 224x224 RGB image
- **Output**: 
  - Food type classification (9 classes)
  - Freshness classification (2 classes: Fresh/Spoiled)

## Classes

### Food Types
- apple
- banana
- beetroot
- carrot
- cucumber
- orange
- potato
- tomato
- other

### Freshness States
- Fresh
- Spoiled

## Usage

This model is loaded and used by the FoodBridge application to automatically detect food freshness during the driver's verification process.
\`\`\`

## 10. Create a placeholder model file

```plaintext file="public/models/fruits_edible.onnx"
# This is a placeholder for the actual ONNX model file
# In a real implementation, this would be the converted PyTorch model
