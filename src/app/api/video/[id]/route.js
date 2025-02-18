export async function GET(req, {params}) {
    const {id} = await params;
    const response = await fetch(process.env.NEXT_PUBLIC_ENDPOINT_URL.slice(0, -1) + '/video/hls/decrypted/' + id, {
        cache: "no-cache",
        headers: {
            "X-API-KEY": "123456", 
        },
        method: "GET",
    });
    // Truyền trực tiếp dữ liệu video mà không cần tải toàn bộ
    return response
};