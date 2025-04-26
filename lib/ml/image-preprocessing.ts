/**
 * Image preprocessing utilities for the food freshness detection model
 */

// @ts-ignore - Ignore type issues with onnxruntime-web
import * as ort from 'onnxruntime-web';

/**
 * Preprocess an image for the model
 * @param imageUrl Data URL of the image
 * @returns Processed image data ready for model inference
 */
export async function preprocessImage(imageUrl: string): Promise<{
  tensor: ort.Tensor
  width: number
  height: number
}> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      try {
        console.log("Image loaded successfully, dimensions:", img.width, "x", img.height);
        
        // Create a canvas to resize and normalize the image
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        // Resize to 224x224 (model input size)
        const targetSize = 224;
        canvas.width = targetSize;
        canvas.height = targetSize;

        if (!ctx) {
          reject(new Error("Could not get canvas context"))
          return
        }

        // Fill with white background first (in case the image has transparency)
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, targetSize, targetSize);
        
        // Calculate dimensions to maintain aspect ratio
        let drawWidth = targetSize;
        let drawHeight = targetSize;
        let offsetX = 0;
        let offsetY = 0;
        
        if (img.width > img.height) {
          drawHeight = (img.height / img.width) * targetSize;
          offsetY = (targetSize - drawHeight) / 2;
        } else {
          drawWidth = (img.width / img.height) * targetSize;
          offsetX = (targetSize - drawWidth) / 2;
        }
        
        // Draw and resize the image, maintaining aspect ratio
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, targetSize, targetSize);
        const data = imageData.data;
        
        console.log("Image data extracted, length:", data.length);

        // Convert to RGB and normalize
        // Most models expect pixel values normalized to [0,1] or [-1,1]
        // We'll use [0,1] normalization
        const float32Data = new Float32Array(3 * targetSize * targetSize);
        
        // ONNX models typically expect NCHW format (batch, channels, height, width)
        // with shape [1, 3, height, width]
        for (let y = 0; y < targetSize; y++) {
          for (let x = 0; x < targetSize; x++) {
            const pixelIndex = (y * targetSize + x) * 4; // RGBA format from canvas
            
            // R channel (normalized)
            float32Data[0 * targetSize * targetSize + y * targetSize + x] = data[pixelIndex] / 255.0;
            
            // G channel (normalized)
            float32Data[1 * targetSize * targetSize + y * targetSize + x] = data[pixelIndex + 1] / 255.0;
            
            // B channel (normalized)
            float32Data[2 * targetSize * targetSize + y * targetSize + x] = data[pixelIndex + 2] / 255.0;
          }
        }

        // Create ONNX tensor with shape [1, 3, 224, 224]
        const tensor = new ort.Tensor('float32', float32Data, [1, 3, targetSize, targetSize]);
        
        console.log("Tensor created successfully with shape:", tensor.dims);

        resolve({
          tensor,
          width: targetSize,
          height: targetSize,
        })
      } catch (error) {
        console.error("Error preprocessing image:", error);
        reject(error)
      }
    }

    img.onerror = (err) => {
      console.error("Failed to load image:", err);
      reject(new Error("Failed to load image"));
    }
    
    // Set crossOrigin to anonymous to avoid CORS issues
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
  })
}