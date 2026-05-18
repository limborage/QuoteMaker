export interface RemoteManifestEntry {
  name: string;
  entry: string;
  type: 'module';
}

const MOCK_MANIFEST_API: Record<string, RemoteManifestEntry> = {
  quote_mfe: {
    name: 'quote_mfe',
    entry: 'http://localhost:3001/remoteEntry.js',
    type: 'module'
  }
};

export async function loadRemoteDynamically(remoteKey: string): Promise<any> {
  const appMetaData = MOCK_MANIFEST_API[remoteKey];
  
  if (!appMetaData) {
    throw new Error(`[Runtime Federation] App backend mapping not found for key: ${remoteKey}`);
  }

  try {
    // Leverage the browser's native ES Module loader to grab the compiled entry point container
    const moduleContainer = await import(/* @vite-ignore */ appMetaData.entry);
    
    // Return the loaded module container back to the caller component execution loop
    return moduleContainer;
  } catch (error) {
    console.error(`Failed to dynamically bootstrap remote module via native ESM import: ${remoteKey}`, error);
    throw error;
  }
}