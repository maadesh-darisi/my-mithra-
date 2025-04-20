import { ChatResponse } from '../types';

const API_KEY = "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";

export async function chatWithOpenRouter(userInput: string): Promise<ChatResponse> {
  try {
    // First perform sentiment analysis
    const sentiment = await analyzeSentiment(userInput);
    
    // Modify the prompt based on sentiment
    let prompt = userInput;
    if (sentiment === "NEGATIVE") {
      prompt = "Please respond in a very kind and empathetic way: " + userInput;
    } else if (sentiment === "POSITIVE") {
      prompt = "Respond in a cheerful and friendly tone: " + userInput;
    }

    // Make request to OpenRouter API
    const headers = {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    };

    const data = {
      "model": "openchat/openchat-3.5-0106",
      "messages": [
        {"role": "user", "content": prompt}
      ]
    };

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const responseData = await response.json();
    const reply = responseData.choices[0].message.content;

    return { response: reply, sentiment };
  } catch (error) {
    console.error("Error in chatWithOpenRouter:", error);
    return { 
      response: "Sorry, there was an error. Try again later.", 
      sentiment: "NEUTRAL" 
    };
  }
}

// Simple sentiment analysis function
// In a real implementation, this would use a more sophisticated model
async function analyzeSentiment(text: string): Promise<string> {
  // This is a simplified implementation
  // In the real app, this would call a serverless function with the transformers model
  
  // Detect basic sentiment with keyword matching
  const lowerText = text.toLowerCase();
  
  const negativeWords = [
    'sad', 'upset', 'depressed', 'anxious', 'worried', 'stressed',
    'angry', 'frustrated', 'disappointing', 'hate', 'terrible', 'horrible',
    'bad', 'awful', 'miserable', 'hurt', 'pain', 'suffering'
  ];
  
  const positiveWords = [
    'happy', 'joy', 'excited', 'good', 'great', 'wonderful', 'amazing',
    'love', 'enjoy', 'fantastic', 'excellent', 'pleased', 'delighted',
    'grateful', 'thankful', 'content', 'calm', 'peaceful'
  ];

  let negativeCount = 0;
  let positiveCount = 0;

  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativeCount++;
  });

  positiveWords.forEach(word => {
    if (lowerText.includes(word)) positiveCount++;
  });

  if (negativeCount > positiveCount) return "NEGATIVE";
  if (positiveCount > negativeCount) return "POSITIVE";
  return "NEUTRAL";
}