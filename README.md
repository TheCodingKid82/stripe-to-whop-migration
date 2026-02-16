# MigrateToWhop - GitHub App

**Automated migration tool from Stripe to Whop with AI-powered assistance via Claude**

## 🚀 Overview

MigrateToWhop is a GitHub App that helps automate the migration process from Stripe to Whop. It uses Claude AI (Anthropic) to provide intelligent assistance, code reviews, and migration recommendations.

## ✨ Features

- **AI-Powered Analysis**: Uses Claude AI to analyze migration requests and provide recommendations
- **Automated Code Reviews**: Reviews pull requests with migration code and provides feedback
- **Interactive Assistance**: Responds to comments and questions about the migration process
- **Stripe Data Extraction**: Fetches customers, subscriptions, and payment data from Stripe
- **Whop API Integration**: Creates users and memberships in Whop
- **Migration Reports**: Generates detailed reports of migration progress and results
- **Webhook Integration**: Responds to GitHub events in real-time

## 📋 Prerequisites

- Node.js 18+
- GitHub App credentials
- Anthropic API key (for Claude AI)
- Stripe API key (source)
- Whop API key (destination)
- Railway account (for deployment)

## 🔧 Setup Instructions

### 1. Create GitHub App

1. Go to GitHub Settings → Developer settings → GitHub Apps → New GitHub App
2. Fill in the details:
   - **GitHub App name**: MigrateToWhop
   - **Homepage URL**: `https://github.com/TheCodingKid82/stripe-to-whop-migration`
   - **Webhook URL**: Your Railway deployment URL + `/webhooks/github`
   - **Webhook secret**: Generate a secure random string

3. Set permissions:
   - Repository permissions:
     - Contents: Read & write
     - Issues: Read & write
     - Pull requests: Read & write
     - Metadata: Read-only
   - Subscribe to events:
     - Issues
     - Issue comment
     - Pull request
     - Pull request review
     - Push

4. Create the app and download the private key

### 2. Deploy to Railway

1. Create a new project on Railway
2. Connect your GitHub repository: `TheCodingKid82/stripe-to-whop-migration`
3. Add environment variables:

```bash
GITHUB_APP_ID=your_app_id
GITHUB_PRIVATE_KEY=your_private_key_content
GITHUB_WEBHOOK_SECRET=your_webhook_secret
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret

ANTHROPIC_API_KEY=your_anthropic_api_key
CLAUDE_MODEL=claude-3-5-sonnet-20241022

WHOP_API_KEY=your_whop_api_key
WHOP_API_URL=https://api.whop.com/v1

STRIPE_API_KEY=your_stripe_api_key

PORT=3000
NODE_ENV=production
```

4. Deploy the application
5. Copy the Railway deployment URL
6. Update your GitHub App webhook URL with the Railway URL

### 3. Install the App

1. Go to your GitHub App settings
2. Click "Install App"
3. Select the repository where you want to use it
4. Grant the requested permissions

## 🎯 Usage

### Create Migration Issue

Create an issue in your repository with details about your migration:

```markdown
Title: Migrate from Stripe to Whop

Body:
I need to migrate 500 customers from Stripe to Whop.

Current setup:
- Stripe subscription plans: Basic ($10/mo), Pro ($20/mo), Enterprise ($50/mo)
- Total active subscriptions: 450
- Monthly recurring revenue: $15,000

Requirements:
- Maintain subscription status
- Preserve customer data
- Minimal downtime
```

The bot will automatically analyze your request and provide recommendations.

### Ask Questions

Mention `@MigrateToWhop` in issue comments to ask questions:

```markdown
@MigrateToWhop How should I handle failed payment methods during migration?
```

### Code Review

Open a pull request with migration code and the bot will automatically review it using Claude AI.

## 📁 Project Structure

```
stripe-to-whop-migration/
├── src/
│   ├── index.js              # Main server and webhook handlers
│   └── services/
│       ├── claude.js          # Claude AI integration
│       └── migration.js       # Migration logic
├── app.yml                    # GitHub App manifest
├── package.json              # Dependencies
├── .env.example              # Environment variables template
├── .gitignore               # Git ignore rules
└── README.md                # This file
```

## 🔐 Security

- Never commit private keys or API keys to the repository
- Use environment variables for all secrets
- Keep your webhook secret secure
- Regularly rotate API keys
- Use Railway's secret management for sensitive data

## 🔄 Migration Process

1. **Analysis**: Bot analyzes your Stripe setup
2. **Planning**: Generates migration plan with Claude AI
3. **Extraction**: Fetches data from Stripe API
4. **Transformation**: Maps Stripe data to Whop format
5. **Loading**: Creates users and memberships in Whop
6. **Verification**: Validates migrated data
7. **Reporting**: Generates detailed migration report

## 📊 API Endpoints

- `GET /` - Health check and app info
- `GET /health` - Health status
- `POST /webhooks/github` - GitHub webhook receiver

## 🤖 Claude AI Integration

The app uses Claude 3.5 Sonnet for:
- Migration request analysis
- Code review and suggestions
- Answering migration questions
- Generating migration scripts
- Best practices recommendations

## 📝 License

MIT

## 👨‍💻 Author

TheCodingKid82

## 🙏 Support

For issues or questions, create an issue in this repository.
