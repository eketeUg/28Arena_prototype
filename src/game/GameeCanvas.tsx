/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useEffect } from "react";
// import Phaser from "phaser";
// import FightScene from "./scenes/FightScene";

// export default function GameCanvas() {
//   useEffect(() => {
//     const config: Phaser.Types.Core.GameConfig = {
//       type: Phaser.AUTO,
//       width: 800,
//       height: 450,
//       backgroundColor: "#1a1a1a",
//       parent: "phaser-container",
//       physics: {
//         default: "arcade",
//         arcade: {
//           gravity: { x: 0, y: 800 },
//           debug: false,
//         },
//       },
//       scene: [FightScene],
//     };

//     const game = new Phaser.Game(config);
//     return () => game.destroy(true);
//   }, []);

//   return <div id="phaser-container" />;
// }

import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import FightScene from "./scenes/FightScene";

const GameCanvas: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 400,
      parent: containerRef.current || undefined,
      backgroundColor: "#1e1e1e",
      physics: {
        default: "arcade",
        arcade: {
          gravity: { x: 0, y: 800 },
          debug: false,
        },
      },
      scene: [FightScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    if (!gameRef.current) {
      gameRef.current = new Phaser.Game(config);
    }

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  // Handle landscape lock for mobile
  const handleStart = async () => {
    if ("orientation" in screen && (screen as any).orientation.lock) {
      try {
        await (screen as any).orientation.lock("landscape");
      } catch (err) {
        console.warn("Orientation lock failed:", err);
      }
    }
  };

  return (
    <div
      className="flex items-center justify-center w-screen h-screen bg-black"
      onClick={handleStart}
    >
      <div ref={containerRef} className="flex justify-center items-center" />
    </div>
  );
};

export default GameCanvas;
