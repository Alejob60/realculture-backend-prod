# MisyBot CLI Tool Documentation

## Overview
The MisyBot CLI tool (`misy-cli`) is a command-line interface for interacting with the MisyBot backend services. It provides authentication capabilities and can be extended with additional commands.

## Installation

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Building the CLI Tool
To build the CLI tool, run the following command in the project root:

```bash
npm run cli:build
```

This will compile the TypeScript files and create executable JavaScript files in the `dist/cli` directory.

### Installing the CLI Globally
After building, you can install the CLI tool globally:

```bash
npm install -g .
```

This will make the `misy-cli` command available system-wide.

## Usage

### Authentication Commands

#### Login
Log in to the MisyBot service with your credentials:

```bash
misy-cli auth login <email> <password>
```

Example:
```bash
misy-cli auth login user@example.com mypassword
```

#### Register
Register a new account and log in:

```bash
misy-cli auth register <email> <password> <name>
```

Example:
```bash
misy-cli auth register newuser@example.com newpassword "New User"
```

#### Logout
Log out from the current session:

```bash
misy-cli auth logout
```

#### Status
Check the current authentication status:

```bash
misy-cli auth status
```

### Configuration

#### API URL
By default, the CLI tool connects to `http://localhost:3001`. To use a different URL, set the `MISYBOT_API_URL` environment variable:

```bash
export MISYBOT_API_URL=https://api.misybot.com
misy-cli auth login user@example.com mypassword
```

### Token Storage
Authentication tokens are stored securely in:
- **Windows**: `%USERPROFILE%\.misybot\token.json`
- **macOS/Linux**: `~/.misybot/token.json`

The token file contains the JWT token and user information, and is used for authenticated requests.

## Development

### Project Structure
```
src/
├── cli/                 # CLI tool source code
│   ├── auth-command.ts  # Authentication command implementation
│   ├── misy-cli.ts      # Main CLI entry point
│   ├── build-cli.ts     # CLI build script
│   └── index.ts         # CLI exports
├── types/               # TypeScript type definitions
│   └── auth-types.ts    # Authentication-related types
└── ...                  # Other project files
```

### Adding New Commands
To add new commands to the CLI tool:

1. Create a new command file in `src/cli/`
2. Implement the command using Commander.js
3. Export the command creation function in `src/cli/index.ts`
4. Add the command to the main program in `src/cli/misy-cli.ts`
5. Rebuild the CLI with `npm run cli:build`

### Extending Authentication
The authentication system can be extended by modifying `src/cli/auth-command.ts`:

1. Add new subcommands to the auth command
2. Implement the corresponding functions
3. Update the token storage mechanism if needed

## Troubleshooting

### Common Issues

#### "Command not found"
If you get a "command not found" error after installation, make sure:
1. The CLI was built successfully with `npm run cli:build`
2. The package was installed globally with `npm install -g .`
3. Your PATH includes the global npm bin directory

#### Authentication Failures
If authentication commands fail:
1. Verify the API URL is correct (check `MISYBOT_API_URL` environment variable)
2. Ensure the backend service is running
3. Check your credentials are correct
4. Verify network connectivity

#### Token Storage Issues
If you experience issues with token storage:
1. Check permissions on the `.misybot` directory
2. Ensure sufficient disk space is available
3. Try manually deleting the token file to reset authentication

## Security Considerations

### Token Storage
Tokens are stored in a JSON file in the user's home directory. While this is convenient, it's not the most secure approach for production use. For enhanced security, consider:

1. Using the system keychain (Windows Credential Manager, macOS Keychain, Linux Secret Service)
2. Encrypting the token file
3. Implementing token expiration checks

### Network Security
When using the CLI in production environments:
1. Always use HTTPS endpoints
2. Validate SSL certificates
3. Avoid logging sensitive information
4. Use environment variables for sensitive configuration

## Future Enhancements

### Planned Features
1. Integration with system keychain for secure token storage
2. Command history and auto-completion
3. Interactive mode for guided workflows
4. Additional commands for content management
5. Support for configuration files

### Contributing
To contribute to the CLI tool:
1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests if applicable
5. Submit a pull request

## Support
For issues, questions, or feature requests, please:
1. Check the existing documentation
2. Review open and closed GitHub issues
3. Create a new issue with detailed information