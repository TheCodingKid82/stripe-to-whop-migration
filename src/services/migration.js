const axios = require('axios');

class MigrationService {
  constructor() {
    this.stripeApiKey = process.env.STRIPE_API_KEY;
    this.whopApiKey = process.env.WHOP_API_KEY;
    this.whopApiUrl = process.env.WHOP_API_URL || 'https://api.whop.com/v1';
  }

  async fetchStripeCustomers(limit = 100) {
    try {
      const response = await axios.get('https://api.stripe.com/v1/customers', {
        headers: {
          'Authorization': `Bearer ${this.stripeApiKey}`
        },
        params: { limit }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching Stripe customers:', error);
      throw error;
    }
  }

  async fetchStripeSubscriptions(limit = 100) {
    try {
      const response = await axios.get('https://api.stripe.com/v1/subscriptions', {
        headers: {
          'Authorization': `Bearer ${this.stripeApiKey}`
        },
        params: { limit }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching Stripe subscriptions:', error);
      throw error;
    }
  }

  async createWhopUser(userData) {
    try {
      const response = await axios.post(`${this.whopApiUrl}/users`, userData, {
        headers: {
          'Authorization': `Bearer ${this.whopApiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating Whop user:', error);
      throw error;
    }
  }

  async createWhopMembership(membershipData) {
    try {
      const response = await axios.post(`${this.whopApiUrl}/memberships`, membershipData, {
        headers: {
          'Authorization': `Bearer ${this.whopApiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating Whop membership:', error);
      throw error;
    }
  }

  mapStripeToWhopUser(stripeCustomer) {
    return {
      email: stripeCustomer.email,
      name: stripeCustomer.name,
      metadata: {
        stripe_customer_id: stripeCustomer.id,
        migrated_at: new Date().toISOString()
      }
    };
  }

  mapStripeToWhopSubscription(stripeSubscription) {
    return {
      plan_id: stripeSubscription.items.data[0]?.price?.id,
      status: stripeSubscription.status === 'active' ? 'active' : 'cancelled',
      metadata: {
        stripe_subscription_id: stripeSubscription.id,
        migrated_at: new Date().toISOString()
      }
    };
  }

  async migrateCustomer(stripeCustomer) {
    try {
      const whopUser = this.mapStripeToWhopUser(stripeCustomer);
      const createdUser = await this.createWhopUser(whopUser);
      return {
        success: true,
        stripeId: stripeCustomer.id,
        whopId: createdUser.id
      };
    } catch (error) {
      return {
        success: false,
        stripeId: stripeCustomer.id,
        error: error.message
      };
    }
  }

  async migrateBatch(customers) {
    const results = [];
    for (const customer of customers) {
      const result = await this.migrateCustomer(customer);
      results.push(result);
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return results;
  }

  generateMigrationReport(results) {
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    return {
      total: results.length,
      successful,
      failed,
      successRate: ((successful / results.length) * 100).toFixed(2) + '%',
      details: results
    };
  }
}

module.exports = MigrationService;
