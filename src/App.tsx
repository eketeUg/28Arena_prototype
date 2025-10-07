import GameCanvas from "./game/GameCanvas";

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
      <h1 style={{ marginBottom: "10px" }}>⚔️ Arena 28 test controller</h1>
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
