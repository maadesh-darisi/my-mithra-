// Netlify serverless function to interact with OpenRouter API

exports.handler = async function(event, context) {
  try {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    // Parse the incoming request body
    const data = JSON.parse(event.body);
    const { user_input } = data;
    
    if (!user_input) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "user_input parameter is required" })
      };
    }

    // OpenRouter API Key
    const API_KEY = "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";

    // First, analyze sentiment
    const sentiment = analyzeSentiment(user_input);
    
    // Modify the prompt based on sentiment
    let prompt = user_input;
    if (sentiment === "NEGATIVE") {
      prompt = "Please respond in a very kind and empathetic way: " + user_input;
    } else if (sentiment === "POSITIVE") {
      prompt = "Respond in a cheerful and friendly tone: " + user_input;
    }

    // Make request to OpenRouter API
    const headers = {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    };

    const requestData = {
      "model": "openchat/openchat-3.5-0106",
      "messages": [
        {"role": "user", "content": prompt}
      ]
    };

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const responseData = await response.json();
    const reply = responseData.choices[0].message.content;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify({
        response: reply,
        sentiment: sentiment
      })
    };
  } catch (error) {
    console.error("Error in serverless function:", error);
    
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify({ 
        response: "Sorry, there was an error. Try again later.",
        sentiment: "NEUTRAL" 
      })
    };
  }
};

function analyzeSentiment(text) {
  // This is a simplified version of sentiment analysis
  // In a production environment, you would use a proper NLP library
  
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