// netlify/functions/generate-question.js

// You'll need to install the SDK locally for Netlify to build it
// npm install @google/genai 
const { GoogleGenAI } = require('@google/genai');

// The API key is securely loaded from Netlify's environment variables
const ai = new GoogleGenAI({}); 

exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: "Method Not Allowed"
        };
    }

    try {
        const data = JSON.parse(event.body);
        const userContext = data.context || "thoughtful, fun date question";

        const prompt = `Generate a single, unique, and engaging date question for a date with a theme of: ${userContext}. Do not include any introductory phrases, bullet points, numbering, or quotation marks. Just the question.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [prompt],
        });

        const question = response.text.trim();

        return {
            statusCode: 200,
            body: JSON.stringify({ question: question })
        };

    } catch (error) {
        console.error("Gemini API Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to generate question." })
        };
    }
};