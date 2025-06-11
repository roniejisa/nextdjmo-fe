export async function GET(req, {params}) {
    const {id} = await params;
    
    const response = await fetch(process.env.NEXT_PUBLIC_ENDPOINT_URL.slice(0, -1) + '/video/hls/encrypted-resolution/' + id, {
        cache: "no-cache"
    });
    
    const headers = new Headers();
    headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');
    headers.set('Content-Type', 'application/vnd.apple.mpegurl');
    
    return new Response(response.body, { headers });
}