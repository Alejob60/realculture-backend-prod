#!/usr/bin/env node

import { Command } from 'commander';
import { createAuthCommand } from './auth-command';

// Create the main program
const program = new Command();

// Set the CLI name and description
program
  .name('misy-cli')
  .description('CLI tool for interacting with MisyBot')
  .version('1.0.0');

// Add the auth command
program.addCommand(createAuthCommand());

// Parse the command line arguments
program.parse(process.argv);

// If no command is provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}