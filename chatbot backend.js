require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Allow cross-origin requests

// API Key from environment variables
const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is not defined. Please check your .env file.");
  process.exit(1); // Exit if API key is not defined
}

// Example external API URL (e.g., OpenAI GPT-3 endpoint)
const EXTERNAL_API_URL = "https://api.openai.com/v1/engines/davinci-codex/completions";

// Chatbot route
app.post('/chatbot-backend', async (req, res) => {
  const userMessage = req.body.message;

  // Check if the message is empty
  if (!userMessage) {
    return res.status(400).json({ message: "Please enter a message." });
  }

  try {
    // Create the request payload for the external API
    const payload = {
      prompt: userMessage,
      max_tokens: 150,
      temperature: 0.7
    };

    // Send a POST request to the external API with the API key
    const response = await axios.post(EXTERNAL_API_URL, payload, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    // Send the response from the external API to the client
    const botReply = response.data.choices[0].text.trim();
    res.json({ message: botReply });

  } catch (error) {
    console.error("Error communicating with external API:", error);
    res.status(500).json({ message: "Oops! Something went wrong." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Chatbot backend is running on http://localhost:${PORT}`);
});
