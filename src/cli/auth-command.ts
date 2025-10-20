import { Command } from 'commander';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Define interfaces for our data structures
interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

interface RegisterResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

// Get the base API URL from environment or use default
const API_BASE_URL = process.env.MISYBOT_API_URL || 'http://localhost:3001';

// Path to store the token file
const TOKEN_FILE_PATH = path.join(os.homedir(), '.misybot', 'token.json');

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

// Login command implementation
async function login(email: string, password: string): Promise<void> {
  try {
    const response = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/login`, {
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
}

// Register command implementation
async function register(email: string, password: string, name: string): Promise<void> {
  try {
    const response = await axios.post<RegisterResponse>(`${API_BASE_URL}/auth/register`, {
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
}

// Logout command implementation
function logout(): void {
  clearToken();
  console.log('✅ Successfully logged out');
}

// Status command implementation
function status(): void {
  const tokenData = loadToken();
  
  if (tokenData) {
    console.log(`👤 Currently logged in as: ${tokenData.user.email}`);
    console.log(`🆔 User ID: ${tokenData.user.id}`);
  } else {
    console.log('❌ Not currently logged in');
  }
}

// Create the auth command
export function createAuthCommand(): Command {
  const authCommand = new Command('auth');
  
  authCommand
    .description('Authentication commands for MisyBot')
    .option('-v, --verbose', 'Enable verbose output');
  
  // Login subcommand
  authCommand
    .command('login <email> <password>')
    .description('Log in to MisyBot')
    .action(async (email: string, password: string) => {
      await login(email, password);
    });
  
  // Register subcommand
  authCommand
    .command('register <email> <password> <name>')
    .description('Register a new account and log in')
    .action(async (email: string, password: string, name: string) => {
      await register(email, password, name);
    });
  
  // Logout subcommand
  authCommand
    .command('logout')
    .description('Log out from MisyBot')
    .action(() => {
      logout();
    });
  
  // Status subcommand
  authCommand
    .command('status')
    .description('Show authentication status')
    .action(() => {
      status();
    });
  
  return authCommand;
}