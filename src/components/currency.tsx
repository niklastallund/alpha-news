"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeftRight, Loader2 } from "lucide-react";

export default function Currency() {
  const [list, setList] = useState<Array<[string, string]>>([]); // [["USD","US Dollar"], ...]
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [amount, setAmount] = useState(" ");
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // 1) Hämta valutalista (en gång)
  useEffect(() => {
    fetch("https://api.frankfurter.app/currencies")
      .then((r) => r.json())
      .then((data) => setList(Object.entries(data)))
      .catch(() => setErr("Valutalistan kunde inte hämtas."));
  }, []);

  // 2) Hämta kurs när from/to ändras
  useEffect(() => {
    if (from === to) {
      setRate(1);
      return;
    }
    setLoading(true);
    fetch(`https://api.frankfurter.app/latest?from=${from}&to=${to}`)
      .then((r) => r.json())
      .then((d) => setRate(d?.rates?.[to] ?? null))
      .catch(() => setErr("Växelkursen kunde inte hämtas."))
      .finally(() => setLoading(false));
  }, [from, to]);

  // 3) Enkel beräkning (ingen memo)
  const n = Number(String(amount).replace(",", "."));
  const converted = rate === null || !isFinite(n) || n < 0 ? null : n * rate;

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <Card className="w-full max-w-md bg-gradient-to-br from-sky-100 to-blue-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-blue-900 text-2xl">
          Currency Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Belopp */}
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
            className="bg-white/70"
          />
        </div>

        {/* Från / Till + Swap */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
          <div className="col-span-1 sm:col-span-2 space-y-2">
            <Label>From</Label>
            <UiSelect value={from} onValueChange={setFrom}>
              <SelectTrigger className="w-full bg-white/70 h-10 justify-between hover:bg-blue-200 transition">
                <SelectValue placeholder="Välj" />
              </SelectTrigger>
              <SelectContent>
                {list.map(([code, name]) => (
                  <SelectItem key={code} value={code}>
                    {code} — {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </UiSelect>
          </div>

          <div className="flex justify-center items-center col-span-1 sm:col-span-1">
            <Button
              onClick={swap}
              className="mt-0 sm:mt-6 bg-white/70 w-10 h-10 p-0 flex items-center justify-center"
              title="Swap"
              aria-label="Swap currencies"
            >
              <ArrowLeftRight className="h-5 w-5 text-blue-800" />
            </Button>
          </div>

          <div className="col-span-1 sm:col-span-2 space-y-2">
            <Label>To</Label>
            <UiSelect value={to} onValueChange={setTo}>
              <SelectTrigger className="w-full bg-white/70 h-10 justify-between hover:bg-blue-200 transition">
                <SelectValue placeholder="Välj valuta" />
              </SelectTrigger>
              <SelectContent>
                {list.map(([code, name]) => (
                  <SelectItem key={code} value={code}>
                    {code} — {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </UiSelect>
          </div>
        </div>

        {/* Resultat */}
        {loading ? (
          <div className="flex items-center justify-center gap-2 bg-white/60 rounded-xl p-4">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Hämtar växelkurs…</span>
          </div>
        ) : converted !== null ? (
          <div className="bg-white/70 rounded-xl p-4 text-center">
            <p className="text-blue-900 text-sm mb-1">
              1 {from} = {rate} {to}
            </p>
            <p className="text-3xl font-bold text-blue-800">
              {converted.toFixed(2)} {to}
            </p>
          </div>
        ) : null}

        {/* Fel */}
        {err && (
          <p className="text-center text-red-700 bg-red-100 rounded-xl p-3 text-sm">
            {err}
          </p>
        )}

        <p className="text-center text-xs text-gray-600">
          Rates by frankfurter.app
        </p>
      </CardContent>
    </Card>
  );
}
