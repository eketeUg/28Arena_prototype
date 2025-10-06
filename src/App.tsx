// import GameCanvas from "./game/GameeCanvas";

// export default function App() {
//   return (
//     <div
//       style={{
//         background: "black",
//         color: "white",
//         height: "100vh",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     >
//       <h1>⚔️ Simple Fighting Prototype (TS)</h1>
//       <GameCanvas />
//       <p>Player1: A/D/W + SPACE | Player2: ←/→/↑ + ↓</p>
//     </div>
//   );
// }

import GameCanvas from "./game/GameeCanvas";

export default function App() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        backgroundColor: "#000",
        color: "#fff",
        margin: 0,
        overflow: "hidden",
      }}
    >
      <h1 style={{ marginBottom: "10px" }}>⚔️ 28 Fighting Arena</h1>
      <div
        id="game-wrapper"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <GameCanvas />
      </div>
      <p style={{ marginTop: "10px", fontSize: "14px" }}>
        Player1: A/D/W + SPACE | Player2: ←/→/↑ + ↓
      </p>
    </div>
  );
}
