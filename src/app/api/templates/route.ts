import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const templateName = searchParams.get('name');

  if (!templateName) {
    return NextResponse.json({ error: 'Template name is required' }, { status: 400 });
  }

  try {
    const templatePath = path.join(process.cwd(), 'templates', `${templateName}.txt`);
    console.log('Attempting to read template from:', templatePath);
    
    if (!fs.existsSync(templatePath)) {
      console.log('Template file not found at:', templatePath);
      return NextResponse.json({ error: 'Template file not found' }, { status: 404 });
    }
    
    const content = fs.readFileSync(templatePath, 'utf-8');
    console.log('Successfully read template:', templateName);
    return NextResponse.json({ content });
  } catch (error: any) {
    console.error('Error reading template:', error);
    return NextResponse.json({ error: 'Template not found', details: error?.message || 'Unknown error' }, { status: 404 });
  }
} 