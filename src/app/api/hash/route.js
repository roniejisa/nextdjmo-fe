export async function GET(req) {
    const requestUrl = new URL(req.url);
    const signedUrl = requestUrl.searchParams.get("signedUrl");
    const response = await fetch(process.env.NEXT_PUBLIC_ENDPOINT_URL + "video/hls/encrypted/" + signedUrl, {
        method: "GET",
        cache:"no-cache"
    });
    return new Response(response.body);
}