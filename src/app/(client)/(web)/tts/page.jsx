'use client'

import { useState } from 'react'

export default function Home() {
  const [text, setText] = useState('')
  const [voice, setVoice] = useState('nova')

  const handlePlay = async () => {
    const res = await fetch('/tts/api', {
      method: 'POST',
      body: JSON.stringify({
        text,
        voice,
        instructions: 'Giọng rõ ràng, chuyên nghiệp'
      }),
    })

    const blob = await res.blob()
    const audioURL = URL.createObjectURL(blob)
    const audio = new Audio(audioURL)
    audio.play()
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Nhập nội dung muốn AI nói"
        className="w-full p-3 border rounded mb-4"
      />
      <select
        value={voice}
        onChange={(e) => setVoice(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="nova">Nova (nữ)</option>
        <option value="onyx">Onyx (nam)</option>
        <option value="ash">Ash (cứng AI)</option>
        <option value="shimmer">Shimmer (nhẹ nhàng)</option>
        <option value="echo">Echo (trung tính)</option>
      </select>
      <button onClick={handlePlay} className="bg-black text-white px-4 py-2 rounded">
        Nghe thử
      </button>
    </main>
  )
}
