import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';
import { createLocalClient } from '@/lib/localAuth';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

// Check if Base44 is configured
const isBase44Configured = appId && appId !== 'null' && appId !== 'undefined';

let base44;

if (isBase44Configured) {
  // Create Base44 client with authentication
  base44 = createClient({
    appId,
    token,
    functionsVersion,
    serverUrl: '',
    requiresAuth: false,
    appBaseUrl
  });
} else {
  // Use local authentication system for standalone deployment
  console.log('Using local authentication (standalone mode)');
  base44 = createLocalClient();
}

export { base44 };
