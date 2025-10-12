import React from "react";

export default function Loader({ type = "ring", size = "w-20 h-20", color = "blue" }) {
  const colors = {
    blue: "border-blue-500 bg-blue-500",
    purple: "border-purple-500 bg-purple-500",
    emerald: "border-emerald-500 bg-emerald-500",
    pink: "border-pink-500 bg-pink-500",
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      {/* RING LOADER */}
      {type === "ring" && (
        <div className={`relative ${size}`}>
          <div
            className={`absolute inset-0 rounded-full border-8 border-t-transparent ${colors[color]} animate-spin`}
          ></div>
          <div
            className={`absolute inset-2 rounded-full border-8 border-t-transparent ${colors[color]} opacity-70 blur-sm animate-[spin_1.5s_linear_infinite_reverse]`}
          ></div>
          <div className="absolute inset-4 rounded-full bg-white"></div>
        </div>
      )}

      {/* ORBIT LOADER */}
      {type === "orbit" && (
        <div className="relative w-16 h-16">
          <div
            className={`absolute w-3 h-3 ${colors[color]} rounded-full animate-[spin_1.2s_linear_infinite] origin-[150%_50%]`}
          ></div>
          <div
            className={`absolute w-3 h-3 ${colors[color]} rounded-full animate-[spin_1.2s_linear_infinite_reverse] origin-[-50%_50%]`}
          ></div>
        </div>
      )}

      {/* PULSE LOADER */}
      {type === "pulse" && (
        <div className="relative flex items-center justify-center">
          <div className={`absolute w-12 h-12 ${colors[color]} rounded-full animate-ping`}></div>
          <div className={`absolute w-8 h-8 ${colors[color]} rounded-full animate-pulse`}></div>
          <div className={`w-4 h-4 ${colors[color]} rounded-full animate-bounce`}></div>
        </div>
      )}
    </div>
  );
}
