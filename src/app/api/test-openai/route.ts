import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET() {
  try {
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured', configured: false },
        { status: 500 }
      );
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Make a simple API call to test the key
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Hello, this is a test." }],
      max_tokens: 5,
    });

    return NextResponse.json({
      configured: true,
      working: true,
      model: response.model,
    });
  } catch (error) {
    console.error('Error testing OpenAI API:', error);
    
    let errorMessage = 'Failed to test OpenAI API';
    let configured = true;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Check for specific error types
      if (errorMessage.includes('API key')) {
        configured = false;
      }
    }
    
    return NextResponse.json(
      { 
        configured,
        working: false,
        error: errorMessage 
      },
      { status: 500 }
    );
  }
} 