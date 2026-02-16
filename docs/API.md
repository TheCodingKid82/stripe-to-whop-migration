# API Documentation

## MigrateToWhop GitHub App API

### Base URL
```
https://your-app.railway.app
```

## Endpoints

### Health Check

#### GET `/`
Returns basic app information.

**Response:**
```json
{
  "status": "ok",
  "app": "MigrateToWhop",
  "version": "1.0.0"
}
```

#### GET `/health`
Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "healthy"
}
```

### Webhooks

#### POST `/webhooks/github`
Receives GitHub webhook events.

**Headers:**
- `x-github-delivery`: Unique delivery ID
- `x-github-event`: Event type
- `x-hub-signature-256`: HMAC signature for verification

**Supported Events:**
- `issues.opened`
- `issue_comment.created`
- `pull_request.opened`
- `pull_request.synchronize`
- `pull_request_review.submitted`

## GitHub App Interactions

### Issue Events

#### Issue Opened
When a new issue is created:
- Bot checks if issue contains migration keywords
- Uses Claude AI to analyze the request
- Posts analysis as a comment

**Trigger Keywords:**
- "migrate"
- "migration"
- "stripe"
- "whop"

#### Issue Comment
When `@MigrateToWhop` is mentioned:
- Bot analyzes the comment and issue context
- Uses Claude AI to generate a response
- Posts response as a comment

### Pull Request Events

#### PR Opened
When a new PR is created:
- Bot fetches changed files
- Uses Claude AI to review migration code
- Posts review with suggestions

## Claude AI Service

### Analyze Migration Request
```javascript
await claudeService.analyzeMigrationRequest(issueBody)
```

**Returns:**
- Key migration requirements
- Potential challenges
- Recommended steps
- Complexity estimate

### Respond to Comment
```javascript
await claudeService.respondToComment(comment, context)
```

**Returns:**
- Contextual response to user question

### Review Migration Code
```javascript
await claudeService.reviewMigrationCode(files)
```

**Returns:**
- Code quality assessment
- Best practices check
- Potential issues
- Security considerations
- Recommendations

### Generate Migration Script
```javascript
await claudeService.generateMigrationScript(stripeData)
```

**Returns:**
- Complete migration script
- Data mapping explanation
- Validation steps

## Migration Service

### Fetch Stripe Data

#### Get Customers
```javascript
await migrationService.fetchStripeCustomers(limit)
```

#### Get Subscriptions
```javascript
await migrationService.fetchStripeSubscriptions(limit)
```

### Create Whop Resources

#### Create User
```javascript
await migrationService.createWhopUser(userData)
```

#### Create Membership
```javascript
await migrationService.createWhopMembership(membershipData)
```

### Migration Operations

#### Migrate Single Customer
```javascript
await migrationService.migrateCustomer(stripeCustomer)
```

**Returns:**
```json
{
  "success": true,
  "stripeId": "cus_xxxxx",
  "whopId": "user_xxxxx"
}
```

#### Migrate Batch
```javascript
await migrationService.migrateBatch(customers)
```

**Returns:** Array of migration results

#### Generate Report
```javascript
migrationService.generateMigrationReport(results)
```

**Returns:**
```json
{
  "total": 100,
  "successful": 95,
  "failed": 5,
  "successRate": "95.00%",
  "details": [...]
}
```

## Rate Limits

### GitHub API
- 5,000 requests per hour for authenticated requests
- Check `X-RateLimit-Remaining` header

### Anthropic Claude API
- Depends on your plan
- Check https://docs.anthropic.com/claude/reference/rate-limits

### Stripe API
- 100 read requests per second
- 100 write requests per second

### Whop API
- Contact Whop for specific limits

## Error Handling

All services include error handling:

```javascript
try {
  const result = await service.operation();
  return result;
} catch (error) {
  console.error('Operation failed:', error);
  return fallbackResponse;
}
```

## Security

### Webhook Verification
All GitHub webhooks are verified using HMAC SHA-256:
```javascript
const signature = req.headers['x-hub-signature-256'];
const isValid = verifySignature(payload, signature, secret);
```

### API Key Storage
- All keys stored as environment variables
- Never logged or exposed
- Rotate regularly

## Logging

Logs are sent to Railway:
```javascript
console.log('Info message');
console.error('Error message');
```

View logs:
```bash
railway logs
```

## Examples

### Complete Migration Flow

1. **Create Issue**
```markdown
Title: Migrate 500 customers from Stripe

I need help migrating 500 customers with active subscriptions.
```

2. **Bot Analyzes**
```markdown
## 🤖 MigrateToWhop AI Analysis

Key Requirements:
- Migrate 500 customers
- Preserve active subscriptions
- Maintain payment history

Recommended Steps:
1. Export Stripe data
2. Create mapping script
3. Test with 10 customers
4. Full migration
5. Verification

Complexity: Medium
```

3. **Ask Question**
```markdown
@MigrateToWhop What about failed payments?
```

4. **Bot Responds**
```markdown
Failed payments should be handled by:
1. Exporting payment history
2. Creating payment records in Whop
3. Setting up retry logic
4. Notifying customers
```

---

For more information, see the [README](../README.md) or create an issue.
