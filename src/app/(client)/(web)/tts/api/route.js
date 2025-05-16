// app/api/tts-proxy/route.ts
export async function POST(req) {
  const body = await req.text()
  const backendRes = await fetch(process.env.NEXT_PUBLIC_ENDPOINT_URL+'api/tts/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  })

  const buffer = await backendRes.arrayBuffer()

  return new Response(buffer, {
    headers: {
      'Content-Type': 'audio/wav',
    },
  })
}
