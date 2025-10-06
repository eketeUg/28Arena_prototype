import React from "react";
import EventBus from "./EventBus";

const MobileControls: React.FC = () => {
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  if (!isMobile) return null;

  const emit = (key: string) => {
    EventBus.emit("mobile-control", key);
  };

  return (
    <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3">
      <button
        className="bg-gray-800 text-white px-5 py-3 rounded-xl text-lg"
        onTouchStart={() => emit("A")}
      >
        ⬅️
      </button>
      <button
        className="bg-gray-800 text-white px-5 py-3 rounded-xl text-lg"
        onTouchStart={() => emit("D")}
      >
        ➡️
      </button>
      <button
        className="bg-gray-800 text-white px-5 py-3 rounded-xl text-lg"
        onTouchStart={() => emit("W")}
      >
        ⬆️
      </button>
      <button
        className="bg-red-600 text-white px-5 py-3 rounded-xl text-lg"
        onTouchStart={() => emit("SPACE")}
      >
        ⚔️
      </button>
    </div>
  );
};

export default MobileControls;
