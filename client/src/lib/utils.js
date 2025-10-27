import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import animationData from "../assets/lottie-json.json";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const colors = [
  "bg-[#712c457] text-[#ff006e] border-[1px] border-[#ff006faa]",
  "bg-[#ff60a0] text-[#ff60a] border-[1px] border-[#ff60abb]",
  "bg-[#06d60a0] text-[#06d6a0] border-[1px] border-[#06d6a0bb]",
  "bg-[#4cc9f02a] text-[#4cc9f0] border-[1px] border-[#4cc9f0bb]",
];

export const getColor = (color) => {
  if (typeof color === "number" && color >= 0 && color < colors.length) {
    return colors[color];
  }

  // if color is a string, just return it directly
  if (typeof color === "string") {
    return color;
  }

  // fallback color to prevent crash
  return colors[0];
};


export const animationDefaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
};