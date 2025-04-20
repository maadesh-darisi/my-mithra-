// Netlify serverless function for more advanced sentiment analysis
// This would be used in a production environment instead of the
// simplified front-end implementation

exports.handler = async function(event, context) {
  try {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    // Parse the incoming request body
    const data = JSON.parse(event.body);
    const { text } = data;
    
    if (!text) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Text parameter is required" })
      };
    }

    // Simple sentiment analysis (mimicking the Python transformers pipeline)
    const sentiment = analyzeSentiment(text);
    
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify({
        sentiment: sentiment,
        text: text
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error processing request" })
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