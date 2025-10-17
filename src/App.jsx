import React, { useState, useRef, useEffect } from "react";
import PixelButton from "./components/PixelButton";

const App = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let x = canvas.width / 2;
    let y = canvas.height / 2;
    let dx = 5;
    let dy = 4;
    const radius = 20;

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = "#00ffff";
      ctx.fill();

      if (x + radius > canvas.width || x - radius < 0) dx = -dx;
      if (y + radius > canvas.height || y - radius < 0) dy = -dy;

      x += dx;
      y += dy;

      requestAnimationFrame(animate);
    };

    animate();
  }, [gameStarted]);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black text-cyan-400 font-[Press_Start_2P]">
      {!gameStarted ? (
        <div className="text-center">
          <h1 className="text-3xl mb-8">🎮 PIXEL ARCADE 🎮</h1>
          <PixelButton onClick={() => setGameStarted(true)} text="START GAME" />
        </div>
      ) : (
        <canvas ref={canvasRef} className="w-screen h-screen"></canvas>
      )}
    </div>
  );
};

export default App;
