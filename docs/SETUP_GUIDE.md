# Complete Setup Guide: MigrateToWhop GitHub App

## Step-by-Step Setup Process

### Phase 1: GitHub App Creation

#### 1.1 Navigate to GitHub App Settings
1. Go to https://github.com/settings/apps
2. Click "New GitHub App"

#### 1.2 Configure Basic Information

**GitHub App name**: `MigrateToWhop`

**Description**: 
```
Automated migration tool from Stripe to Whop with AI-powered assistance via Claude
```

**Homepage URL**: 
```
https://github.com/TheCodingKid82/stripe-to-whop-migration
```

**Webhook URL** (temporary - update after Railway deployment):
```
https://example.com/webhooks/github
```

**Webhook secret**: Generate using:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Save this value - you'll need it for Railway!

#### 1.3 Set Permissions

**Repository permissions**:
- Contents: `Read & write`
- Issues: `Read & write`
- Metadata: `Read-only`
- Pull requests: `Read & write`
- Webhooks: `Read-only`
- Commit statuses: `Read & write`
- Checks: `Read & write`

**Subscribe to events**:
- [x] Issues
- [x] Issue comment
- [x] Pull request
- [x] Pull request review
- [x] Push
- [x] Repository
- [x] Status
- [x] Check run
- [x] Workflow run

#### 1.4 Complete App Creation
1. Click "Create GitHub App"
2. Download the private key (`.pem` file)
3. Save your App ID and Client ID

### Phase 2: Railway Deployment

#### 2.1 Create Railway Project
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose `TheCodingKid82/stripe-to-whop-migration`
5. Select the `setup-migrate-to-whop-app` branch

#### 2.2 Configure Environment Variables

Click "Variables" and add:

```bash
# GitHub App Configuration
GITHUB_APP_ID=123456
GITHUB_WEBHOOK_SECRET=your_webhook_secret_from_step_1.2
GITHUB_CLIENT_ID=Iv1.xxxxxxxxxxxxx
GITHUB_CLIENT_SECRET=your_client_secret

# GitHub Private Key (paste the entire .pem file content)
GITHUB_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----
Your private key content here...
-----END RSA PRIVATE KEY-----

# Claude AI Configuration
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
CLAUDE_MODEL=claude-3-5-sonnet-20241022

# Whop API
WHOP_API_KEY=your_whop_api_key
WHOP_API_URL=https://api.whop.com/v1

# Stripe API
STRIPE_API_KEY=sk_live_xxxxxxxxxxxxx

# Server Configuration
PORT=3000
NODE_ENV=production
```

#### 2.3 Deploy and Get URL
1. Railway will automatically deploy
2. Once deployed, click "Settings" → "Networking"
3. Click "Generate Domain"
4. Copy your Railway app URL (e.g., `https://your-app.railway.app`)

### Phase 3: Update GitHub App Configuration

#### 3.1 Update Webhook URL
1. Go back to https://github.com/settings/apps
2. Click on your "MigrateToWhop" app
3. Update **Webhook URL** to:
   ```
   https://your-app.railway.app/webhooks/github
   ```
4. Click "Save changes"

#### 3.2 Test Webhook
1. In GitHub App settings, scroll to "Recent Deliveries"
2. Click "Redeliver" on a test event
3. Check Railway logs to confirm receipt

### Phase 4: Install the App

#### 4.1 Install on Repository
1. In GitHub App settings, click "Install App"
2. Select your account: `TheCodingKid82`
3. Choose "Only select repositories"
4. Select `stripe-to-whop-migration`
5. Click "Install"

### Phase 5: API Keys Setup

#### 5.1 Anthropic (Claude) API Key
1. Go to https://console.anthropic.com/
2. Create an account or log in
3. Navigate to "API Keys"
4. Create a new key
5. Add to Railway environment variables

#### 5.2 Whop API Key
1. Log in to Whop dashboard
2. Go to Developer Settings
3. Create a new API key
4. Add to Railway environment variables

#### 5.3 Stripe API Key
1. Log in to Stripe dashboard
2. Go to Developers → API keys
3. Copy your Secret key
4. Add to Railway environment variables

### Phase 6: Testing

#### 6.1 Test Health Endpoint
```bash
curl https://your-app.railway.app/health
```

Expected response:
```json
{"status":"healthy"}
```

#### 6.2 Test Issue Creation
1. Create a test issue in your repository:
   ```markdown
   Title: Test migration from Stripe
   
   Body: I want to migrate 100 customers from Stripe to Whop.
   ```
2. Bot should comment with AI analysis

#### 6.3 Test Mention
1. Comment on the issue:
   ```markdown
   @MigrateToWhop How long will this take?
   ```
2. Bot should respond with AI-generated answer

### Phase 7: Verify Everything

#### Checklist:
- [ ] GitHub App created with name "MigrateToWhop"
- [ ] All permissions set correctly
- [ ] All events subscribed
- [ ] Private key downloaded and added to Railway
- [ ] Railway deployment successful
- [ ] Environment variables configured
- [ ] Webhook URL updated in GitHub App
- [ ] App installed on repository
- [ ] Anthropic API key working
- [ ] Health endpoint responding
- [ ] Bot responds to issues
- [ ] Bot responds to mentions
- [ ] Logs visible in Railway

## Troubleshooting

### Webhook Not Receiving Events
- Check webhook URL is correct
- Verify webhook secret matches
- Check Railway logs for errors
- Verify app is running

### Claude AI Not Responding
- Verify Anthropic API key is valid
- Check Railway environment variables
- Review Railway logs for API errors

### Bot Not Commenting
- Verify app is installed on repository
- Check app has "Issues: Write" permission
- Review Railway logs

### Migration Errors
- Verify Stripe API key is valid
- Verify Whop API key is valid
- Check API rate limits

## Next Steps

1. **Create Migration Issues**: Start tracking migration tasks
2. **Test Migration Scripts**: Run small test migrations
3. **Monitor Logs**: Watch Railway logs for issues
4. **Iterate**: Improve based on feedback

## Support

If you encounter issues:
1. Check Railway logs
2. Review GitHub webhook deliveries
3. Create an issue in the repository

---

**Setup completed! Your MigrateToWhop GitHub App is ready to use! 🎉**
