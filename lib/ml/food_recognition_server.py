from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import base64
import numpy as np
import cv2
import onnxruntime as ort
import tempfile

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Define food classes based on the training data
class_names = {
    0: 'burger', 1: 'butter_naan', 2: 'chai', 3: 'chapati', 4: 'chole_bhature', 5: 'dal_makhani',
    6: 'dhokla', 7: 'fried_rice', 8: 'idli', 9: 'jalebi', 10: 'kaathi_rolls',
    11: 'kadai_paneer', 12: 'kulfi', 13: 'masala_dosa', 14: 'momos', 15: 'paani_puri',
    16: 'pakode', 17: 'pav_bhaji', 18: 'pizza', 19: 'samosa'
}

def preprocess_image_from_base64(base64_string):
    # Decode base64 string to image
    img_data = base64.b64decode(base64_string.split(',')[1] if ',' in base64_string else base64_string)
    
    # Convert to numpy array
    nparr = np.frombuffer(img_data, np.uint8)
    
    # Decode image
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Resize to model input size
    img = cv2.resize(img, (224, 224))
    
    # Convert to float32
    img = img.astype(np.float32)
    
    # Add batch dimension
    img = np.expand_dims(img, axis=0)  # shape: (1, 224, 224, 3)
    
    return img

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.json:
        return jsonify({'error': 'No image provided'}), 400
    
    try:
        # Get base64 image from request
        base64_image = request.json['image']
        
        # Preprocess image
        img = preprocess_image_from_base64(base64_image)
        
        # Load ONNX model
        model_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 
                                 'public', 'models', 'FoodResnet.onnx')
        
        # Create inference session
        ort_session = ort.InferenceSession(model_path)
        
        # Get input name
        input_name = ort_session.get_inputs()[0].name
        
        # Run inference
        outputs = ort_session.run(None, {input_name: img})
        
        # Get prediction
        pred_scores = outputs[0][0]
        pred_class_idx = np.argmax(pred_scores)
        confidence = float(pred_scores[pred_class_idx])
        
        # Get class name
        food_name = class_names[pred_class_idx]
        
        return jsonify({
            'foodName': food_name,
            'confidence': confidence
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
