import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';

interface APIInfo {
  name: string;
  platform: string;
  type: string;
  authentication: string;
  documentation: string[];
  endpoints: string[];
  discoveredAt: string;
  status: 'discovered' | 'integrated' | 'error';
}

export function activate(context: vscode.ExtensionContext) {
  console.log('Kingdom API Discovery extension is now active!');

  // Register commands
  const discoverCommand = vscode.commands.registerCommand('kingdom-api-discovery.discover', async () => {
    await discoverAPIs();
  });

  const manageCommand = vscode.commands.registerCommand('kingdom-api-discovery.manage', async () => {
    await manageAPIs();
  });

  const integrateCommand = vscode.commands.registerCommand('kingdom-api-discovery.integrate', async (apiInfo: APIInfo) => {
    await integrateAPI(apiInfo);
  });

  // Register tree data providers
  const apiProvider = new APITreeDataProvider();
  vscode.window.createTreeView('discoveredApis', { treeDataProvider: apiProvider });

  context.subscriptions.push(discoverCommand, manageCommand, integrateCommand);

  // Auto-discover if enabled
  const config = vscode.workspace.getConfiguration('kingdomApiDiscovery');
  if (config.get('autoDiscovery')) {
    discoverAPIs();
  }
}

async function discoverAPIs() {
  const progress = await vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: "Discovering APIs...",
    cancellable: false
  }, async (progress) => {
    progress.report({ increment: 0, message: "Starting discovery process..." });

    const config = vscode.workspace.getConfiguration('kingdomApiDiscovery');
    const platforms = config.get<string[]>('platforms') || [];
    const outputDir = config.get<string>('outputDirectory') || 'docs/discovered-apis';

    // Ensure output directory exists
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspaceRoot) {
      vscode.window.showErrorMessage('No workspace folder found');
      return;
    }

    const fullOutputDir = path.join(workspaceRoot, outputDir);
    if (!fs.existsSync(fullOutputDir)) {
      fs.mkdirSync(fullOutputDir, { recursive: true });
    }

    const discoveredAPIs: { [key: string]: APIInfo } = {};
    const totalPlatforms = platforms.length;

    for (let i = 0; i < platforms.length; i++) {
      const platform = platforms[i];
      progress.report({ 
        increment: (i / totalPlatforms) * 100, 
        message: `Discovering ${platform} API...` 
      });

      try {
        const apiInfo = await discoverPlatformAPI(platform);
        discoveredAPIs[platform] = apiInfo;
        
        // Save individual API file
        const apiFile = path.join(fullOutputDir, `${platform}-api.json`);
        fs.writeFileSync(apiFile, JSON.stringify(apiInfo, null, 2));
        
      } catch (error) {
        console.error(`Failed to discover ${platform} API:`, error);
        discoveredAPIs[platform] = {
          name: platform,
          platform: platform,
          type: 'unknown',
          authentication: 'unknown',
          documentation: [],
          endpoints: [],
          discoveredAt: new Date().toISOString(),
          status: 'error'
        };
      }
    }

    // Save master results
    const resultsFile = path.join(fullOutputDir, 'api-discovery-results.json');
    fs.writeFileSync(resultsFile, JSON.stringify(discoveredAPIs, null, 2));

    progress.report({ increment: 100, message: "Discovery complete!" });

    vscode.window.showInformationMessage(
      `API Discovery complete! Found ${Object.keys(discoveredAPIs).length} APIs. Results saved to ${outputDir}`
    );

    // Refresh tree view
    vscode.commands.executeCommand('discoveredApis.refresh');
  });
}

