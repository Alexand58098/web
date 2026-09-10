/**
 * Gofile Client for direct browser integration with Gofile API
 * Supports token authentication, dynamic X-Website-Token generation,
 * and direct streaming/unpacking of game archives.
 */

export interface GofileChildItem {
  id: string;
  name: string;
  type: string;
  size: number;
  link: string;
  downloadCount?: number;
  md5?: string;
  mimetype?: string;
}

export interface GofileApiResponse {
  status: string;
  data?: {
    id?: string;
    name?: string;
    type?: string;
    totalSize?: number;
    code?: string;
    children?: Record<string, GofileChildItem>;
    link?: string;
  };
  metadata?: Record<string, unknown>;
}

export const GOFILE_CONFIG = {
  defaultToken: 'kmkpx0gn0siwWBCZzAfpy4TRDqfqscPA',
  defaultFolderId: 'qfXbfAmk',
  defaultUrl: 'https://gofile.io/d/qfXbfAmk',
  targetFileName: 'gtavc-full-github.zip',
  targetSize: '77.6 MB',
  salt: '12af056dacea0b',
};

/**
 * Computes Gofile's dynamic X-Website-Token client-side
 * Formula: sha256(userAgent::lang::apiToken::(time/14400)::salt)
 */
export async function generateGofileWebsiteToken(token: string): Promise<string> {
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Mozilla/5.0';
  const lang = (typeof navigator !== 'undefined' && navigator.language) ? navigator.language : 'en-US';
  const timeWindow = Math.floor((Date.now() / 1000) / 14400);
  const salt = GOFILE_CONFIG.salt;
  const raw = `${userAgent}::${lang}::${token}::${timeWindow}::${salt}`;

  const encoder = new TextEncoder();
  const data = encoder.encode(raw);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Queries Gofile folder contents using account token and generated website token
 */
export async function fetchGofileContents(
  token: string = GOFILE_CONFIG.defaultToken,
  contentId: string = GOFILE_CONFIG.defaultFolderId
): Promise<GofileApiResponse> {
  const websiteToken = await generateGofileWebsiteToken(token);
  const lang = (typeof navigator !== 'undefined' && navigator.language) ? navigator.language : 'en-US';

  const query = new URLSearchParams({
    page: '1',
    pageSize: '100',
    sortField: 'name',
    sortDirection: '1',
  });

  const response = await fetch(`https://api.gofile.io/contents/${encodeURIComponent(contentId)}?${query}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-Website-Token': websiteToken,
      'X-BL': lang,
      'Accept': 'application/json, text/plain, */*',
    },
  });

  if (!response.ok) {
    throw new Error(`Gofile API returned status ${response.status}: ${response.statusText}`);
  }

  const result = (await response.json()) as GofileApiResponse;
  return result;
}

/**
 * Downloads a binary file with progress monitoring
 */
export async function downloadFileWithProgress(
  url: string,
  token: string,
  onProgress?: (receivedBytes: number, totalBytes: number) => void
): Promise<ArrayBuffer> {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Download failed with HTTP ${response.status}: ${response.statusText}`);
  }

  const contentLength = response.headers.get('Content-Length');
  const totalBytes = contentLength ? parseInt(contentLength, 10) : 77611663;

  if (!response.body) {
    return await response.arrayBuffer();
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let receivedBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(value);
      receivedBytes += value.length;
      if (onProgress) {
        onProgress(receivedBytes, totalBytes);
      }
    }
  }

  const allChunks = new Uint8Array(receivedBytes);
  let position = 0;
  for (const chunk of chunks) {
    allChunks.set(chunk, position);
    position += chunk.length;
  }

  return allChunks.buffer;
}
