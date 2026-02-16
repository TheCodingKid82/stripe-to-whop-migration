const Anthropic = require('@anthropic-ai/sdk');

class ClaudeService {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    this.model = process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022';
  }

  async analyzeMigrationRequest(issueBody) {
    try {
      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: `You are an expert migration assistant helping users migrate from Stripe to Whop. 
          
Analyze this migration request and provide:
1. Key migration requirements
2. Potential challenges
3. Recommended steps
4. Estimated complexity (Low/Medium/High)

Request: ${issueBody}`
        }]
      });

      return message.content[0].text;
    } catch (error) {
      console.error('Claude API error:', error);
      return 'Unable to analyze migration request at this time. Please try again later.';
    }
  }

  async respondToComment(comment, context) {
    try {
      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: 1500,
        messages: [{
          role: 'user',
          content: `You are MigrateToWhop, an AI assistant helping with Stripe to Whop migrations.
          
Context: ${context}

User comment: ${comment}

Provide a helpful, actionable response.`
        }]
      });

      return message.content[0].text;
    } catch (error) {
      console.error('Claude API error:', error);
      return 'I encountered an error processing your request. Please try again.';
    }
  }

  async reviewMigrationCode(files) {
    try {
      const fileContents = files.map(f => 
        `File: ${f.filename}\nChanges: ${f.changes} lines\nStatus: ${f.status}`
      ).join('\n\n');

      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: `You are reviewing code changes for a Stripe to Whop migration.
          
Analyze these files and provide:
1. Code quality assessment
2. Migration best practices check
3. Potential issues or bugs
4. Security considerations
5. Recommendations for improvement

Files changed:
${fileContents}`
        }]
      });

      return message.content[0].text;
    } catch (error) {
      console.error('Claude API error:', error);
      return 'Unable to review code at this time.';
    }
  }

  async generateMigrationScript(stripeData) {
    try {
      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: 3000,
        messages: [{
          role: 'user',
          content: `Generate a migration script to convert Stripe data to Whop format.
          
Stripe data structure: ${JSON.stringify(stripeData, null, 2)}
          
Provide:
1. Complete migration script
2. Data mapping explanation
3. Validation steps`
        }]
      });

      return message.content[0].text;
    } catch (error) {
      console.error('Claude API error:', error);
      throw error;
    }
  }
}

module.exports = ClaudeService;
