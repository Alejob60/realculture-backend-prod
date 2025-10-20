# Commit Message Template

## Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

## Types
- feat: A new feature
- fix: A bug fix
- docs: Documentation only changes
- style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- refactor: A code change that neither fixes a bug nor adds a feature
- perf: A code change that improves performance
- test: Adding missing tests or correcting existing tests
- build: Changes that affect the build system or external dependencies
- ci: Changes to our CI configuration files and scripts
- chore: Other changes that don't modify src or test files
- revert: Reverts a previous commit

## Scope
Optional. The scope could be anything specifying place of the commit change (e.g., api, auth, db, etc.)

## Subject
Brief summary of the change in present tense. Not capitalized. No period at the end.

## Body
Optional. Just as in subject, use imperative, present tense. Include motivation for the change and contrasts with previous behavior.

## Footer
Optional. Reference GitHub issues or other commits here.

---

## Example Commit Messages

```
feat(auth): add JWT authentication

Implement JWT-based authentication for all protected routes.
Users can now authenticate with email and password to receive
a JWT token for subsequent requests.

Closes #123
```

```
fix(media): resolve image generation timeout

Increase timeout for image generation requests from 30s to 60s
to accommodate larger images. Also add retry mechanism for
failed requests.

Fixes #456
```

```
docs: update API documentation

Add detailed descriptions for all endpoints including
request/response examples and error codes.
```