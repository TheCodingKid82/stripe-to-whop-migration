require('dotenv').config();
const express = require('express');
const { Webhooks } = require('@octokit/webhooks');
const { App } = require('@octokit/app');
const ClaudeService = require('./services/claude');
const MigrationService = require('./services/migration');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize GitHub App
const githubApp = new App({
  appId: process.env.GITHUB_APP_ID,
  privateKey: process.env.GITHUB_PRIVATE_KEY || require('fs').readFileSync(process.env.GITHUB_PRIVATE_KEY_PATH, 'utf8'),
  webhooks: {
    secret: process.env.GITHUB_WEBHOOK_SECRET
  }
});

// Initialize Webhooks
const webhooks = new Webhooks({
  secret: process.env.GITHUB_WEBHOOK_SECRET
});

// Initialize Services
const claudeService = new ClaudeService();
const migrationService = new MigrationService();

// Middleware
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    app: 'MigrateToWhop',
    version: '1.0.0'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// GitHub Webhooks endpoint
app.post('/webhooks/github', async (req, res) => {
  try {
    await webhooks.verifyAndReceive({
      id: req.headers['x-github-delivery'],
      name: req.headers['x-github-event'],
      signature: req.headers['x-hub-signature-256'],
      payload: JSON.stringify(req.body)
    });
    res.status(200).send('Webhook received');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Webhook processing failed');
  }
});

// Webhook event handlers
webhooks.on('issues.opened', async ({ payload, octokit }) => {
  console.log('Issue opened:', payload.issue.number);
  
  // Check if issue is about migration
  if (payload.issue.title.toLowerCase().includes('migrate') || 
      payload.issue.body.toLowerCase().includes('stripe')) {
    
    // Use Claude AI to analyze the migration request
    const analysis = await claudeService.analyzeMigrationRequest(payload.issue.body);
    
    // Comment with AI analysis and next steps
    const installation = await githubApp.octokit.request(
      'GET /repos/{owner}/{repo}/installation',
      {
        owner: payload.repository.owner.login,
        repo: payload.repository.name
      }
    );
    
    const octokit = await githubApp.getInstallationOctokit(installation.data.id);
    
    await octokit.issues.createComment({
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      issue_number: payload.issue.number,
      body: `## 🤖 MigrateToWhop AI Analysis\n\n${analysis}\n\n---\n*Powered by Claude AI*`
    });
  }
});

webhooks.on('issue_comment.created', async ({ payload }) => {
  console.log('Comment created on issue:', payload.issue.number);
  
  // Check if bot is mentioned
  if (payload.comment.body.includes('@MigrateToWhop')) {
    const response = await claudeService.respondToComment(
      payload.comment.body,
      payload.issue.body
    );
    
    const installation = await githubApp.octokit.request(
      'GET /repos/{owner}/{repo}/installation',
      {
        owner: payload.repository.owner.login,
        repo: payload.repository.name
      }
    );
    
    const octokit = await githubApp.getInstallationOctokit(installation.data.id);
    
    await octokit.issues.createComment({
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      issue_number: payload.issue.number,
      body: response
    });
  }
});

webhooks.on('pull_request.opened', async ({ payload }) => {
  console.log('PR opened:', payload.pull_request.number);
  
  // Use Claude to review migration code
  const installation = await githubApp.octokit.request(
    'GET /repos/{owner}/{repo}/installation',
    {
      owner: payload.repository.owner.login,
      repo: payload.repository.name
    }
  );
  
  const octokit = await githubApp.getInstallationOctokit(installation.data.id);
  
  const files = await octokit.pulls.listFiles({
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    pull_number: payload.pull_request.number
  });
  
  const review = await claudeService.reviewMigrationCode(files.data);
  
  await octokit.pulls.createReview({
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    pull_number: payload.pull_request.number,
    body: `## 🔍 AI-Powered Migration Review\n\n${review}`,
    event: 'COMMENT'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MigrateToWhop server running on port ${PORT}`);
  console.log(`📝 Webhook endpoint: /webhooks/github`);
});

module.exports = app;
