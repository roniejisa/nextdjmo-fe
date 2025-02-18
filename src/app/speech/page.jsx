"use client";

import { useState, useRef, useEffect } from "react";

export default function SpeechToTextWithWave() {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isSilent, setIsSilent] = useState(false);
  const silenceTimeoutRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const canvasRef = useRef(null);
  const timerRef = useRef(null);
  let recognition;

  if (typeof window !== "undefined") {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true; // Tiếp tục lắng nghe
    recognition.interimResults = true;
    recognition.lang = "vi-VN";
  }

  useEffect(() => {
    if (!isListening) return;

    // Setup Web Audio API
    const initAudio = async () => {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      microphoneRef.current =
        audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      microphoneRef.current.connect(analyserRef.current);

      drawWave();
    };

    const drawWave = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        if (!isListening) return;

        analyserRef.current.getByteTimeDomainData(dataArray);

        ctx.fillStyle = "#f3f3f3";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.lineWidth = 2;
        ctx.strokeStyle = "#0070f3";
        ctx.beginPath();

        const sliceWidth = (canvas.width * 1.0) / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * canvas.height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();

        requestAnimationFrame(draw);
      };

      draw();
    };

    initAudio();

    return () => {
      audioContextRef.current?.close();
      analyserRef.current?.disconnect();
      microphoneRef.current?.disconnect();
    };
  }, [isListening]);

  const resetSilenceTimer = () => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }

    silenceTimeoutRef.current = setTimeout(() => {
      stopListening();
    }, 10000); // 5 giây không nói sẽ dừng
  };

  const startListening = () => {
    if (!recognition)
      return alert("Browser does not support speech recognition.");
    setIsListening(true);
    setText("");
    setSeconds(0);
    setIsSilent(false);

    // Start the timer
    timerRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    recognition.start();

    recognition.onresult = (event) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setText((prev) => prev + transcript + " ");
        } else {
          interimTranscript += transcript;
        }
      }
      resetSilenceTimer(); // Reset lại thời gian chờ khi nhận được kết quả
    };

    recognition.onend = () => {
      if (isListening && !isSilent) {
        recognition.start(); // Khởi động lại nếu chưa quá 5 giây
      }
    };

    recognition.onerror = (event) => console.error(event.error);
    resetSilenceTimer(); // Bắt đầu bộ đếm thời gian chờ
  };

  const stopListening = () => {
    setIsListening(false);
    setIsSilent(true);

    // Stop the timer
    clearInterval(timerRef.current);
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);

    recognition.stop();
  };

  return (
    <div>
      <p>
        <strong>Thời gian nói:</strong> {seconds} seconds
      </p>
      <div className="flex gap-4">
        <input
          autoComplete="off"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Hãy nhập hoặc nói gì đó nào"
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            zIndex: "2",
            position: "relative",
            borderColor: isListening ? "red" : "#ccc",
          }}
        />
        <button>
          {isListening ? (
            <span onClick={stopListening}>Stop</span>
          ) : (
            <span onClick={startListening}>Start</span>
          )}
          <canvas
            className="rounded-full"
            ref={canvasRef}
            width="50"
            height="50"
            style={{}}
          ></canvas>
        </button>
      </div>
    </div>
  );
}
