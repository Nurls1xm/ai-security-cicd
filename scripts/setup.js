#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║     AI Security Analysis - Setup Wizard               ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  
  const config = {};
  
  // API Keys
  console.log('API Keys Configuration\n');
  config.OPENAI_API_KEY = await question('OpenAI API Key: ');
  config.GEMINI_API_KEY = await question('Google Gemini API Key (optional): ') || '';
  
  // Jenkins
  console.log('\nJenkins Configuration\n');
  config.JENKINS_URL = await question('Jenkins URL [http://localhost:8080]: ') || 'http://localhost:8080';
  config.JENKINS_USER = await question('Jenkins User [admin]: ') || 'admin';
  config.JENKINS_TOKEN = await question('Jenkins API Token: ');
  
  // n8n
  console.log('\nn8n Configuration\n');
  config.N8N_HOST = await question('n8n Host [localhost]: ') || 'localhost';
  config.N8N_PORT = await question('n8n Port [5678]: ') || '5678';
  config.N8N_PROTOCOL = await question('n8n Protocol [http]: ') || 'http';
  
  // AI Settings
  console.log('\nAI Model Settings\n');
  config.DEFAULT_AI_MODEL = await question('Default AI Model [gpt-4]: ') || 'gpt-4';
  config.AI_TEMPERATURE = await question('AI Temperature [0.2]: ') || '0.2';
  config.AI_MAX_TOKENS = await question('AI Max Tokens [2000]: ') || '2000';
  
  // Webhook URL
  config.N8N_WEBHOOK_URL = `${config.N8N_PROTOCOL}://${config.N8N_HOST}:${config.N8N_PORT}/webhook`;
  
  // Create .env file
  console.log('\nCreating .env file...');
  
  const envContent = Object.entries(config)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  fs.writeFileSync('.env', envContent);
  
  console.log('✓ .env file created successfully!\n');
  
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║              Setup Completed Successfully!             ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  
  console.log('Next steps:');
  console.log('1. Start services: docker-compose up -d');
  console.log('2. Import n8n workflow from n8n-workflows/');
  console.log('3. Configure Jenkins pipeline');
  console.log('4. Access n8n at http://localhost:5678\n');
  
  rl.close();
}

setup().catch(error => {
  console.error('Error during setup:', error);
  rl.close();
  process.exit(1);
});
