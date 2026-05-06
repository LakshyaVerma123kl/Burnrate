"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { AuditResult } from "@/lib/audit-engine";

export function AiSummaryBox({ results }: { results: AuditResult }) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ results })
    })
      .then(r => r.json())
      .then(d => {
        setSummary(d.summary);
        setLoading(false);
      })
      .catch(() => {
        setSummary("Error generating summary.");
        setLoading(false);
      });
  }, [results]);

  if (loading) return <div className="flex items-center text-zinc-500"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</div>;
  return <p className="text-sm text-zinc-300 leading-relaxed">{summary}</p>;
}