async function discoverPlatformAPI(platform: string): Promise<APIInfo> {
  // Platform-specific API discovery logic
  const platformConfigs = {
    amazon: {
      name: 'Amazon Product Advertising API',
      docUrls: ['https://webservices.amazon.com/paapi5/documentation/'],
      type: 'REST',
      auth: 'AWS Signature'
    },
    etsy: {
      name: 'Etsy Open API',
      docUrls: ['https://developers.etsy.com/documentation'],
      type: 'REST',
      auth: 'OAuth 2.0'
    },
    shopify: {
      name: 'Shopify Admin API',
      docUrls: ['https://shopify.dev/docs/api/admin-rest'],
      type: 'REST/GraphQL',
      auth: 'OAuth 2.0'
    },
    stripe: {
      name: 'Stripe API',
      docUrls: ['https://stripe.com/docs/api'],
      type: 'REST',
      auth: 'Bearer Token'
    },
    printify: {
      name: 'Printify API',
      docUrls: ['https://developers.printify.com/'],
      type: 'REST',
      auth: 'Bearer Token'
    }
  };

  const config = platformConfigs[platform as keyof typeof platformConfigs];
  if (!config) {
    throw new Error(`Unknown platform: ${platform}`);
  }

  // Scrape documentation to find endpoints
  const endpoints = await scrapeAPIEndpoints(config.docUrls[0]);

  return {
    name: config.name,
    platform: platform,
    type: config.type,
    authentication: config.auth,
    documentation: config.docUrls,
    endpoints: endpoints,
    discoveredAt: new Date().toISOString(),
    status: 'discovered'
  };
}

async function scrapeAPIEndpoints(docUrl: string): Promise<string[]> {
  try {
    const response = await axios.get(docUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const endpoints: string[] = [];

    // Look for common patterns in API documentation
    $('code, pre, .endpoint, .api-endpoint').each((i, element) => {
      const text = $(element).text();
      const endpointMatches = text.match(/\/[a-zA-Z0-9\/_\-\{\}]+/g);
      if (endpointMatches) {
        endpoints.push(...endpointMatches);
      }
    });

    // Remove duplicates and filter valid endpoints
    return [...new Set(endpoints)]
      .filter(endpoint => endpoint.length > 1 && !endpoint.includes('//'))
      .slice(0, 20); // Limit to first 20 endpoints

  } catch (error) {
    console.error('Failed to scrape endpoints:', error);
    return []; // Return empty array if scraping fails
  }
}

async function manageAPIs() {
  const config = vscode.workspace.getConfiguration('kingdomApiDiscovery');
  const outputDir = config.get<string>('outputDirectory') || 'docs/discovered-apis';
  
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!workspaceRoot) {
    vscode.window.showErrorMessage('No workspace folder found');
    return;
  }

  const resultsFile = path.join(workspaceRoot, outputDir, 'api-discovery-results.json');
  
  if (!fs.existsSync(resultsFile)) {
    vscode.window.showInformationMessage('No APIs discovered yet. Run "Discover APIs" first.');
    return;
  }

  // Open the results file
  const document = await vscode.workspace.openTextDocument(resultsFile);
  vscode.window.showTextDocument(document);
}

async function integrateAPI(apiInfo: APIInfo) {
  const choice = await vscode.window.showQuickPick([
    'Generate Integration Code',
    'Add to Unified API',
    'Create Environment Variables',
    'Open Documentation'
  ], {
    placeHolder: `How would you like to integrate ${apiInfo.name}?`
  });

  switch (choice) {
    case 'Generate Integration Code':
      await generateIntegrationCode(apiInfo);
      break;
    case 'Add to Unified API':
      await addToUnifiedAPI(apiInfo);
      break;
    case 'Create Environment Variables':
      await createEnvironmentVariables(apiInfo);
      break;
    case 'Open Documentation':
      if (apiInfo.documentation.length > 0) {
        vscode.env.openExternal(vscode.Uri.parse(apiInfo.documentation[0]));
      }
      break;
  }
}

