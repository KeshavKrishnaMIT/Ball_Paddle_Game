import React, { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

function Game() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState("start"); 
  const [restartKey, setRestartKey] = useState(0);
  const [score, setScore] = useState(0); // React state for live score

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let paddle = { width: 180, height: 15 };
    let paddleX = canvas.width / 2 - paddle.width / 2;

    let ball = { x: canvas.width / 2, y: canvas.height - 120, radius: 15, dx: 8, dy: -8 };

    let stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 0.5 + 0.2
    }));

    let hue = 0;
    let introBlink = 0;
    let animationId;

    const mouseMoveHandler = (e) => {
      let mouseX = e.clientX;
      if (mouseX < paddle.width / 2) mouseX = paddle.width / 2;
      if (mouseX > canvas.width - paddle.width / 2) mouseX = canvas.width - paddle.width / 2;
      paddleX = mouseX - paddle.width / 2;
    };

    document.addEventListener("mousemove", mouseMoveHandler);

    const drawStars = () => {
      stars.forEach(star => {
        ctx.fillStyle = `hsl(${hue}, 80%, 80%)`;
        ctx.fillRect(star.x, star.y, star.size, star.size);
        star.y += star.speed;
        if (star.y > canvas.height) star.y = 0;
      });
    };

    const drawBall = () => {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.shadowColor = `hsl(${hue}, 100%, 50%)`;
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.closePath();
      ctx.shadowBlur = 0;
    };

    const drawPaddle = () => {
      ctx.beginPath();
      ctx.rect(paddleX, canvas.height - paddle.height - 50, paddle.width, paddle.height);
      ctx.fillStyle = `hsl(${(hue + 180) % 360}, 100%, 50%)`;
      ctx.shadowColor = `hsl(${(hue + 180) % 360}, 100%, 50%)`;
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.closePath();
      ctx.shadowBlur = 0;
    };

    const drawText = (text, size, y, glow = false) => {
      ctx.fillStyle = "#fff";
      if (glow) {
        ctx.shadowColor = "#fff";
        ctx.shadowBlur = 20;
      }
      ctx.font = `${size}px monospace`;
      ctx.textAlign = "center";
      ctx.fillText(text, canvas.width / 2, y);
      ctx.shadowBlur = 0;
    };

    const drawSkull = () => {
      ctx.fillStyle = "#fff";
      const skull = [
        "  XXX  XXX  ",
        " XXXXX XXXXX",
        "XXXXXXXXXXXX",
        "XX  XX  XX  ",
        "XXXXXXXXXXXX",
        " XX XXXX XX ",
        "   XXXX     "
      ];
      skull.forEach((row, i) => {
        for (let j = 0; j < row.length; j++) {
          if (row[j] === "X") {
            ctx.fillRect(canvas.width / 2 - 48 + j * 16, canvas.height / 2 - 56 + i * 16, 16, 16);
          }
        }
      });
      drawText("GAME OVER", 64, canvas.height / 2 + 120, true);
      drawText(`Score: ${score}`, 48, canvas.height / 2 + 180, true); // show React state score
      drawText("Click to RESTART", 36, canvas.height / 2 + 240, true);
    };

    const updateStartScreen = () => {
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawStars();
      drawText("PIXEL ARCADE", 80, canvas.height / 2 - 60, true);
      if (Math.floor(introBlink / 30) % 2 === 0) {
        drawText("CLICK TO START → LET'S GO!", 36, canvas.height / 2 + 40, true);
      }
      introBlink++;
    };

    const gameLoop = () => {
      hue = (hue + 1) % 360;

      if (gameState === "start") {
        updateStartScreen();
        animationId = requestAnimationFrame(gameLoop);
        return;
      }

      if (gameState === "gameOver") {
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawStars();
        drawSkull();
        animationId = requestAnimationFrame(gameLoop);
        return;
      }

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawStars();
      drawBall();
      drawPaddle();

      ball.x += ball.dx;
      ball.y += ball.dy;

      if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) ball.dx = -ball.dx;
      if (ball.y + ball.dy < ball.radius) ball.dy = -ball.dy;
      else if (ball.y + ball.dy > canvas.height - ball.radius - 50) {
        if (ball.x > paddleX && ball.x < paddleX + paddle.width) {
          ball.dy = -ball.dy;
          ball.dx *= 1.1;
          ball.dy *= 1.1;
          setScore(prev => prev + 24); // increment React state score by 24
        } else {
          setGameState("gameOver");
        }
      }

      animationId = requestAnimationFrame(gameLoop);
    };

    setScore(0); // reset score on each restart
    gameLoop();

    return () => {
      document.removeEventListener("mousemove", mouseMoveHandler);
      cancelAnimationFrame(animationId);
    };
  }, [gameState, restartKey]);

  const handleCanvasClick = () => {
    if (gameState === "start" || gameState === "gameOver") {
      setRestartKey(prev => prev + 1); 
      setGameState("playing");
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleCanvasClick}
      style={{ display: "block", width: "100vw", height: "100vh", cursor: "pointer" }}
    />
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
