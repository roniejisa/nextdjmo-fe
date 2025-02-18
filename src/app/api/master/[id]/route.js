export async function GET(req, {params}) {
    const {id} = await params;
    const response = await fetch(process.env.NEXT_PUBLIC_ENDPOINT_URL.slice(0, -1) + '/video/hls/encrypted-resolution/' + id, {
        cache: "no-cache",
        cache:"no-cache"
    });
    return new Response(response.body);
};