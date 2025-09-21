import React, { useState, useEffect } from "react";

export default function BirthdayCard() {
  const [blownCount, setBlownCount] = useState(0);
  const candleCount = 21;
  const [messageVisible, setMessageVisible] = useState(false);
  const [message, setMessage] = useState("");
  const wordLimit = 1000;

  // Handle text change with word limit
  const handleChange = (e) => {
    const words = e.target.value.split(/\s+/);
    if (words.length <= wordLimit) {
      setMessage(e.target.value);
    }
  };

  // Initialize microphone detection
  useEffect(() => {
    if (!navigator.mediaDevices) return;

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      source.connect(analyser);

      const data = new Uint8Array(analyser.frequencyBinCount);

      function detectBlow() {
        analyser.getByteFrequencyData(data);
        let volume = data.reduce((a, b) => a + b) / data.length;

        if (volume > 60) {
          extinguishRandomCandle();
        }
        requestAnimationFrame(detectBlow);
      }

      detectBlow();
    });
  }, []);

  // Extinguish a random candle
  const extinguishRandomCandle = () => {
    if (blownCount < candleCount) {
      setBlownCount((prev) => prev + 1);
    }
  };

  // Check if all candles are blown
  useEffect(() => {
    if (blownCount >= candleCount) {
      setMessageVisible(true);
    }
  }, [blownCount]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff8e7] p-6">
      <div className="flex bg-[#fff8e7] rounded-2xl shadow-xl w-full max-w-5xl overflow-hidden">
        {/* Message Box (left side) */}
        <div
          className={`message-box flex-1 bg-[#fffbea] p-6 border-r-4 border-[#c9a66b] ${
            messageVisible ? "show" : ""
          }`}
        >
          <h1 className="text-4xl font-bold text-center text-[#8B5E3C] font-[cursive] mb-4">
            My Baby 💕
          </h1>
          <div className="relative">
            <textarea
              value={message}
              onChange={handleChange}
              placeholder="Write your sweet message here (max 1000 words)..."
              readOnly={!messageVisible}
              className="w-full h-96 p-4 bg-[#fffdf5] border-2 border-yellow-200 rounded-2xl resize-none overflow-y-scroll 
              font-[cursive] text-[#8B5E3C] text-lg leading-relaxed tracking-wide
              focus:outline-none focus:ring-2 focus:ring-yellow-300
              custom-scrollbar"
            />
            <p className="absolute bottom-2 right-3 text-sm text-[#a67b5b] font-[cursive]">
              {message.split(/\s+/).filter(Boolean).length}/{wordLimit} words
            </p>
          </div>
        </div>

        {/* Cake with sunflower decoration + candles */}
        <div className="flex-1 flex items-center justify-center bg-[#fff8e7] relative">
          <div className="relative">
            {/* Cake base */}
            <div className="w-56 h-56 rounded-full bg-[#fdf1b8] border-4 border-[#d4a373] flex items-center justify-center relative overflow-hidden">
              {/* Sunflowers around cake */}
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-12 h-12"
                  style={{
                    top: `${20 + (i % 3) * 70}px`,
                    left: `${20 + Math.floor(i / 3) * 150}px`,
                  }}
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Petals */}
                    {[...Array(8)].map((_, p) => (
                      <div
                        key={p}
                        className="absolute w-3 h-6 bg-yellow-400 rounded-full"
                        style={{
                          transform: `rotate(${p * 45}deg) translateY(-10px)`,
                          transformOrigin: "center center",
                        }}
                      ></div>
                    ))}
                    {/* Flower center */}
                    <div className="w-6 h-6 bg-[#8B5E3C] rounded-full"></div>
                  </div>
                </div>
              ))}

              {/* Candles on top */}
              <div className="absolute -top-14 flex flex-wrap gap-2 justify-center w-60">
                {[...Array(candleCount)].map((_, i) => (
                  <div
                    key={i}
                    onClick={extinguishRandomCandle}
                    className="flex flex-col items-center cursor-pointer"
                  >
                    {/* Flame */}
                    {i >= blownCount ? (
                      <div className="w-2 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                    ) : (
                      <div className="w-2 h-3"></div>
                    )}
                    {/* Candle body */}
                    <div className="w-2 h-8 bg-[#8B5E3C] rounded-sm"></div>
                  </div>
                ))}
              </div>

              <p className="text-[#8B5E3C] font-[cursive] text-lg absolute bottom-4">
                🎂 Happy Birthday 🎂
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .message-box {
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transition: opacity 1.2s ease-in-out;
        }
        .message-box.show {
          display: flex;
          opacity: 1;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #fff6cc; /* pastel yellow */
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #f4d35e; /* sunflower yellow */
          border-radius: 20px;
          border: 2px solid #fff6cc;
          transition: background-color 0.3s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #e0b937; /* darker sunflower when hover */
        }
      `}</style>
    </div>
  );
}
