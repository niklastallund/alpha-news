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
    <Card className="w-full max-w-md bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="text-2xl font-extrabold text-center">
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
            className="bg-background text-foreground border border-gray-400 dark:border-gray-400 rounded-xl p-3 focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-gray-500 transition-all duration-200 shadow-sm"
          />
        </div>

        {/* Från / Till + Swap */}
        <div className="grid grid-cols-5 gap-1 items-end">
          <div className="col-span-2 space-y-2 min-w-0">
            <Label>From</Label>
            <UiSelect value={from} onValueChange={setFrom}>
              <SelectTrigger className="w-full bg-background text-foreground border border-gray-400 dark:border-gray-400 h-10 justify-between rounded-xl hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring transition-all duration-200 shadow-sm">
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

          <div className="flex justify-center">
            <Button
              onClick={swap}
              className="mt-6 bg-secondary text-secondary-foreground hover:bg-secondary/90 border border-gray-400 dark:border-gray-400 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring"
              title="Swap"
            >
              <ArrowLeftRight className="h-5 w-4" />
            </Button>
          </div>

          <div className="col-span-2 space-y-2 min-w-0">
            <Label>To</Label>
            <UiSelect value={to} onValueChange={setTo}>
              <SelectTrigger className="w-full bg-background text-foreground border border-gray-400 dark:border-gray-400 h-10 justify-between rounded-xl hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring transition-all duration-200 shadow-sm">
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
          <div className="flex items-center justify-center gap-2 bg-muted rounded-xl p-4">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Hämtar växelkurs…</span>
          </div>
        ) : converted !== null ? (
          <div className="bg-white dark:bg-neutral-900 text-foreground dark:text-white rounded-xl p-4 text-center shadow-sm transition-colors duration-300">
            <p className="text-sm mb-1 text-muted-foreground dark:text-white/80">
              1 {from} = {rate} {to}
            </p>
            <p className="text-3xl font-bold text-foreground dark:text-white">
              {converted.toFixed(2)} {to}
            </p>
          </div>
        ) : null}

        {/* Fel */}
        {err && (
          <p className="text-center text-destructive bg-destructive/10 border border-destructive/30 rounded-xl p-3 text-sm">
            {err}
          </p>
        )}

        <p className="text-center text-xs text-muted-foreground">
          Rates by frankfurter.app
        </p>
      </CardContent>
    </Card>
  );
}
<p className="text-center text-xs text-muted-foreground"></p>;
