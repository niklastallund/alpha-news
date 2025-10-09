import { ModeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="w-full bg-blue-800 text-white">
      <div className="text-4xl p-2 text-center">
        <ModeToggle />
        Alfa<div className="inline-block animate-bounce">News📰</div>!
      </div>
    </div>
  );
}
