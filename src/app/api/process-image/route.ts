import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is missing');
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log('Processing file:', file.name, 'Type:', file.type, 'Size:', file.size);

    // Convert the file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // Prepare the prompt for ChatGPT
    const prompt = `Please analyze this image and extract all rows that have "GF Imposition (LA)" or "Zund Cut" in the "Activity" column. 
    For each matching row, extract the Form number and Component name.
    Return the data in this exact format:
    
    GF Imposition (LA):
    [Form number] - [Component name]
    (sorted by Form number)
    
    Zund Cut:
    [Form number] - [Component name]
    (sorted by Form number)
    
    Only include exact matches for "GF Imposition (LA)" or "Zund Cut" in the Activity column.`;

    console.log('Sending request to OpenAI...');

    // Call ChatGPT with the image
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:${file.type};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    });

    console.log('Received response from OpenAI');

    // Extract the processed data from ChatGPT's response
    const processedData = response.choices[0].message.content;
    
    if (!processedData) {
      console.error('No content in OpenAI response');
      return NextResponse.json(
        { error: 'No content in OpenAI response' },
        { status: 500 }
      );
    }

    console.log('Processed data:', processedData.substring(0, 100) + '...');

    return NextResponse.json({ data: processedData });
  } catch (error) {
    console.error('Error processing image:', error);
    
    // Provide more detailed error information
    let errorMessage = 'Failed to process image';
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Check for specific error types
      if (errorMessage.includes('API key')) {
        statusCode = 401;
      } else if (errorMessage.includes('rate limit')) {
        statusCode = 429;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
} 