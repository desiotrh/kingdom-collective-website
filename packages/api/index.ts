/**
 * 🏛️ KINGDOM COLLECTIVE - UNIFIED API PACKAGE
 * Main entry point for the shared API client
 */

// Export the shared API client
export { sharedApiClient, SharedApiClient } from './sharedApiClient';

// Export app-specific clients
export { 
  KingdomClipsApiClient,
  KingdomVoiceApiClient,
  KingdomLaunchpadApiClient,
  KingdomCircleApiClient,
  KingdomLensApiClient,
  KingdomStudiosApiClient,
  apiClients
} from './appSpecificClients';

// Export types and interfaces
export type { 
  ApiResponse, 
  PaginatedResponse 
} from './sharedApiClient';

// Export API endpoints for reference
export { API_ENDPOINTS } from './sharedApiClient';

// Default export for convenience
export default {
  sharedApiClient: () => import('./sharedApiClient').then(m => m.sharedApiClient),
  apiClients: () => import('./appSpecificClients').then(m => m.apiClients),
}; 