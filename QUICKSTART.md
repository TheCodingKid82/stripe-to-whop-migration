# MigrateToWhop - Quick Start Reference

**⚡ Fast setup guide for MigrateToWhop GitHub App**

## 🎯 What You Need

1. **GitHub App**: Named "MigrateToWhop"
2. **Railway Account**: For hosting
3. **API Keys**: 
   - Anthropic (Claude AI)
   - Whop
   - Stripe

## 🚀 5-Step Setup

### 1️⃣ GitHub App (5 minutes)

```
URL: https://github.com/settings/apps/new

Name: MigrateToWhop
Description: Automated migration tool from Stripe to Whop with AI-powered assistance via Claude
Homepage: https://github.com/TheCodingKid82/stripe-to-whop-migration
Webhook URL: [Update after Railway deployment]

Permissions:
- Contents: Read & write
- Issues: Read & write  
- Pull requests: Read & write
- Metadata: Read-only

Events:
☑️ Issues
☑️ Issue comment
☑️ Pull request
☑️ Push
```

**Save**: App ID, Client ID, Private Key (.pem)

### 2️⃣ Railway Deploy (3 minutes)

```
1. Go to https://railway.app
2. New Project → GitHub Repo
3. Select: TheCodingKid82/stripe-to-whop-migration
4. Branch: main (after merging PR #1)
5. Generate Domain
6. Copy URL
```

### 3️⃣ Environment Variables (5 minutes)

Add to Railway:

```bash
# GitHub (from step 1)
GITHUB_APP_ID=123456
GITHUB_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----...
GITHUB_WEBHOOK_SECRET=<generate with: openssl rand -hex 32>
GITHUB_CLIENT_ID=Iv1.xxxxx
GITHUB_CLIENT_SECRET=xxxxx

# Claude AI
ANTHROPIC_API_KEY=sk-ant-xxxxx
CLAUDE_MODEL=claude-3-5-sonnet-20241022

# Whop
WHOP_API_KEY=xxxxx
WHOP_API_URL=https://api.whop.com/v1

# Stripe
STRIPE_API_KEY=sk_live_xxxxx

# Server
PORT=3000
NODE_ENV=production
```

### 4️⃣ Update GitHub App (1 minute)

```
1. Go back to: https://github.com/settings/apps
2. Click: MigrateToWhop
3. Update Webhook URL: https://[your-railway-url].railway.app/webhooks/github
4. Save
```

### 5️⃣ Install & Test (2 minutes)

```
1. GitHub App settings → Install App
2. Select: TheCodingKid82/stripe-to-whop-migration
3. Install

Test:
curl https://[your-railway-url].railway.app/health

Create issue with title: "Test migration from Stripe"
→ Bot should respond! ✅
```

## 📞 Quick Links

- **GitHub App Settings**: https://github.com/settings/apps
- **Railway Dashboard**: https://railway.app/dashboard
- **Anthropic Console**: https://console.anthropic.com/
- **Full Setup Guide**: [docs/SETUP_GUIDE.md](docs/SETUP_GUIDE.md)
- **API Documentation**: [docs/API.md](docs/API.md)

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Bot not responding | Check Railway logs, verify webhook URL |
| Webhook errors | Verify webhook secret matches |
| Claude not working | Check ANTHROPIC_API_KEY in Railway |
| Deployment failed | Check Railway logs, verify package.json |

## 📋 Issues Tracker

- **Issue #2**: Complete setup checklist
- **Issue #3**: Rename existing app (if needed)
- **PR #1**: All code and configuration files

## ✅ Success Checklist

- [ ] GitHub App created: "MigrateToWhop"
- [ ] Railway deployed successfully
- [ ] All environment variables set
- [ ] Webhook URL updated
- [ ] App installed on repository
- [ ] Health check passes
- [ ] Test issue gets bot response

---

**Total Time: ~15-20 minutes** ⏱️

**Need help?** Open an issue or check [docs/SETUP_GUIDE.md](docs/SETUP_GUIDE.md)
