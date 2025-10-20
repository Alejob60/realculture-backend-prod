#!/usr/bin/env node

import { Command } from 'commander';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Get the base API URL from environment or use default
const API_BASE_URL = process.env.MISYBOT_API_URL || 'http://localhost:3001';

// Path to store the token file
const TOKEN_FILE_PATH = path.join(os.homedir(), '.misybot', 'token.json');

// Path to store the API key file
const API_KEY_FILE_PATH = path.join(os.homedir(), '.misybot', 'api-key.json');

// Function to save token to file
function saveToken(token: string, user: any): void {
  const tokenDir = path.dirname(TOKEN_FILE_PATH);
  if (!fs.existsSync(tokenDir)) {
    fs.mkdirSync(tokenDir, { recursive: true });
  }
  
  const tokenData = {
    token,
    user,
    createdAt: new Date().toISOString()
  };
  
  fs.writeFileSync(TOKEN_FILE_PATH, JSON.stringify(tokenData, null, 2));
}

// Function to load token from file
function loadToken(): { token: string; user: any } | null {
  try {
    if (fs.existsSync(TOKEN_FILE_PATH)) {
      const tokenData = JSON.parse(fs.readFileSync(TOKEN_FILE_PATH, 'utf8'));
      return tokenData;
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Function to clear token file
function clearToken(): void {
  if (fs.existsSync(TOKEN_FILE_PATH)) {
    fs.unlinkSync(TOKEN_FILE_PATH);
  }
}

// Function to save API key to file
function saveApiKey(apiKey: string): void {
  const tokenDir = path.dirname(API_KEY_FILE_PATH);
  if (!fs.existsSync(tokenDir)) {
    fs.mkdirSync(tokenDir, { recursive: true });
  }
  
  const apiKeyData = {
    apiKey,
    createdAt: new Date().toISOString()
  };
  
  fs.writeFileSync(API_KEY_FILE_PATH, JSON.stringify(apiKeyData, null, 2));
}

// Function to load API key from file
function loadApiKey(): { apiKey: string } | null {
  try {
    if (fs.existsSync(API_KEY_FILE_PATH)) {
      const apiKeyData = JSON.parse(fs.readFileSync(API_KEY_FILE_PATH, 'utf8'));
      return apiKeyData;
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Function to clear API key file
function clearApiKey(): void {
  if (fs.existsSync(API_KEY_FILE_PATH)) {
    fs.unlinkSync(API_KEY_FILE_PATH);
  }
}

// Create the main program
const program = new Command();

// Set the CLI name and description
program
  .version('1.0.0')
  .description('CLI tool for interacting with MisyBot');

// Config command
const configCmd = program.command('config').description('Configuration commands');

// Get config subcommand
configCmd
  .command('get')
  .description('Get secure configuration from the backend')
  .action(async () => {
    const apiKeyData = loadApiKey();
    
    if (!apiKeyData) {
      console.log('❌ No API key configured. Please generate or configure an API key first.');
      return;
    }
    
    try {
      const response = await axios.get(`${API_BASE_URL}/config`, {
        headers: {
          'x-api-key': apiKeyData.apiKey
        }
      });
      
      console.log('✅ Configuration retrieved successfully:');
      console.log(JSON.stringify(response.data, null, 2));
    } catch (error: any) {
      if (error.response) {
        console.error(`❌ Failed to retrieve configuration: ${error.response.data.message || error.response.statusText}`);
      } else {
        console.error(`❌ Failed to retrieve configuration: ${error.message}`);
      }
    }
  });

// Auth command
const authCmd = program.command('auth').description('Authentication commands');

// Login subcommand
authCmd
  .command('login <email> <password>')
  .description('Log in to MisyBot')
  .action(async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      saveToken(response.data.access_token, response.data.user);
      
      console.log(`✅ Successfully logged in as ${response.data.user.email}`);
    } catch (error: any) {
      if (error.response) {
        console.error(`❌ Login failed: ${error.response.data.message || error.response.statusText}`);
      } else {
        console.error(`❌ Login failed: ${error.message}`);
      }
    }
  });

// Register subcommand
authCmd
  .command('register <email> <password> <name>')
  .description('Register a new account and log in')
  .action(async (email: string, password: string, name: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        email,
        password,
        name
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      saveToken(response.data.access_token, response.data.user);
      
      console.log(`✅ Successfully registered and logged in as ${response.data.user.email}`);
    } catch (error: any) {
      if (error.response) {
        console.error(`❌ Registration failed: ${error.response.data.message || error.response.statusText}`);
      } else {
        console.error(`❌ Registration failed: ${error.message}`);
      }
    }
  });

// Logout subcommand
authCmd
  .command('logout')
  .description('Log out from MisyBot')
  .action(() => {
    clearToken();
    console.log('✅ Successfully logged out');
  });

// Status subcommand
authCmd
  .command('status')
  .description('Show authentication status')
  .action(() => {
    const tokenData = loadToken();
    
    if (tokenData) {
      console.log(`👤 Currently logged in as: ${tokenData.user.email}`);
      console.log(`🆔 User ID: ${tokenData.user.id}`);
    } else {
      console.log('❌ Not currently logged in');
    }
  });

// Generate API Key subcommand
authCmd
  .command('generate-api-key')
  .description('Generate an API key for CLI authentication')
  .action(async () => {
    const tokenData = loadToken();
    
    if (!tokenData) {
      console.log('❌ You must be logged in to generate an API key');
      return;
    }
    
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/api-key/generate`, 
        {}, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenData.token}`
          }
        }
      );
      
      saveApiKey(response.data.apiKey);
      
      console.log(`✅ API key generated successfully`);
      console.log(`🔑 Your API key: ${response.data.apiKey}`);
      console.log('⚠️  Store this key securely and do not share it');
    } catch (error: any) {
      if (error.response) {
        console.error(`❌ Failed to generate API key: ${error.response.data.message || error.response.statusText}`);
      } else {
        console.error(`❌ Failed to generate API key: ${error.message}`);
      }
    }
  });

// Configure with API Key subcommand
authCmd
  .command('configure <apiKey>')
  .description('Configure CLI with an API key')
  .action((apiKey: string) => {
    saveApiKey(apiKey);
    console.log('✅ CLI configured with API key');
  });

// Clear API Key subcommand
authCmd
  .command('clear-api-key')
  .description('Remove the stored API key')
  .action(() => {
    clearApiKey();
    console.log('✅ API key removed');
  });

// Parse the command line arguments
program.parse(process.argv);

// If no command is provided, show help
if (!process.argv.slice(2).length) {
  program.help();
}
