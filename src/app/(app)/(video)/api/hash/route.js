// src\app\api\hash\route.js
export async function GET(req) {
    const requestUrl = new URL(req.url);
    const signedUrl = requestUrl.searchParams.get("signedUrl");
    
    const response = await fetch(process.env.NEXT_PUBLIC_ENDPOINT_URL + "video/hls/encrypted/" + signedUrl, {
        method: "GET",
        cache: "no-cache"
    });
    
    const headers = new Headers();
    headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');
    headers.set('Content-Type', 'application/vnd.apple.mpegurl');
    
    return new Response(response.body, { headers });
}