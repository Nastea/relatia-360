"use client";
import { useEffect, useState } from "react";

export default function ReportPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    if (!uid) return;
    fetch(`/api/report?userId=${encodeURIComponent(uid)}`)
      .then((r) => r.json())
      .then((j) => setData(j.report?.data ?? {}));
  }, []);

  if (!data) return <main className="p-6">Loading…</main>;

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6 text-neutral-900">
      <h1 className="text-2xl font-semibold">My Course Report</h1>
      <p className="text-sm text-neutral-600">This report updates after each lesson.</p>

      {Object.keys(data).length === 0 ? (
        <div className="border rounded p-4 bg-yellow-50 text-yellow-800">No entries yet.</div>
      ) : (
        <div className="space-y-4">
          {Object.entries(data).map(([k, v]) => (
            <div key={k} className="border rounded p-4 bg-white">
              <div className="font-semibold mb-2">{k}</div>
              <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(v, null, 2)}</pre>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
