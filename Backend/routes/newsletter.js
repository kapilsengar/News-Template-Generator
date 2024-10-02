const express = require('express');
const router = express.Router();
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();  // Import and configure dotenv

router.post('/generate-template', async (req, res) => {
  const { prompt } = req.body;

  try {
    const API_KEY = process.env.OPEN_API_KEY;  // Access the environment variable

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
      `Generate a small heading, subheading, and 2 or 3 short articles (each 100-150 words) for the following topic: ${prompt}`
    ]);

    // Assuming result.response contains the generated text in the format you're expecting
    const generatedContent = result.response.text();

    // Split content into an array based on new lines or periods
    const contentArray = generatedContent.split("\n").filter(line => line.trim() !== '');

    // Assuming the first line is the heading, second line is the subheading, and the rest are articles
    const heading = contentArray[0];  // First line as heading
    const subheading = contentArray[1]; // Second line as subheading
    const articles = contentArray.slice(2); // Remaining lines as articles

    // Function to format the response
    const formatResponse = (heading, subheading, articles) => {
      return {
        heading,
        subheading,
        articles
      };
    };

    // Send formatted response as JSON
    res.json(formatResponse(heading, subheading, articles));
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate templates' });
  }
});

module.exports = router;
