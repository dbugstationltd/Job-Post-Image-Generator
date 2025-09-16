
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { TEXT_MODEL, IMAGE_MODEL } from '../constants';

// Ensure API_KEY is available. In a real app, this would be handled more securely.
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateImagePrompt = async (jobTitle: string): Promise<string> => {
  const prompt = `Generate a funny, conceptual, and visually striking image prompt for a job post titled: "${jobTitle}". The prompt should describe a scene featuring a stylized, funny 3D human avatar character representing the job role. The style should be modern, playful, and suitable for social media. Avoid boring corporate cliches. The final image should look like a 3D render.
  
  Example for 'Software Engineer': "A funny 3D avatar of a software engineer with oversized glasses, furiously typing on a glowing keyboard that's floating in a sea of colorful, abstract data streams. The character has a determined yet slightly manic expression, with lines of code swirling around their head like a halo. Style: 3D render, playful, vibrant colors."
  Example for 'Marketing Manager': "A charming 3D avatar of a marketing manager, dressed as a magician, pulling a giant, glowing 'like' button out of a top hat. The character is winking at the camera, surrounded by floating charts and graphs that look like colorful confetti. Style: 3D render, funny, conceptual, bright lighting."
  
  Now, generate a prompt for: "${jobTitle}"`;
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating image prompt:", error);
    throw new Error("Failed to generate a creative prompt. The AI might be on a coffee break.");
  }
};

export const generateImages = async (prompt: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateImages({
      model: IMAGE_MODEL,
      prompt: prompt,
      config: {
        numberOfImages: 2,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1',
      },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error("No images were generated.");
    }

    return response.generatedImages.map(img => `data:image/jpeg;base64,${img.image.imageBytes}`);
  } catch (error) {
    console.error("Error generating images:", error);
    throw new Error("Failed to generate images. Please try a different prompt or check your API key.");
  }
};
