# Food Freshness Detection Models

This directory contains machine learning models for food freshness detection and recognition.

## Original Model Details

- **Model Name**: fruits_edible.onnx
- **Original Format**: PyTorch
- **Converted Format**: ONNX (Open Neural Network Exchange)
- **Input Size**: 224x224 RGB image
- **Output**: 
  - Food type classification (9 classes)
  - Freshness classification (2 classes: Fresh/Spoiled)
- **Architecture**: ResNet18-based with custom classification heads
- **Conversion Method**: Converted from PyTorch (.pt) to ONNX using torch.onnx.export

### Classes

#### Food Types
- apple
- banana
- beetroot
- carrot
- cucumber
- orange
- potato
- tomato
- other

#### Freshness States
- Fresh
- Spoiled

### Model Architecture
The model uses a ResNet18 backbone with two separate classification heads:
- One head for food type classification (9 classes)
- One head for freshness detection (2 classes)

## New Model Details

- **Model Name**: food_recognition_model.onnx
- **Purpose**: Enhanced food recognition with nutritional information
- **Input Size**: 224x224 RGB image
- **Output**: Food item classification with higher granularity
- **Features**:
  - More detailed food classification
  - Integration with nutritional database
  - Improved accuracy for diverse food items

## Usage

Both models are used in the FoodBridge application for:
1. Food type identification
2. Freshness assessment
3. Nutritional analysis
4. Food safety verification

## Integration

The models are integrated into the application through:
- Web-based inference using ONNX Runtime Web
- Server-side processing for more complex analysis
- Real-time feedback for users during food donation and collection
