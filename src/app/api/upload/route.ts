import { NextResponse } from 'next/server';
import { createWorker } from 'tesseract.js';
import { PrismaClient } from '@prisma/client';
import { writeFile } from 'fs/promises';
import { join } from 'path';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Save the file temporarily
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name}`;
    const filepath = join(process.cwd(), 'public', 'uploads', filename);
    await writeFile(filepath, buffer);

    // Initialize Tesseract worker
    const worker = await createWorker();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');

    // Perform OCR
    const { data: { text } } = await worker.recognize(filepath);
    await worker.terminate();

    // Parse the extracted text (you'll need to implement your own parsing logic)
    const parsedData = parseExcelData(text);

    // Save to database
    const image = await prisma.image.create({
      data: {
        url: `/uploads/${filename}`,
      },
    });

    const extract = await prisma.extract.create({
      data: {
        data: parsedData,
        imageId: image.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: parsedData,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}

function parseExcelData(text: string) {
  // Implement your Excel data parsing logic here
  // This is a simple example - you'll need to adapt it to your specific needs
  const lines = text.split('\n').filter(line => line.trim());
  const data = lines.map(line => {
    const cells = line.split(/\s+/);
    return {
      values: cells,
    };
  });

  return data;
} 