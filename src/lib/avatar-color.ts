// Background colors for avatar placeholders
const AVATAR_BG = [
  "bg-rose-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-lime-600",
  "bg-emerald-500",
  "bg-teal-500",
  "bg-sky-500",
  "bg-indigo-500",
  "bg-violet-500",
  "bg-pink-500",
];

// Picks a background color based on a string seed (name in this case)
// to ensure consistent colors for the same user
export function pickAvatarBg(seed?: string) {
  if (!seed) return "bg-gray-400";
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return AVATAR_BG[Math.abs(hash) % AVATAR_BG.length];
}