async function generateIntegrationCode(apiInfo: APIInfo) {
  const code = `
// ${apiInfo.name} Integration
// Generated by Kingdom API Discovery

import axios from 'axios';

export class ${apiInfo.platform.charAt(0).toUpperCase() + apiInfo.platform.slice(1)}API {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = process.env.${apiInfo.platform.toUpperCase()}_API_BASE_URL || '';
    this.apiKey = process.env.${apiInfo.platform.toUpperCase()}_API_KEY || '';
  }

  private async makeRequest(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', data?: any) {
    try {
      const response = await axios({
        method,
        url: \`\${this.baseURL}\${endpoint}\`,
        data,
        headers: {
          'Authorization': \`Bearer \${this.apiKey}\`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(\`${apiInfo.name} API Error:\`, error);
      throw error;
    }
  }

${apiInfo.endpoints.slice(0, 5).map(endpoint => `
  async ${endpoint.replace(/[\/\-\{\}]/g, '').toLowerCase()}(params?: any) {
    return this.makeRequest('${endpoint}', 'GET', params);
  }`).join('\n')}
}

export const ${apiInfo.platform}API = new ${apiInfo.platform.charAt(0).toUpperCase() + apiInfo.platform.slice(1)}API();
`;

  // Create a new document with the generated code
  const document = await vscode.workspace.openTextDocument({
    content: code,
    language: 'typescript'
  });
  vscode.window.showTextDocument(document);
}

async function addToUnifiedAPI(apiInfo: APIInfo) {
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!workspaceRoot) return;

  const unifiedAPIPath = path.join(workspaceRoot, 'packages/api/sharedApiClient.ts');
  
  if (fs.existsSync(unifiedAPIPath)) {
    const document = await vscode.workspace.openTextDocument(unifiedAPIPath);
    vscode.window.showTextDocument(document);
    vscode.window.showInformationMessage(
      `Add ${apiInfo.name} endpoints to the unified API client. Check the generated integration code for reference.`
    );
  } else {
    vscode.window.showWarningMessage('Unified API client not found. Create it first or check the file path.');
  }
}

async function createEnvironmentVariables(apiInfo: APIInfo) {
  const envVars = `
# ${apiInfo.name} Environment Variables
${apiInfo.platform.toUpperCase()}_API_KEY=your_api_key_here
${apiInfo.platform.toUpperCase()}_API_SECRET=your_api_secret_here
${apiInfo.platform.toUpperCase()}_API_BASE_URL=https://api.${apiInfo.platform}.com
`;

  const document = await vscode.workspace.openTextDocument({
    content: envVars,
    language: 'properties'
  });
  vscode.window.showTextDocument(document);
}

class APITreeDataProvider implements vscode.TreeDataProvider<APIInfo> {
  private _onDidChangeTreeData: vscode.EventEmitter<APIInfo | undefined | null | void> = new vscode.EventEmitter<APIInfo | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<APIInfo | undefined | null | void> = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: APIInfo): vscode.TreeItem {
    const item = new vscode.TreeItem(element.name, vscode.TreeItemCollapsibleState.None);
    item.description = element.platform;
    item.tooltip = `${element.name} - ${element.type} API with ${element.authentication} authentication`;
    item.contextValue = 'apiItem';
    
    // Set icon based on status
    switch (element.status) {
      case 'discovered':
        item.iconPath = new vscode.ThemeIcon('cloud-download', new vscode.ThemeColor('charts.blue'));
        break;
      case 'integrated':
        item.iconPath = new vscode.ThemeIcon('check', new vscode.ThemeColor('charts.green'));
        break;
      case 'error':
        item.iconPath = new vscode.ThemeIcon('error', new vscode.ThemeColor('charts.red'));
        break;
    }

    return item;
  }

  getChildren(element?: APIInfo): Thenable<APIInfo[]> {
    if (!element) {
      return this.getDiscoveredAPIs();
    }
    return Promise.resolve([]);
  }

  private async getDiscoveredAPIs(): Promise<APIInfo[]> {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspaceRoot) return [];

    const config = vscode.workspace.getConfiguration('kingdomApiDiscovery');
    const outputDir = config.get<string>('outputDirectory') || 'docs/discovered-apis';
    const resultsFile = path.join(workspaceRoot, outputDir, 'api-discovery-results.json');

    if (!fs.existsSync(resultsFile)) {
      return [];
    }

    try {
      const results = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
      return Object.values(results) as APIInfo[];
    } catch (error) {
      console.error('Failed to load discovered APIs:', error);
      return [];
    }
  }
}

export function deactivate() {}
