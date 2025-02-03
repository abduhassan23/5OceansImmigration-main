//Generate Content API Routes
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("Gemini API key is missing");
    }

    const modelName = 'gemini-1.5-flash-latest';

    // AI-generated: Sending request to Gemini API to generate content
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: message, // AI-generated: Message content to be processed by the Gemini API
              },
            ],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json', // AI-generated: Setting content type to JSON
        },
      }
    );

    // Extract the generated text from content.parts[0].text
    const generatedContent = response.data.candidates && response.data.candidates[0].content.parts[0].text
      ? response.data.candidates[0].content.parts[0].text
      : "AI was unable to generate content.";

    console.log("Generated Content:", generatedContent);

    return NextResponse.json({ reply: generatedContent });
  } catch (error) {
    console.error('Error in /api/generateContent:', error.response ? error.response.data : error.message);
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to generate content' },
      { status: error.response?.status || 500 }
    );
  }
}

// AI-generated: This function handles the generation of content using the Gemini API based on the provided message.