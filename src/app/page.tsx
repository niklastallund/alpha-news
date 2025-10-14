import Ticker from "@/components/ticker";

export default function Home() {
  return (
    <main className="p-2">
      <span className="inline-block bg-red-600 text-white text-sm font-semibold px-3 py-1 uppercase tracking-wide mb-1">
        live
      </span>

      <Ticker />
    </main>
  );
}
