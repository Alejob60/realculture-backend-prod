# Pre-Commit Checks

## Automated Verification Script

Before committing, run this series of checks to ensure system stability:

```bash
# 1. Check environment variables
node validate-env-variables.js

# 2. Run health check
node health-check.js

# 3. Test critical endpoints
node test-critical-endpoints.js

# 4. Verify Azure connections
node verify-azure-connection.js

# 5. Check user plan functionality
node verify-user-plan.js

# 6. Test media workflow
node test-complete-media-workflow.js

# 7. Run unit tests
npm test

# 8. Check for TypeScript compilation errors
npm run build
```

## Manual Verification Steps

### Code Quality
- [ ] Code follows TypeScript best practices
- [ ] No console.log statements in production code
- [ ] All functions have appropriate error handling
- [ ] Code is properly documented with JSDoc/TSDoc comments

### Security
- [ ] No sensitive information in logs
- [ ] Passwords and tokens are properly secured
- [ ] Input validation is in place for all user inputs
- [ ] CORS policies are correctly configured

### Performance
- [ ] Database queries are optimized
- [ ] Caching strategies are implemented where appropriate
- [ ] Memory leaks are checked and resolved
- [ ] Response times are within acceptable limits

### Documentation
- [ ] README.md is updated with any new features
- [ ] API documentation is current
- [ ] Environment variables are documented
- [ ] Deployment instructions are accurate

## Commit Process

1. Run all automated checks listed above
2. Complete manual verification checklist
3. Stage changes with `git add`
4. Use conventional commit message format
5. Push to remote repository