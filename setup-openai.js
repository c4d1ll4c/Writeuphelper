#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('OpenAI API Key Setup');
console.log('====================');
console.log('This script will help you set up your OpenAI API key for the application.');
console.log('You can get an API key from https://platform.openai.com/api-keys');
console.log('');

rl.question('Enter your OpenAI API key: ', (apiKey) => {
  if (!apiKey) {
    console.log('No API key provided. Exiting...');
    rl.close();
    return;
  }

  // Create .env.local file
  const envPath = path.join(process.cwd(), '.env.local');
  const envContent = `OPENAI_API_KEY=${apiKey}\n`;

  try {
    fs.writeFileSync(envPath, envContent);
    console.log('');
    console.log('✅ OpenAI API key has been saved to .env.local');
    console.log('');
    console.log('Next steps:');
    console.log('1. Restart your development server');
    console.log('2. Test the OpenAI API using the test button in the application');
  } catch (error) {
    console.error('Error saving API key:', error.message);
  }

  rl.close();
}); 