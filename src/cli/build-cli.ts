#!/usr/bin/env node

// Build script for the CLI tool
// This script compiles the TypeScript CLI files to JavaScript

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, '..', '..', 'dist', 'cli');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Compile TypeScript files to JavaScript
try {
  console.log('Building CLI tool...');
  
  // Compile the main CLI file
  execSync(
    `npx tsc ${path.join(__dirname, 'misy-cli.ts')} --outDir ${distDir} --esModuleInterop true --skipLibCheck true --declaration false`,
    { stdio: 'inherit' }
  );
  
  // Compile the auth command file
  execSync(
    `npx tsc ${path.join(__dirname, 'auth-command.ts')} --outDir ${distDir} --esModuleInterop true --skipLibCheck true --declaration false`,
    { stdio: 'inherit' }
  );
  
  // Make the CLI executable
  const cliPath = path.join(distDir, 'misy-cli.js');
  if (fs.existsSync(cliPath)) {
    fs.chmodSync(cliPath, '755');
  }
  
  console.log('✅ CLI tool built successfully!');
  console.log(`Run 'node ${cliPath} --help' to see available commands.`);
} catch (error) {
  console.error('❌ Failed to build CLI tool:', error);
  process.exit(1);
}