import type React from 'react';

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
  const entry = MOCK_MANIFEST_API[remoteKey];
  if (!entry) throw new Error(`[Runtime Federation] No manifest entry for: ${remoteKey}`);

  const moduleContainer = await import(/* @vite-ignore */ entry.entry).catch((err) => {
    console.error(`[Runtime Federation] Failed to load remote: ${remoteKey}`, err);
    throw err;
  });

  return moduleContainer;
}

export async function loadRemoteComponent<T = any>(
  remoteKey: string,
  exposedPath: string
): Promise<{ default: React.ComponentType<T> }> {
  const moduleContainer = await loadRemoteDynamically(remoteKey);
  const container = moduleContainer.default ?? moduleContainer;

  if (typeof container?.get !== 'function') {
    throw new Error(`[Runtime Federation] Invalid Module Federation container for: ${remoteKey}`);
  }

  try {
    const { __federation_shared__: shareScope = {} } = await import('@module-federation/vite' as any);
    await container.init(shareScope);
  } catch {
    try { await container.init({}); } catch { /* ignore */ }
  }

  const factory = await container.get(exposedPath);
  return factory();
}