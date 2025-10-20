# Prompt for Integrating Auth Command in misy-cli

## Overview
This document provides a detailed prompt for implementing an authentication command in a CLI tool called `misy-cli` that will interact with the MisyBot backend API.

## Project Context
The MisyBot backend is built with NestJS and TypeScript, using JWT for authentication. The backend provides RESTful API endpoints for user authentication at `/auth/login` and `/auth/register`.

## Requirements for Auth Command

### 1. Command Structure
The auth command should support the following subcommands:
```
misy-cli auth login <email> <password>
misy-cli auth register <email> <password> <name>
misy-cli auth logout
misy-cli auth status
```

### 2. Login Functionality
- Accept email and password as arguments
- Send a POST request to the backend `/auth/login` endpoint
- Handle successful authentication by storing the JWT token
- Handle authentication errors appropriately
- Store the token securely for subsequent commands

### 3. Register Functionality
- Accept email, password, and name as arguments
- Send a POST request to the backend `/auth/register` endpoint
- Handle successful registration
- Handle registration errors (e.g., email already exists)

### 4. Logout Functionality
- Clear stored authentication tokens
- Provide confirmation of logout

### 5. Status Functionality
- Display current authentication status
- Show user information if authenticated
- Indicate if no user is currently authenticated

### 6. Token Management
- Store JWT tokens securely (consider using the system's keychain or secure storage)
- Automatically include the token in the Authorization header for authenticated requests
- Handle token expiration gracefully

## Technical Implementation Details

### Environment and Dependencies
- Use TypeScript for implementation (`.ts` files)
- Utilize the `commander` package for CLI argument parsing
- Use `axios` or `node-fetch` for HTTP requests
- Follow the existing project structure and conventions

### API Integration
- Base URL should be configurable via environment variable (e.g., `MISYBOT_API_URL`)
- Default to `http://localhost:3001` if no environment variable is set
- All requests should include the header: `Content-Type: application/json`
- Authenticated requests should include: `Authorization: Bearer <TOKEN>`

### Response Handling
- Parse JSON responses from the backend
- Display user-friendly messages for success and error cases
- Follow the backend's response structure for authentication endpoints

### Error Handling
- Handle network errors
- Handle HTTP error status codes
- Handle JSON parsing errors
- Provide meaningful error messages to the user

## Expected Backend Endpoints

### Login Endpoint
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "userpassword"
}

// Successful response
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

### Register Endpoint
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "userpassword",
  "name": "User Name"
}

// Successful response
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

## Security Considerations
- Never log or display JWT tokens
- Store tokens securely (consider OS keychain integration)
- Validate user inputs
- Use HTTPS in production environments

## Usage Examples

### Login
```
$ misy-cli auth login user@example.com mypassword
✅ Successfully logged in as user@example.com
```

### Register
```
$ misy-cli auth register newuser@example.com newpassword "New User"
✅ Successfully registered and logged in as newuser@example.com
```

### Logout
```
$ misy-cli auth logout
✅ Successfully logged out
```

### Status
```
$ misy-cli auth status
👤 Currently logged in as: user@example.com
🆔 User ID: 123e4567-e89b-12d3-a456-426614174000
```

## File Structure Suggestion
```
src/
├── cli/
│   ├── auth-command.ts
│   ├── cli.ts
│   └── utils/
│       ├── token-storage.ts
│       └── api-client.ts
├── types/
│   └── auth-types.ts
└── index.ts
```

## Implementation Steps
1. Create the CLI structure using Commander.js
2. Implement token storage mechanism
3. Create API client for backend communication
4. Implement each auth subcommand
5. Add error handling and user feedback
6. Test with the existing backend endpoints
7. Document usage instructions

## Testing Considerations
- Test with valid credentials
- Test with invalid credentials
- Test registration with existing emails
- Test token expiration scenarios
- Test offline scenarios

This prompt provides a comprehensive guide for implementing the auth command in misy-cli while maintaining consistency with the existing MisyBot backend architecture and authentication patterns.