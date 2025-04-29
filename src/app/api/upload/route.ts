import { NextResponse } from 'next/server';
import { createWorker, type WorkerOptions } from 'tesseract.js';
import { PrismaClient } from '@prisma/client';
import { writeFile } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save the file
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename);
    await writeFile(filepath, buffer);

    // Initialize Tesseract worker with proper options
    const workerOptions: WorkerOptions = {
      logger: (m: any) => console.log(m),
      errorHandler: (e: any) => console.error(e),
      langPath: path.join(process.cwd(), 'tessdata'),
    };

    const worker = await createWorker(workerOptions);
    
    try {
      // Load language and initialize
      await worker.loadLanguage('eng');
      await worker.initialize('eng');

      // Perform OCR
      const { data: { text } } = await worker.recognize(buffer);
      
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
        filename: `/uploads/${filename}`
      });
    } finally {
      // Ensure worker is terminated
      await worker.terminate();
    }
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      { error: 'Error processing file' },
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