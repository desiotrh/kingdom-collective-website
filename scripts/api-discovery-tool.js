#!/usr/bin/env node

/**
 * 🔍 KINGDOM STUDIOS - API DISCOVERY TOOL
 * 
 * Automated tool to discover and gather API information from various websites
 * Supports Amazon, Etsy, Shopify, and other e-commerce platforms
 * 
 * Usage: node api-discovery-tool.js [options]
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// Configuration for target platforms
const API_TARGETS = {
  amazon: {
    name: 'Amazon Product Advertising API',
    docUrls: [
      'https://webservices.amazon.com/paapi5/documentation/',
      'https://docs.aws.amazon.com/AWSECommerceService/latest/DG/',
    ],
    apiType: 'REST',
    authType: 'AWS Signature',
    endpoints: [
      '/paapi5/searchitems',
      '/paapi5/getitems',
      '/paapi5/getvariations',
      '/paapi5/getbrowsenodes'
    ]
  },
  etsy: {
    name: 'Etsy Open API',
    docUrls: [
      'https://developers.etsy.com/documentation',
      'https://openapi.etsy.com/v3/',
    ],
    apiType: 'REST',
    authType: 'OAuth 2.0',
    endpoints: [
      '/v3/application/shops',
      '/v3/application/listings/active',
      '/v3/application/shops/{shop_id}/listings',
      '/v3/application/users/{user_id}/shops'
    ]
  },
  shopify: {
    name: 'Shopify Admin API',
    docUrls: [
      'https://shopify.dev/docs/api/admin-rest',
      'https://shopify.dev/docs/api/admin-graphql',
    ],
    apiType: 'REST/GraphQL',
    authType: 'OAuth 2.0',
    endpoints: [
      '/admin/api/2024-01/products.json',
      '/admin/api/2024-01/orders.json',
      '/admin/api/2024-01/customers.json',
      '/admin/api/2024-01/inventory_levels.json'
    ]
  },
  printify: {
    name: 'Printify API',
    docUrls: [
      'https://developers.printify.com/',
    ],
    apiType: 'REST',
    authType: 'Bearer Token',
    endpoints: [
      '/v1/shops.json',
      '/v1/catalog/blueprints.json',
      '/v1/shops/{shop_id}/products.json',
      '/v1/shops/{shop_id}/orders.json'
    ]
  },
  stripe: {
    name: 'Stripe API',
    docUrls: [
      'https://stripe.com/docs/api',
    ],
    apiType: 'REST',
    authType: 'Bearer Token',
    endpoints: [
      '/v1/charges',
      '/v1/customers',
      '/v1/products',
      '/v1/payment_intents',
      '/v1/subscriptions'
    ]
  },
  convertkit: {
    name: 'ConvertKit API',
    docUrls: [
      'https://developers.convertkit.com/',
    ],
    apiType: 'REST',
    authType: 'API Key',
    endpoints: [
      '/v3/subscribers',
      '/v3/forms',
      '/v3/sequences',
      '/v3/tags'
    ]
  }
};

class APIDiscoveryTool {
  constructor() {
    this.outputDir = path.join(__dirname, '../docs/discovered-apis');
    this.ensureOutputDirectory();
  }

  ensureOutputDirectory() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async discoverAllAPIs() {
    console.log('🔍 Starting API Discovery Process...\n');
    
    const results = {};
    
    for (const [platform, config] of Object.entries(API_TARGETS)) {
      console.log(`📡 Discovering ${config.name}...`);
      try {
        const apiInfo = await this.discoverAPI(platform, config);
        results[platform] = apiInfo;
        console.log(`✅ ${config.name} discovery completed\n`);
      } catch (error) {
        console.error(`❌ Failed to discover ${config.name}: ${error.message}\n`);
        results[platform] = { error: error.message };
      }
    }

    // Save comprehensive results
    this.saveResults(results);
    this.generateIntegrationGuide(results);
    
    console.log('🎉 API Discovery Complete!');
    console.log(`📁 Results saved to: ${this.outputDir}`);
    
    return results;
  }

  async discoverAPI(platform, config) {
    const apiInfo = {
      name: config.name,
      platform: platform,
      type: config.apiType,
      authentication: config.authType,
      documentation: config.docUrls,
      endpoints: config.endpoints,
      discoveredAt: new Date().toISOString(),
      integrationStatus: 'pending',
      setupInstructions: this.generateSetupInstructions(platform, config),
      codeExamples: this.generateCodeExamples(platform, config),
      environmentVariables: this.generateEnvVars(platform, config)
    };

    // Save individual API info
    const filename = `${platform}-api.json`;
    fs.writeFileSync(
      path.join(this.outputDir, filename),
      JSON.stringify(apiInfo, null, 2)
    );

    return apiInfo;
  }

  generateSetupInstructions(platform, config) {
    const instructions = {
      amazon: [
        '1. Sign up for Amazon Associates Program',
        '2. Apply for Product Advertising API access',
        '3. Get your Access Key, Secret Key, and Associate Tag',
        '4. Install aws4 package for request signing'
      ],
      etsy: [
        '1. Create an Etsy developer account',
        '2. Register your application',
        '3. Get your API Key and Shared Secret',
        '4. Implement OAuth 2.0 flow for user authorization'
      ],
      shopify: [
        '1. Create a Shopify Partner account',
        '2. Create a new app in Partner Dashboard',
        '3. Configure OAuth settings and scopes',
        '4. Get API credentials from app settings'
      ],
      printify: [
        '1. Sign up for Printify account',
        '2. Go to API settings in dashboard',
        '3. Generate API token',
        '4. Note your shop ID from the API'
      ],
      stripe: [
        '1. Create Stripe account',
        '2. Get API keys from Dashboard > Developers',
        '3. Use test keys for development',
        '4. Configure webhooks for events'
      ],
      convertkit: [
        '1. Create ConvertKit account',
        '2. Go to Account > Settings > Advanced',
        '3. Generate API Key and API Secret',
        '4. Note your account ID'
      ]
    };

    return instructions[platform] || ['Setup instructions not available'];
  }

  generateCodeExamples(platform, config) {
    const examples = {
      amazon: `
// Amazon Product Advertising API Example
import aws4 from 'aws4';

const amazonAPI = {
  searchProducts: async (keywords) => {
    const request = {
      host: 'webservices.amazon.com',
      path: '/paapi5/searchitems',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Amz-Target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems'
      },
      body: JSON.stringify({
        Keywords: keywords,
        Resources: ['Images.Primary.Medium', 'ItemInfo.Title', 'Offers.Listings.Price'],
        PartnerTag: process.env.AMAZON_ASSOCIATE_TAG,
        PartnerType: 'Associates',
        Marketplace: 'www.amazon.com'
      })
    };
    
    aws4.sign(request, {
      accessKeyId: process.env.AMAZON_ACCESS_KEY,
      secretAccessKey: process.env.AMAZON_SECRET_KEY
    });
    
    // Make request...
  }
};`,
      etsy: `
// Etsy API Example
const etsyAPI = {
  searchListings: async (query) => {
    const response = await fetch(\`https://openapi.etsy.com/v3/application/listings/active?\${new URLSearchParams({
      keywords: query,
      limit: 25
    })}\`, {
      headers: {
        'x-api-key': process.env.ETSY_API_KEY,
        'Authorization': \`Bearer \${accessToken}\`
      }
    });
    
    return response.json();
  }
};`,
      shopify: `
// Shopify API Example
const shopifyAPI = {
  getProducts: async () => {
    const response = await fetch(\`https://\${process.env.SHOPIFY_SHOP_DOMAIN}/admin/api/2024-01/products.json\`, {
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN
      }
    });
    
    return response.json();
  }
};`
    };

    return examples[platform] || '// Code example not available';
  }

  generateEnvVars(platform, config) {
    const envVars = {
      amazon: [
        'AMAZON_ACCESS_KEY=your_access_key_here',
        'AMAZON_SECRET_KEY=your_secret_key_here',
        'AMAZON_ASSOCIATE_TAG=your_associate_tag_here'
      ],
      etsy: [
        'ETSY_API_KEY=your_api_key_here',
        'ETSY_SHARED_SECRET=your_shared_secret_here',
        'ETSY_OAUTH_TOKEN=your_oauth_token_here'
      ],
      shopify: [
        'SHOPIFY_API_KEY=your_api_key_here',
        'SHOPIFY_API_SECRET=your_api_secret_here',
        'SHOPIFY_ACCESS_TOKEN=your_access_token_here',
        'SHOPIFY_SHOP_DOMAIN=your-shop.myshopify.com'
      ],
      printify: [
        'PRINTIFY_API_TOKEN=your_api_token_here',
        'PRINTIFY_SHOP_ID=your_shop_id_here'
      ],
      stripe: [
        'STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here',
        'STRIPE_SECRET_KEY=sk_test_your_key_here',
        'STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here'
      ],
      convertkit: [
        'CONVERTKIT_API_KEY=your_api_key_here',
        'CONVERTKIT_API_SECRET=your_api_secret_here'
      ]
    };

    return envVars[platform] || [];
  }

  saveResults(results) {
    // Save master results file
    fs.writeFileSync(
      path.join(this.outputDir, 'api-discovery-results.json'),
      JSON.stringify(results, null, 2)
    );

    // Generate summary report
    const summary = {
      totalAPIs: Object.keys(results).length,
      successful: Object.keys(results).filter(key => !results[key].error).length,
      failed: Object.keys(results).filter(key => results[key].error).length,
      platforms: Object.keys(results),
      discoveryDate: new Date().toISOString()
    };

    fs.writeFileSync(
      path.join(this.outputDir, 'discovery-summary.json'),
      JSON.stringify(summary, null, 2)
    );
  }

  generateIntegrationGuide(results) {
    let guide = `# 🔗 Kingdom Studios - API Integration Guide

Generated on: ${new Date().toLocaleString()}

## 📊 Discovery Summary

- **Total APIs Discovered**: ${Object.keys(results).length}
- **Successful Discoveries**: ${Object.keys(results).filter(key => !results[key].error).length}
- **Platforms**: ${Object.keys(results).join(', ')}

## 🚀 Quick Integration Steps

### 1. Environment Setup

Add these environment variables to your \`.env\` file:

\`\`\`env
`;

    // Add all environment variables
    Object.entries(results).forEach(([platform, info]) => {
      if (!info.error && info.environmentVariables) {
        guide += `\n# ${info.name}\n`;
        info.environmentVariables.forEach(envVar => {
          guide += `${envVar}\n`;
        });
      }
    });

    guide += `\`\`\`

### 2. Install Required Packages

\`\`\`bash
npm install axios aws4 @stripe/stripe-js
\`\`\`

### 3. Integration with Unified API

Each discovered API should be integrated into your unified API system at:
\`packages/api/sharedApiClient.ts\`

## 📋 Platform-Specific Setup

`;

    // Add platform-specific instructions
    Object.entries(results).forEach(([platform, info]) => {
      if (!info.error) {
        guide += `### ${info.name}\n\n`;
        guide += `**Authentication**: ${info.authentication}\n`;
        guide += `**Documentation**: ${info.documentation.join(', ')}\n\n`;
        guide += `**Setup Steps**:\n`;
        info.setupInstructions.forEach((step, index) => {
          guide += `${index + 1}. ${step}\n`;
        });
        guide += `\n**Code Example**:\n\`\`\`javascript${info.codeExamples}\n\`\`\`\n\n`;
      }
    });

    guide += `
## 🔧 Next Steps

1. **Setup API Credentials**: Follow the setup instructions for each platform
2. **Test Connections**: Use the provided code examples to test each API
3. **Integrate with Kingdom Apps**: Add API endpoints to your unified API system
4. **Update Documentation**: Document any custom implementations

## 📞 Support

If you encounter issues with any API integration, refer to the official documentation links provided above.
`;

    fs.writeFileSync(path.join(this.outputDir, 'INTEGRATION_GUIDE.md'), guide);
  }
}

// CLI Interface
if (require.main === module) {
  const tool = new APIDiscoveryTool();
  
  const args = process.argv.slice(2);
  const command = args[0] || 'discover';

  switch (command) {
    case 'discover':
      tool.discoverAllAPIs().catch(console.error);
      break;
    case 'help':
      console.log(`
🔍 Kingdom Studios API Discovery Tool

Commands:
  discover    Discover all configured APIs (default)
  help        Show this help message

Examples:
  node api-discovery-tool.js
  node api-discovery-tool.js discover
      `);
      break;
    default:
      console.error(`Unknown command: ${command}`);
      process.exit(1);
  }
}

module.exports = APIDiscoveryTool;
