// lib/auth.js - SIMPLIFIED VERSION (No Cache)

export async function refreshAuthToken(refreshToken) {
  const AUTH_BASE_URL = process.env.NEXT_PUBLIC_ENDPOINT_URL + 'auth';
  const API_KEY = process.env.API_KEY || '123456';

  console.log('Starting token refresh...');

  try {
    const response = await fetch(AUTH_BASE_URL + '/refresh-token', {
      headers: {
        "X-API-KEY": API_KEY,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ refreshToken })
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.status === 200 && data?.data) {
        console.log('Token refresh API success');
        return {
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
          expiresIn: data.data.expiresIn || 24 * 60 * 60
        };
      }
    }
    
    console.log('Token refresh API failed:', response.status, await response.text());
    throw new Error(`Token refresh failed: ${response.status}`);
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
}