// src/app/api/video/[id]/route.js
export async function GET(req, { params }) {
  const { id } = await params;

  try {
    // Chỉ forward request tới Django backend
    const response = await fetch(
      process.env.NEXT_PUBLIC_ENDPOINT_URL.slice(0, -1) +
        "/video/hls/decrypted/" +
        id,
      {
        cache: "no-cache",
        headers: {
          "X-API-KEY": "123456",
        },
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    
    // Trả về JSON nguyên bản - việc decode sẽ được xử lý ở client
    return new Response(JSON.stringify(json), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "X-API-KEY",
      },
    });
    
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch video data" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}